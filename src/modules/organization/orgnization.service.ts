import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresService } from '@/common/providers/database/postgres.service';
import { OrganizationMeResponse, BranchData } from './dto/org.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly pool: PostgresService) {}

  async getMyOrganization(
    orgId: number | null,
    branchId: number | null,
  ): Promise<OrganizationMeResponse> {
    if (orgId == null) {
      throw new BadRequestException('User not associated with any organization');
    }

    const orgResult = await this.pool.query(
      `SELECT id, name, code, is_active
       FROM organizations
       WHERE id = $1 AND is_active = true`,
      [orgId],
    );

    if (orgResult.rows.length === 0) {
      throw new NotFoundException('Organization not found or inactive');
    }

    const org = orgResult.rows[0];

    let branch: BranchData | null = null;

    if (branchId != null) {
      const branchResult = await this.pool.query(
        `SELECT id, name, code, city, is_active
         FROM organization_branches
         WHERE id = $1 AND is_active = true`,
        [branchId],
      );

      if (branchResult.rows.length > 0) {
        const row = branchResult.rows[0];
        branch = {
          id: row.id,
          name: row.name,
          code: row.code,
          city: row.city,
          is_active: row.is_active,
        };
      }
    }

    return {
      message: 'Organization details fetched successfully',
      data: {
        organization: {
          id: org.id,
          name: org.name,
          code: org.code,
          is_active: org.is_active,
        },
        branch,
      },
    };
  }
}
