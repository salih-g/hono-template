import { Context } from 'hono';

export function notFoundMiddleware(c: Context) {
  return c.json(
    {
      success: false,
      message: 'Not Found',
      status: 404,
    },
    404,
  );
}
