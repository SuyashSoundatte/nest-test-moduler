import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { LoginDTO } from '../../src/modules/auth/dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    authService = mockAuthService as unknown as AuthService;
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const loginDTO: LoginDTO = {
        email: 'admin@gmail.com',
        password: '1234',
      };

      const mockResponse = {
        message: 'Login successfully',
        token: 'mocked-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await authController.login(loginDTO);

      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDTO);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should return logout success response', () => {
      const result = authController.logout();

      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Logout Successfully',
      });
    });
  });
});
