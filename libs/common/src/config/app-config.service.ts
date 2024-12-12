import { ConfigurationType } from '@common/common/config/configuration';
import {
  validationOptions,
  validationSchema,
} from '@common/common/config/validations/env-validation.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ValidationError } from 'joi';
import { env, exit } from 'node:process';

@Injectable()
export class AppConfigService
  extends NestConfigService<ConfigurationType>
  implements OnModuleInit
{
  onModuleInit() {
    validationSchema
      .validateAsync(env, validationOptions)
      .catch((error: ValidationError) => {
        console.warn('Config validation error', error.name);
        console.warn(JSON.stringify(error.details, null, 2), error.name);

        exit(1);
      });
  }
}
