import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Role } from '@prisma/client';

interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: Number(config.jwt.expiresIn),
  });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
