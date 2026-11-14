import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { NotificationService } from '../services/notification.service.js';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';

/**
 * Notifications are always scoped to the calling principal's own recipient
 * id: a school administrator sees their own school's notifications, and a
 * platform administrator sees theirs. There is no route that returns another
 * party's inbox.
 */
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Permissions('notifications.manage')
  @Post()
  create(@Body() dto: CreateNotificationDto, @CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.create(dto, principal);
  }

  @Permissions('notifications.read')
  @Get()
  findAll(@Query() q: Record<string, any>, @CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.findAll(q, principal);
  }

  @Permissions('notifications.read')
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.findOne(id, principal);
  }

  @Permissions('notifications.manage')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
    @CurrentUser() principal: AuthenticatedPrincipal,
  ) {
    return this.service.update(id, dto, principal);
  }

  @Permissions('notifications.manage')
  @Post('read-all')
  markAllRead(@CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.markAllRead(principal);
  }

  @Permissions('notifications.manage')
  @Delete(':id')
  softDelete(@Param('id') id: string, @CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.softDelete(id, principal);
  }

  @Permissions('notifications.manage')
  @Post(':id/restore')
  restore(@Param('id') id: string, @CurrentUser() principal: AuthenticatedPrincipal) {
    return this.service.restore(id, principal);
  }
}
