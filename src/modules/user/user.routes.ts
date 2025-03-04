import { Hono } from 'hono';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

export const userRoutes = new Hono();

userRoutes.use('*', authMiddleware());

userRoutes.get('/me', async c => {
  const user = c.get('user');

  return c.json({
    success: true,
    data: user,
  });
});

userRoutes.use('/admin/*', roleMiddleware(['ADMIN']));

// Admin route example
userRoutes.get('/admin/dashboard', c => {
  return c.json({
    success: true,
    message: 'Admin dashboard successfully fetched',
    data: {
      stats: {
        totalUsers: 250,
        activeUsers: 120,
        newUsersToday: 5,
      },
    },
  });
});

export default userRoutes;
