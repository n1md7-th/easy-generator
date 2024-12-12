import { Configuration } from '@common/common/config/configuration';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { env } from 'node:process';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env.${env.NODE_ENV}`,
      load: [Configuration],
      cache: true,
      isGlobal: true,
    }),
    ConfigModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
