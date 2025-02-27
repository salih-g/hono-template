import 'module-alias/register';
import './config/moduleAlias';
import { config } from './config';
import { app } from './app';
import { logger } from './utils/logger';
import { PrismaClient } from '@prisma/client';
import { serve } from '@hono/node-server';

// Veritabanı bağlantısı
export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

async function bootstrap() {
  try {
    await prisma.$connect().catch(error => {
      logger.error('Database connection failed:', error);
      console.log('girdim');
      process.exit(1);
    });
    logger.info('Database connection successful');

    const server = serve({
      fetch: app.fetch,
      port: config.port,
    });

    logger.info(`Server is running in ${config.nodeEnv} mode on ${config.host}:${config.port}`);
    logger.info(`API Docs: ${config.host}:${config.port}${config.swagger.path}`);

    const shutdown = async () => {
      logger.info('Server is shuting down...');
      server.close(async () => {
        logger.info('HTTP server shut down');
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Server was not shut down properly, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error('An error occurred while starting the server:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap().catch(error => {
  logger.error('Bootstrap error:', error);
  process.exit(1);
});
