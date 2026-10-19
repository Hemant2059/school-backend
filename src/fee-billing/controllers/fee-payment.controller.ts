import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FeePaymentService } from '../services/fee-payment.service.js';
import { CreateFeePaymentDto, UpdateFeePaymentDto } from '../dto/fee-payment.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fee-payments')
export class FeePaymentController {
  constructor(private readonly service: FeePaymentService) {}

  @Permissions('fee_payments.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeePaymentDto) { return this.service.create(tenantId, dto); }

  @Permissions('fee_payments.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('fee_payments.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('fee_payments.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFeePaymentDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('fee_payments.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('fee_payments.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}