import { Context, Next } from 'hono';
import { logger } from '../utils/logger';

export async function loggerMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const { method, url } = c.req;

  logger.info({
    type: 'request',
    method,
    path: url,
    ip: c.req.header('x-forwarded-for'),
    userAgent: c.req.header('user-agent'),
  });

  try {
    await next();
  } catch (err) {
    // Hata oluşursa logla
    logger.error({
      type: 'error',
      method,
      path: url,
      error: err,
    });
    throw err;
  }

  const responseTime = Date.now() - start;
  logger.info({
    type: 'response',
    method,
    path: url,
    statusCode: c.res.status,
    responseTime: `${responseTime}ms`,
  });
}
