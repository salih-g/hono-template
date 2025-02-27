import { Context } from 'hono';

import { authService } from './auth.service';
import { LoginInput, RegisterInput } from './auth.validator';
import logger from '@/utils/logger';

export const authController = {
  async register(c: Context) {
    try {
      const input = (await c.req.json()) as RegisterInput;

      logger.info(`New user registration: ${input.email}`);

      const result = await authService.register(input);

      return c.json(
        {
          success: true,
          message: 'User registration successful',
          data: result,
        },
        201,
      );
    } catch (error) {
      logger.error('User registration error:', { error });
      throw error;
    }
  },

  async login(c: Context) {
    try {
      const input = (await c.req.json()) as LoginInput;

      logger.info(`User login attempt: ${input.email}`);

      const result = await authService.login(input);

      return c.json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      logger.error('User login error:', { error });
      throw error;
    }
  },
};

export default authController;
