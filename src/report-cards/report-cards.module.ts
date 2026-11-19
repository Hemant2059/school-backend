import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';
import { ReportCardController } from './controllers/report-card.controller.js';
import { ReportCardService } from './services/report-card.service.js';

@Module({
  imports: [BillingModule],
  controllers: [ReportCardController],
  providers: [ReportCardService],
  exports: [ReportCardService],
})
export class ReportCardsModule {}
