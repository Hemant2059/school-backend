import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller.js';
import { AnalyticsService } from './services/analytics.service.js';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
