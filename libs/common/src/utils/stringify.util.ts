import { Env } from '@common/common/env/env.static';

export const stringify = (object: any) => {
  if (Env.isProduction()) return JSON.stringify(object);

  return JSON.stringify(object, null, 2);
};
