import { Hono } from 'hono';

import { authRoutes } from './modules/auth/auth.routes';

export const apiRoutes = new Hono();

apiRoutes.route('/auth', authRoutes);

apiRoutes.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default apiRoutes;
