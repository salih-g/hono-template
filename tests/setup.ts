import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { beforeAll, afterAll } from 'vitest';

process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log('Connection to the test database successful');
  } catch (error) {
    console.error('Error connecting to the test database:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await prisma.$disconnect();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
    process.exit(1);
  }
});
