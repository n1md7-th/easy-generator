import { env } from 'node:process';

export class Env {
  static isProduction(): boolean {
    return env.NODE_ENV?.trim() === 'production';
  }

  static isDevelopment(): boolean {
    return env.NODE_ENV?.trim() === 'development';
  }

  static isTest(): boolean {
    return env.NODE_ENV?.trim() === 'test';
  }
}
