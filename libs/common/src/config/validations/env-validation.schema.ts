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
    .optional()
    .label('Allowed Origins')
    .description('Comma-separated origin string list')
    .example('http://127.0.0.1:4200,http://127.0.0.1:3000'),
});

export const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
};
