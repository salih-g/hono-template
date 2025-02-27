// logger.ts
import config from '@/config';
import pino from 'pino';

// Simple log level enum with emoji mapping
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

// Simple context interface for log data
export interface LogContext {
  price?: number;
  error?: Error | unknown;
  [key: string]: any;
}

// Create the Pino logger instance with appropriate configuration
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

// The main logging function
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

// Create enhanced logger object with direct methods
export const logger = {
  // Keep the original Pino instance available
  pino: pinoLogger,

  // Add method to directly log information
  info: (message: string, context?: LogContext): void => log(LogLevel.INFO, message, context),

  // Add method to directly log debug information
  debug: (message: string, context?: LogContext): void => log(LogLevel.DEBUG, message, context),

  // Add method to directly log errors
  error: (message: string, context?: LogContext): void => log(LogLevel.ERROR, message, context),

  // Add method to directly log warnings
  warn: (message: string, context?: LogContext): void => log(LogLevel.WARN, message, context),
};

// Default export for convenient import
export default logger;
