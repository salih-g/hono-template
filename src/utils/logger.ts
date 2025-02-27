import config from '@/config';
import pino from 'pino';

export enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  WARN = 'WARN',
}

const LogEmoji = {
  [LogLevel.INFO]: '📝',
  [LogLevel.DEBUG]: '🔍',
  [LogLevel.ERROR]: '❌',
  [LogLevel.WARN]: '⚠️',
};

export interface LogContext {
  price?: number;
  error?: Error | unknown;
  [key: string]: any;
}

const pinoLogger = pino({
  transport: config.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          levelFirst: true,
        },
      }
    : undefined,
  level: config.logger.level || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    error: error => {
      if (error instanceof Error) {
        return {
          type: error.name,
          message: error.message,
          stack: config.isDevelopment ? error.stack : undefined,
          code: (error as any).code,
          url: (error as any).url,
        };
      }
      return error;
    },
  },
});

function log(level: LogLevel, message: string, context?: LogContext): void {
  // Development mode: pretty console logs with emojis
  if (config.isDevelopment) {
    console.log(`\n${LogEmoji[level]} ${level}:`, message);

    if (context && Object.keys(context).length > 0) {
      if (context.error) {
        console.log('Error details:', context.error);

        // Log remaining context without error for cleaner output
        const { error, ...restContext } = context;
        if (Object.keys(restContext).length > 0) {
          console.log('Context:', restContext);
        }
      } else {
        console.log('Context:', context);
      }
    }
  }
  // Production mode: structured JSON logging with Pino
  else {
    try {
      switch (level) {
        case LogLevel.INFO:
          pinoLogger.info(context, message);
          break;
        case LogLevel.DEBUG:
          pinoLogger.debug(context, message);
          break;
        case LogLevel.ERROR:
          pinoLogger.error(context, message);
          break;
        case LogLevel.WARN:
          pinoLogger.warn(context, message);
          break;
      }
    } catch (error) {
      // Fallback to console if Pino fails
      console.error('Logger failed:', error);
      console.log(`${LogEmoji[level]} ${level}:`, message, context);
    }
  }
}

export const logger = {
  pino: pinoLogger,

  info: (message: string, context?: LogContext): void => log(LogLevel.INFO, message, context),

  debug: (message: string, context?: LogContext): void => log(LogLevel.DEBUG, message, context),

  error: (message: string, context?: LogContext): void => log(LogLevel.ERROR, message, context),

  warn: (message: string, context?: LogContext): void => log(LogLevel.WARN, message, context),
};

export default logger;
