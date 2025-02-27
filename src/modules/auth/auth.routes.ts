import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from './auth.validator';
import { authController } from './auth.controller';

export const authRoutes = new Hono();

authRoutes.post('/register', zValidator('json', registerSchema), authController.register);

authRoutes.post('/login', zValidator('json', loginSchema), authController.login);

export default authRoutes;
