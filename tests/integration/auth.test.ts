import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { app } from '../../src/app';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { serve } from '@hono/node-server';

const prisma = new PrismaClient();
const server = serve(app);

describe('Auth Routes', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /api/v1/auth/register', () => {
    it('Should be able to register a user with valid credentials', async () => {
      const response = await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('Registration should not be allowed with missing information', async () => {
      const response = await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('Registration should not be allowed with an invalid email format', async () => {
      const response = await request(server).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('Registration should not be allowed with a weak password', async () => {
      const response = await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('Duplicate registration with the same email should not be allowed', async () => {
      await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

      const response = await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Another User',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(server).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });
    });

    it('Should be able to log in with valid credentials', async () => {
      const response = await request(server).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('Login should not be allowed with a non-existent user', async () => {
      const response = await request(server).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('Login should not be allowed with an incorrect password', async () => {
      const response = await request(server).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
