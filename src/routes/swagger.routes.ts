import { Hono } from 'hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { config } from '../config';

export const swaggerRoutes = new Hono();

const apiDoc = {
  openapi: '3.0.0',
  info: {
    title: config.swagger.title,
    description: config.swagger.description,
    version: config.swagger.version,
  },
  servers: [
    {
      url: config.apiPrefix,
      description: 'API sunucusu',
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Hata mesajı',
          },
          status: {
            type: 'integer',
            example: 400,
          },
        },
      },
    },
  },
};

const openAPIHono = new OpenAPIHono();

openAPIHono.doc('/swagger.json', apiDoc);

swaggerRoutes.route('', openAPIHono);

export default swaggerRoutes;
