import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrgOwnerDTO, OrgOwnerResponseDTO } from './dto/platform.dto';
import { PostgresService } from '@/common/providers/database/postgres.service';
import { PasswordHashService } from '@/common/security/password-hash.service';

@Injectable()
export class PlatformService {
  constructor(
    private readonly pool: PostgresService,
    private readonly hash: PasswordHashService,
  ) {}

  async create(dto: CreateOrgOwnerDTO): Promise<{ message: string; data: OrgOwnerResponseDTO }> {
    // STEP 2: Check uniqueness constraints
    const conflict = await this.pool.query(
      `SELECT
        MAX(CASE WHEN email    = $1 THEN 'email'    END) AS email_conflict
      FROM users
      WHERE email = $1 OR username = $2 OR phone = $3`,
      [dto.email, dto.username, dto.phone],
    );

    const { email_conflict } = conflict.rows[0];

    if (email_conflict) {
      throw new ConflictException('User with this email already exists');
    }

    // STEP 3: Hash password
    const hashedPassword = await this.hash.hash(dto.password);

    // STEP 4: Create user record
    const insertResult = await this.pool.query(
      `INSERT INTO users (name, username, email, phone, password, is_active, org_id, branch_id, profile_photo_id)
       VALUES ($1, $2, $3, $4, $5, true, null, null, null)
       RETURNING id, name, username, email, phone, org_id, branch_id`,
      [dto.name, dto.username, dto.email, dto.phone, hashedPassword],
    );

    const user = insertResult.rows[0];

    // STEP 5: Fetch org_owner role and assign
    const roleResult = await this.pool.query(`SELECT id FROM roles WHERE name = 'org_owner'`);

    if (roleResult.rows.length === 0) {
      throw new NotFoundException("Role 'org_owner' is not configured in the system");
    }

    const roleId = roleResult.rows[0].id;

    try {
      await this.pool.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [
        user.id,
        roleId,
      ]);
    } catch (error) {
      // User created but role assignment failed — manual cleanup required
      throw new InternalServerErrorException(
        `User #${user.id} was created but role assignment failed. Manual cleanup required.`,
      );
    }

    // STEP 7: Prepare response
    const data: OrgOwnerResponseDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: 'org_owner',
      org_id: null,
      branch_id: null,
    };

    return {
      message: 'Org owner created successfully',
      data,
    };
  }
}
