import { addAliases } from 'module-alias';
import { resolve } from 'path';

addAliases({
  '@': resolve(__dirname, '../'),
  '@config': resolve(__dirname, '../config'),
  '@controllers': resolve(__dirname, '../controllers'),
  '@middlewares': resolve(__dirname, '../middlewares'),
  '@models': resolve(__dirname, '../models'),
  '@repositories': resolve(__dirname, '../repositories'),
  '@routes': resolve(__dirname, '../routes'),
  '@services': resolve(__dirname, '../services'),
  '@types': resolve(__dirname, '../types'),
  '@utils': resolve(__dirname, '../utils'),
  '@validators': resolve(__dirname, '../validators'),
});
