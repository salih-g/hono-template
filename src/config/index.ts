import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('3000'),
  HOST: z.string().default('localhost'),
  API_PREFIX: z.string().default('/api/v1'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  SWAGGER_DESCRIPTION: z.string().default('API Docs'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  SWAGGER_PATH: z.string().default('/api-docs'),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('60000'),
  RATE_LIMIT_MAX: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('100'),
});

const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  port: env.PORT,
  host: env.HOST,
  apiPrefix: env.API_PREFIX,
  db: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  logger: {
    level: env.LOG_LEVEL,
  },
  swagger: {
    description: env.SWAGGER_DESCRIPTION,
    version: env.SWAGGER_VERSION,
    path: env.SWAGGER_PATH,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
};

export default config;
