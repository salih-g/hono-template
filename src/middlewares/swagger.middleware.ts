import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { authRoutes, userRoutes, healthRoute } from '../utils/swagger-schema-registry';

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Hono API Template',
    version: '1.0.0',
    description: 'Modern backend API template built with Hono.js and Prisma ORM',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export function createSwaggerApp(basePathPrefix: string = '/api-docs') {
  const app = new OpenAPIHono();

  app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  app.openapi(authRoutes.register, async c => c.json({}, 200));
  app.openapi(authRoutes.login, async c => c.json({}, 200));

  app.openapi(userRoutes.me, async c => c.json({}, 200));
  app.openapi(userRoutes.adminDashboard, async c => c.json({}, 200));

  app.openapi(healthRoute, async c => c.json({}, 200));

  app.doc('/json', {
    openapi: swaggerConfig.openapi,
    info: swaggerConfig.info,
    servers: swaggerConfig.servers,
  });

  app.get('/', swaggerUI({ url: './json' }));

  return app;
}
