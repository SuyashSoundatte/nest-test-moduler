import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InvalidCredentialsException } from './exception/auth.execeptions';
import { JwtService } from '@nestjs/jwt';
import { PostgresService } from '@/common/providers/database/postgres.service';
import { PasswordHashService } from '@/common/security/password-hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly pool: PostgresService,
    private readonly hash: PasswordHashService,
  ) {}

  async login(loginDTO: LoginDTO) {
    // ✔ email must exist
    const userResult = await this.pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.password,
        u.is_active,
        u.org_id,
        u.branch_id
      FROM users u
      WHERE u.email = $1`,
      [loginDTO.email],
    );

    if (userResult.rows.length === 0) {
      throw new InvalidCredentialsException(loginDTO.email);
    }

    const user = userResult.rows[0];

    // ✔ password must match
    const isPassValid = await this.hash.verify(user.password, loginDTO.password);
    if (!isPassValid) {
      throw new InvalidCredentialsException(loginDTO.email);
    }

    // ✔ user must be active
    if (!user.is_active) {
      throw new Error('User account is inactive');
    }

    // ✔ role must exist
    const rolesResult = await this.pool.query(
      `SELECT r.id, r.name
        FROM roles r
        INNER JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1`,
      [user.id],
    );

    if (rolesResult.rows.length === 0) {
      throw new Error('No roles assigned to this user');
    }

    const roles: string[] = rolesResult.rows.map((r) => r.name);

    // if role is platform owner bypass org and branch is active check
    const isPlatformOwner = roles.includes('platform_owner');

    // ✔ org must be active (optional check)
    if (!isPlatformOwner && user.org_id) {
      const orgResult = await this.pool.query(
        `SELECT id, is_active FROM organizations WHERE id = $1`,
        [user.org_id],
      );

      if (orgResult.rows.length === 0 || !orgResult.rows[0].is_active) {
        throw new Error('Organization is inactive or not found');
      }
    }

    // ✔ branch must be active (optional check)
    if (!isPlatformOwner && user.branch_id) {
      const branchResult = await this.pool.query(
        `SELECT id, is_active FROM organization_branches WHERE id = $1`,
        [user.branch_id],
      );

      if (branchResult.rows.length === 0 || !branchResult.rows[0].is_active) {
        throw new Error('Branch is inactive or not found');
      }
    }

    const payload = {
      userId: user.id,
      orgId: user.org_id ?? null,
      branchId: user.branch_id ?? null,
      roles,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successfully',
      token,
    };
  }
}
