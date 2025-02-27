import { Hono } from 'hono';
import { swaggerRoutes } from './swagger.routes';

export const apiRoutes = new Hono();

apiRoutes.route('', swaggerRoutes);

apiRoutes.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default apiRoutes;
