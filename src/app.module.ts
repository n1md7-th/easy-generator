import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CommonModule, HealthModule],
})
export class AppModule {}
