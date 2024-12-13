import { CommonModule } from '@common/common';
import { AppConfigService } from '@common/common/config/app-config.service';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CommonModule,
    HealthModule,
    AuthModule,
    MongooseModule.forRootAsync({
      useFactory: (config: AppConfigService) => ({
        uri: config.getOrThrow('database.url', { infer: true }),
      }),
      inject: [AppConfigService],
    }),
  ],
})
export class AppModule {}
