import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module.js';
import { AttendanceController } from './controllers/attendance.controller.js';
import { AttendanceService } from './services/attendance.service.js';

@Module({
  imports: [BillingModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
