import 'dotenv/config';
import { z } from 'zod';

const checkRequiredEnvVars = () => {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables detected:');
    console.error(`   ${missingVars.join(', ')}`);
    console.error('');
    console.error('🔍 Please check your .env file and set the required variables.');
    console.error('💡 You can start by copying the .env.example file:');
    console.error('   cp .env.example .env');
    console.error('');

    // Show example .env content in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.error('🧪 For development purposes, you can use the following example values:');
      console.error('');
      console.error(
        'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"',
      );
      console.error(
        'JWT_SECRET="temporary_secret_key_for_development_replace_with_a_strong_value"',
      );
      console.error('');
    }

    process.exit(1);
  }
};

checkRequiredEnvVars();

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
  JWT_EXPIRES_IN: z
    .string()
    .transform(val => parseInt(val, 10))
    .default('604800'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
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
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
};

export default config;
