import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from '@/common/providers/database/postgres.service';
import {
  CreateBranchDTO,
  CreateOrganizationDTO,
  OnboardingStatusResponse,
} from './dto/onboarding.dto';

interface OnboardingStatus {
  has_org: boolean;
  has_branch: boolean;
  org_id: number | null;
  branch_id: number | null;
  can_access_dashboard: boolean;
  next_step: 'create_organization' | 'create_first_branch' | 'go_to_dashboard';
}

@Injectable()
export class OnboardingService {
  constructor(private readonly pool: PostgresService) {}

  async getStatus(userId: number): Promise<OnboardingStatusResponse> {
    // STEP 1: Fetch user from DB
    const userResult = await this.pool.query(
      `SELECT id, org_id, branch_id, is_active FROM users WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      throw new ForbiddenException('Account is disabled');
    }

    // STEP 2 & 5: Determine flags with active validation
    let has_org = user.org_id != null;
    let has_branch = user.branch_id != null;

    if (has_org) {
      const orgResult = await this.pool.query(`SELECT is_active FROM organizations WHERE id = $1`, [
        user.org_id,
      ]);
      if (orgResult.rows.length === 0 || !orgResult.rows[0].is_active) {
        has_org = false;
        has_branch = false; // branch is meaningless without a valid org
      }
    }

    if (has_branch) {
      const branchResult = await this.pool.query(
        `SELECT is_active FROM organization_branches WHERE id = $1`,
        [user.branch_id],
      );
      if (branchResult.rows.length === 0 || !branchResult.rows[0].is_active) {
        has_branch = false;
      }
    }

    // STEP 3 & 4: Compute dashboard access and next step
    const can_access_dashboard = has_org && has_branch;

    const next_step: OnboardingStatus['next_step'] = !has_org
      ? 'create_organization'
      : !has_branch
        ? 'create_first_branch'
        : 'go_to_dashboard';

    return {
      message: 'Onboarding status fetched successfully',
      data: {
        has_org,
        has_branch,
        org_id: has_org ? user.org_id : null,
        branch_id: has_branch ? user.branch_id : null,
        can_access_dashboard,
        next_step,
      },
    };
  }

  async createOrganization(userId: number, dto: CreateOrganizationDTO) {
    // STEP 2: Pre-condition check — user must not already have an org
    const userResult = await this.pool.query(`SELECT id, org_id FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userResult.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = userResult.rows[0];

    if (user.org_id != null) {
      throw new BadRequestException('Organization already created');
    }

    // STEP 4: Check code uniqueness
    const codeConflict = await this.pool.query(`SELECT id FROM organizations WHERE code = $1`, [
      dto.code,
    ]);

    if (codeConflict.rows.length > 0) {
      throw new ConflictException('Organization with this code already exists');
    }

    // STEP 5: Create organization
    const orgResult = await this.pool.query(
      `INSERT INTO organizations (name, code, owner_id, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id, name, code, owner_id, is_active`,
      [dto.name, dto.code, userId],
    );

    const org = orgResult.rows[0];

    // STEP 6: Link org to user
    await this.pool.query(`UPDATE users SET org_id = $1 WHERE id = $2`, [org.id, userId]);

    return {
      message: 'Organization created successfully',
      data: {
        id: org.id,
        name: org.name,
        code: org.code,
        owner_id: org.owner_id,
        is_active: org.is_active,
      },
    };
  }

  async createFirstBranch(userId: number, orgId: number, dto: CreateBranchDTO) {
    // STEP 2: Pre-condition checks — read fresh from DB, never trust JWT alone
    const userResult = await this.pool.query(
      `SELECT id, org_id, branch_id FROM users WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = userResult.rows[0];

    if (user.org_id == null) {
      throw new BadRequestException('Create organization first');
    }

    if (user.branch_id != null) {
      throw new BadRequestException('Branch already created');
    }

    // STEP 4: Check code uniqueness within org
    const codeConflict = await this.pool.query(
      `SELECT id FROM organization_branches WHERE code = $1 AND org_id = $2`,
      [dto.code, user.org_id],
    );

    if (codeConflict.rows.length > 0) {
      throw new ConflictException('Branch with this code already exists in your organization');
    }

    // STEP 5: Create branch
    const branchResult = await this.pool.query(
      `INSERT INTO organization_branches
        (name, code, email, contact_phone, city, address1, address2,
         academic_year_start, academic_year_end, org_id, owner_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
       RETURNING id, name, code, org_id, is_active`,
      [
        dto.name,
        dto.code,
        dto.email ?? null,
        dto.contact_phone ?? null,
        dto.city,
        dto.address1,
        dto.address2 ?? null,
        dto.academic_year_start,
        dto.academic_year_end,
        user.org_id,
        userId,
      ],
    );

    const branch = branchResult.rows[0];

    // STEP 6: Set as user's default branch
    await this.pool.query(`UPDATE users SET branch_id = $1 WHERE id = $2`, [branch.id, userId]);

    return {
      message: 'First branch created successfully',
      data: {
        id: branch.id,
        name: branch.name,
        code: branch.code,
        org_id: branch.org_id,
        is_active: branch.is_active,
      },
    };
  }
}
