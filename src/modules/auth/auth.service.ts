import { Injectable } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { InvalidCredentialsException } from './exception/auth.execeptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDTO: LoginDTO) {
    if (loginDTO.email != 'admin@gmail.com' || loginDTO.password != '1234') {
      throw new InvalidCredentialsException(loginDTO.email);
    }

    const payload = {
      userId: 1,
      orgId: 1,
      branchId: 1,
      role: ['SuperAdmin'],
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successfully',
      token: token,
    };
  }
}
