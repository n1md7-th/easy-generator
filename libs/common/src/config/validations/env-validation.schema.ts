import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('test', 'development', 'production')
    .label('Node environment')
    .default('development')
    .optional(),

  PORT: Joi.number()
    .positive()
    .less(65536)
    .label('Server port number')
    .optional()
    .default(3000),
  HOST: Joi.string()
    .label('Server host')
    .required()
    .example('http://localhost'),
  ORIGINS: Joi.string()
    .label('Allowed Origins')
    .description('Comma-separated origin string list')
    .example('http://127.0.0.1:4200,http://127.0.0.1:3000'),

  REFRESH_TOKEN_EXPIRES_IN: Joi.string()
    .description('Refresh token expiration time')
    .example('1d'),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string()
    .description('Access token expiration time')
    .example('15m'),
  JWT_SECRET: Joi.string().description('JWT secret key').example('secret'),

  DB_URL: Joi.string().description('Database connection URL'),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
