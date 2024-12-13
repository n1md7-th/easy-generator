declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      ORIGINS: string;
      HOST: string;
      PORT: string;

      REFRESH_TOKEN_EXPIRES_IN: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      JWT_SECRET: string;

      DB_URL: string;
    }
  }
}

export {};
