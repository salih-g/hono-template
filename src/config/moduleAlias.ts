import { addAliases } from 'module-alias';
import { resolve } from 'path';

addAliases({
  '@': resolve(__dirname, '../'),
  '@config': resolve(__dirname, '../config'),
  '@middlewares': resolve(__dirname, '../middlewares'),
  '@models': resolve(__dirname, '../models'),
  '@routes': resolve(__dirname, '../routes'),
  '@modules': resolve(__dirname, '../modules'),
  '@types': resolve(__dirname, '../types'),
  '@utils': resolve(__dirname, '../utils'),
});
