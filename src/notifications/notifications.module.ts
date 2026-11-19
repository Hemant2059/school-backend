import { Module } from '@nestjs/common';
import { SmsModule } from '../sms/sms.module.js';
import { NotificationController } from './controllers/notification.controller.js';
import { NotificationService } from './services/notification.service.js';
import { GuardianNotificationService } from './services/guardian-notification.service.js';

@Module({
  imports: [SmsModule],
  controllers: [NotificationController],
  providers: [NotificationService, GuardianNotificationService],
  exports: [NotificationService, GuardianNotificationService],
})
export class NotificationsModule {}