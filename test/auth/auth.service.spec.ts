import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { InvalidCredentialsException } from '../../src/modules/auth/exception/auth.execeptions';
import { LoginDTO } from '../../src/modules/auth/dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    jwtService = mockJwtService as unknown as JwtService;
    authService = new AuthService(jwtService);
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const loginDTO: LoginDTO = {
        email: 'admin@gmail.com',
        password: '1234',
      };

      mockJwtService.signAsync.mockResolvedValue('mocked-jwt-token');

      const result = await authService.login(loginDTO);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: 1,
        orgId: 1,
        branchId: 1,
        role: ['SuperAdmin'],
      });

      expect(result).toEqual({
        message: 'Login successfully',
        token: 'mocked-jwt-token',
      });
    });

    it('should throw InvalidCredentialsException when email is invalid', async () => {
      const loginDTO: LoginDTO = {
        email: 'wrong@gmail.com',
        password: '1234',
      };

      await expect(authService.login(loginDTO)).rejects.toBeInstanceOf(InvalidCredentialsException);

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsException when password is invalid', async () => {
      const loginDTO: LoginDTO = {
        email: 'admin@gmail.com',
        password: 'wrong-password',
      };

      await expect(authService.login(loginDTO)).rejects.toBeInstanceOf(InvalidCredentialsException);

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsException when both email and password are invalid', async () => {
      const loginDTO: LoginDTO = {
        email: 'wrong@gmail.com',
        password: 'wrong-password',
      };

      await expect(authService.login(loginDTO)).rejects.toBeInstanceOf(InvalidCredentialsException);

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
