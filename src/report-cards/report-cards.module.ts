import { Module } from '@nestjs/common';
import { ReportCardController } from './controllers/report-card.controller.js';
import { ReportCardService } from './services/report-card.service.js';

@Module({
  controllers: [ReportCardController],
  providers: [ReportCardService],
  exports: [ReportCardService],
})
export class ReportCardsModule {}
