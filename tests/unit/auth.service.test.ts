import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../src/modules/auth/auth.service';
import { userRepository } from '../../src/modules/user/user.repository';
import * as bcryptUtils from '../../src/utils/bcrypt';
import * as jwtUtils from '../../src/utils/jwt';
import { HTTPException } from 'hono/http-exception';

vi.mock('../../src/modules/user/user.repository');
vi.mock('../../src/utils/bcrypt');
vi.mock('../../src/utils/jwt');
vi.mock('../../src/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    const registerInput = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('Should be able to register successfully with an unregistered email', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(bcryptUtils.hash).mockResolvedValue('hashed_password');
      vi.mocked(userRepository.create).mockResolvedValue({
        id: 'user-id',
        email: registerInput.email,
        password: 'hashed_password',
        name: registerInput.name,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(jwtUtils.generateToken).mockReturnValue('generated_token');

      const result = await authService.register(registerInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(bcryptUtils.hash).toHaveBeenCalledWith(registerInput.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerInput.email,
        password: 'hashed_password',
        name: registerInput.name,
      });
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        sub: 'user-id',
        email: registerInput.email,
        role: 'USER',
      });

      expect(result).toEqual({
        user: {
          id: 'user-id',
          email: registerInput.email,
          name: registerInput.name,
          role: 'USER',
        },
        token: 'generated_token',
      });
    });

    it('Should return an error when registering with an already registered email', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'existing-user-id',
        email: registerInput.email,
        password: 'existing_hashed_password',
        name: 'Existing User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register(registerInput)).rejects.toThrow(HTTPException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerInput.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('Should be able to log in successfully with valid credentials', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'user-id',
        email: loginInput.email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcryptUtils.compare).mockResolvedValue(true);
      vi.mocked(jwtUtils.generateToken).mockReturnValue('generated_token');

      const result = await authService.login(loginInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(bcryptUtils.compare).toHaveBeenCalledWith(loginInput.password, 'hashed_password');
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        sub: 'user-id',
        email: loginInput.email,
        role: 'USER',
      });

      expect(result).toEqual({
        user: {
          id: 'user-id',
          email: loginInput.email,
          name: 'Test User',
          role: 'USER',
        },
        token: 'generated_token',
      });
    });

    it('Should return an error for a non-existent user', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow(HTTPException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(bcryptUtils.compare).not.toHaveBeenCalled();
    });

    it('Should return an error for an incorrect password', async () => {
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: 'user-id',
        email: loginInput.email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(bcryptUtils.compare).mockResolvedValue(false);

      await expect(authService.login(loginInput)).rejects.toThrow(HTTPException);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginInput.email);
      expect(bcryptUtils.compare).toHaveBeenCalledWith(loginInput.password, 'hashed_password');
      expect(jwtUtils.generateToken).not.toHaveBeenCalled();
    });
  });
});
