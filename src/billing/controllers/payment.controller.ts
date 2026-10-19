import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TenantPaymentService } from '../services/payment.service.js';
import { CreatePaymentDto, QueryPaymentsDto } from '../dto/payment.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/payments')
export class PaymentController {
  constructor(private readonly service: TenantPaymentService) {}

  @Permissions('billing.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreatePaymentDto) { return this.service.create(tenantId, dto); }

  @Permissions('billing.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryPaymentsDto) { return this.service.findAll(tenantId, q); }
}