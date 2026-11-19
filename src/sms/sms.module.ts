import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';
import { SmsController } from './controllers/sms.controller.js';
import { SmsService } from './sms.service.js';

@Module({
  imports: [BillingModule],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
