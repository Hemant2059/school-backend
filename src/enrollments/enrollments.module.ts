import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { EnrollmentController } from './controllers/enrollment.controller.js';
import { EnrollmentService } from './services/enrollment.service.js';

@Module({
  imports: [NotificationsModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentsModule {}