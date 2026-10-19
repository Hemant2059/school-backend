import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller.js';
import { NotificationService } from './services/notification.service.js';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}