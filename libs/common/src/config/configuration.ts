import { env } from 'node:process';

export const Configuration = () => ({
  node: {
    env: env.NODE_ENV!,
  },
  http: {
    origin: env.ORIGINS!,
    port: parseInt(env.PORT!, 10),
    host: env.HOST!,
  },
  database: {
    url: env.DB_URL!,
  },
  auth: {
    refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN!,
    accessTokenExpiresIn: env.ACCESS_TOKEN_EXPIRES_IN!,
    secret: env.JWT_SECRET!,
  },
});

export type ConfigurationType = ReturnType<typeof Configuration>;
