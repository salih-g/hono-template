import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { swaggerUI } from '@hono/swagger-ui';

import { config } from './config';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { rateLimiter } from './middlewares/rateLimit.middleware';
// import { apiRoutes } from './routes';

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

app.get(
  config.swagger.path,
  swaggerUI({
    url: `${config.apiPrefix}/swagger.json`,
  }),
);

const api = new Hono().basePath(config.apiPrefix);

api.use('*', rateLimiter);

// api.route('/', apiRoutes);

app.route('', api);

app.use('*', errorMiddleware);

app.notFound(notFoundMiddleware);

export default app;
