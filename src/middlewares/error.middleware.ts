import { ZodError } from 'zod';
import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { logger } from '../utils/logger';
import { config } from '../config';

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    logger.error('Error:', { error });

    // HTTP errors
    if (error instanceof HTTPException) {
      return c.json(
        {
          success: false,
          message: error.message,
          status: error.status,
        },
        error.status,
      );
    }

    if (error instanceof PrismaClientKnownRequestError) {
      const status = 400;
      let message = 'An error occurred during database operation';

      switch (error.code) {
        case 'P2002':
          message = `Unique restriction violation: ${error.meta?.target}`;
          break;
        case 'P2025':
          message = 'Not Found';
          break;
      }

      return c.json(
        {
          success: false,
          message,
          code: error.code,
          status,
        },
        status,
      );
    }

    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return c.json(
        {
          success: false,
          message: 'Validation error',
          errors: formattedErrors,
          status: 400,
        },
        400,
      );
    }

    const errorResponse = {
      success: false,
      message: 'Server error',
      status: 500,
    };

    if (config.isDevelopment) {
      Object.assign(errorResponse, {
        stack: error instanceof Error ? error.stack : undefined,
        error: String(error),
      });
    }

    return c.json(errorResponse, 500);
  }
}
