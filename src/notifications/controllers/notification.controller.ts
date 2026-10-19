import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service.js';
import { CreateNotificationDto, UpdateNotificationDto, QueryNotificationsDto } from '../dto/notification.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Permissions('notifications.manage')
  @Post()
  create(@Body() dto: CreateNotificationDto) { return this.service.create(dto); }

  @Permissions('notifications.read')
  @Get()
  findAll(@Query() q: QueryNotificationsDto) { return this.service.findAll(q); }

  @Permissions('notifications.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('notifications.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) { return this.service.update(id, dto); }

  @Permissions('notifications.manage')
  @Delete(':id')
  softDelete(@Param('id') id: string) { return this.service.softDelete(id); }

  @Permissions('notifications.manage')
  @Post(':id/restore')
  restore(@Param('id') id: string) { return this.service.restore(id); }
}