import { Context, Next } from 'hono';
import { config } from '../config';

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export async function rateLimiter(c: Context, next: Next) {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.max;

  const ipData = ipRequestMap.get(ip);

  if (!ipData || now > ipData.resetTime) {
    ipRequestMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    await next();
    return;
  }

  if (ipData.count >= maxRequests) {
    return c.json(
      {
        success: false,
        message: 'Too many requests have been made, please try again later',
        status: 429,
      },
      429,
      {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(ipData.resetTime / 1000).toString(),
        'Retry-After': Math.ceil((ipData.resetTime - now) / 1000).toString(),
      },
    );
  }

  ipData.count += 1;
  ipRequestMap.set(ip, ipData);

  c.header('X-RateLimit-Limit', maxRequests.toString());
  c.header('X-RateLimit-Remaining', (maxRequests - ipData.count).toString());
  c.header('X-RateLimit-Reset', Math.ceil(ipData.resetTime / 1000).toString());

  await next();
}

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now > data.resetTime) {
        ipRequestMap.delete(ip);
      }
    }
  },
  10 * 60 * 1000,
);
