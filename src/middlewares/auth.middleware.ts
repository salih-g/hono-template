import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { $Enums, Role } from '@prisma/client';
import { prisma } from '@/prisma';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface UserPayload {
  id: string;
  email: string;
  role: $Enums.Role;
}

export function authMiddleware() {
  return async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        {
          success: false,
          message: 'Authorization failed: Token not found',
          status: 401,
        },
        401,
      );
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, email: true, role: true },
      });

      if (!user) {
        return c.json(
          {
            success: false,
            message: 'Authorization failed: User not found',
            status: 401,
          },
          401,
        );
      }

      c.set('user', user);

      await next();
    } catch (error) {
      return c.json(
        {
          success: false,
          message: 'Authorization failed: Invalid token',
          status: 401,
        },
        401,
      );
    }
  };
}

export function roleMiddleware(allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          success: false,
          message: 'Authorization failed: User not found',
          status: 401,
        },
        401,
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        {
          success: false,
          message: 'You do not have permission for this action',
          status: 403,
        },
        403,
      );
    }

    await next();
  };
}

export default authMiddleware;
