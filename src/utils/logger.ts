import pino from 'pino';
import { config } from '../config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
});

// Logger oluşturma
export const logger = pino(
  {
    level: config.logger.level,
    base: {
      env: config.nodeEnv,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  config.isDevelopment ? transport : undefined,
);

export default logger;
