import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { config } from './config';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { rateLimiter } from './middlewares/rateLimit.middleware';
import { createSwaggerApp } from './middlewares/swagger.middleware';
import { apiRoutes } from './routes';

export const app = new Hono();

app.use('*', honoLogger());
app.use('*', loggerMiddleware);
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  }),
);

const swaggerApp = createSwaggerApp();
app.route('/api-docs', swaggerApp);
app.route('/', swaggerApp);

const api = new Hono().basePath(config.apiPrefix);

api.use('*', rateLimiter);

api.route('/', apiRoutes);

app.route('', api);

app.use('*', errorMiddleware);

app.notFound(notFoundMiddleware);

export default app;
