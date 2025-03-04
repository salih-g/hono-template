import { createRoute, z } from '@hono/zod-openapi';
import { registerSchema, loginSchema } from '../modules/auth/auth.validator';

export const authRoutes = {
  register: createRoute({
    method: 'post',
    path: '/auth/register',
    tags: ['Auth'],
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials',
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registration successful',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(true),
              message: z.string().default('User registration successful'),
              data: z.object({
                user: z.object({
                  id: z.string(),
                  email: z.string().email(),
                  name: z.string().nullable().optional(),
                  role: z.enum(['USER', 'ADMIN']),
                }),
                token: z.string(),
              }),
            }),
          },
        },
      },
      400: {
        description: 'Validation error or duplicate email',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(false),
              message: z.string(),
              status: z.number().default(400),
            }),
          },
        },
      },
    },
  }),

  login: createRoute({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    summary: 'User login',
    description: 'Login with user credentials to obtain an access token',
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(true),
              message: z.string().default('Login successful'),
              data: z.object({
                user: z.object({
                  id: z.string(),
                  email: z.string().email(),
                  name: z.string().nullable().optional(),
                  role: z.enum(['USER', 'ADMIN']),
                }),
                token: z.string(),
              }),
            }),
          },
        },
      },
      401: {
        description: 'Invalid credentials',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(false),
              message: z.string().default('Invalid email or password'),
              status: z.number().default(401),
            }),
          },
        },
      },
    },
  }),
};

export const userRoutes = {
  me: createRoute({
    method: 'get',
    path: '/users/me',
    tags: ['Users'],
    summary: 'Get current user profile',
    description: 'Returns the profile of the currently authenticated user',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'User profile',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(true),
              data: z.object({
                id: z.string(),
                email: z.string().email(),
                name: z.string().nullable().optional(),
                role: z.enum(['USER', 'ADMIN']),
              }),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(false),
              message: z.string().default('Authorization failed'),
              status: z.number().default(401),
            }),
          },
        },
      },
    },
  }),

  adminDashboard: createRoute({
    method: 'get',
    path: '/users/admin/dashboard',
    tags: ['Users'],
    summary: 'Get admin dashboard',
    description: 'Returns dashboard information (Admin only)',
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: 'Admin dashboard data',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(true),
              message: z.string().default('Admin dashboard successfully fetched'),
              data: z.object({
                stats: z.object({
                  totalUsers: z.number(),
                  activeUsers: z.number(),
                  newUsersToday: z.number(),
                }),
              }),
            }),
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().default(false),
              message: z.string().default('You do not have permission for this action'),
              status: z.number().default(403),
            }),
          },
        },
      },
    },
  }),
};

export const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['Health'],
  summary: 'Health check',
  description: 'Checks if the API is up and running',
  responses: {
    200: {
      description: 'API health status',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string().default('ok'),
            timestamp: z.string().datetime(),
          }),
        },
      },
    },
  },
});
