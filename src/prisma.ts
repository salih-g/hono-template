import { PrismaClient } from '@prisma/client';

import config from './config';

export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
