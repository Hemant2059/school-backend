import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { TenantSubscriptionService } from '../services/subscription.service.js';
import { CreateSubscriptionDto, UpdateSubscriptionDto, QuerySubscriptionsDto } from '../dto/subscription.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlatformOnly } from '../../auth/decorators/platform-only.decorator.js';

@Controller('tenants/:tenantId/subscriptions')
export class SubscriptionController {
  constructor(private readonly service: TenantSubscriptionService) {}

  @PlatformOnly()
  @Permissions('subscriptions.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateSubscriptionDto, @Req() req: any) { return this.service.create(tenantId, dto, req.user?.sub ?? req.user?.id); }

  @Permissions('subscriptions.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QuerySubscriptionsDto) { return this.service.findAll(tenantId, q); }

  @Permissions('subscriptions.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @PlatformOnly()
  @Permissions('subscriptions.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateSubscriptionDto) { return this.service.update(tenantId, id, dto); }

  @PlatformOnly()
  @Permissions('subscriptions.manage')
  @Post(':id/cancel')
  cancel(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.cancel(tenantId, id); }
}