import { env } from 'node:process';

export const Configuration = () => ({
  node: {
    env: env.NODE_ENV,
  },
  http: {
    origin: env.ORIGIN,
    port: parseInt(env.PORT!, 10),
    host: env.HOST,
  },
  database: {},
});

export type ConfigurationType = ReturnType<typeof Configuration>;
