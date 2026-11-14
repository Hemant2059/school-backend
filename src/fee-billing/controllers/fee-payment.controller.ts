import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FeePaymentService } from '../services/fee-payment.service.js';
import { CreateFeePaymentDto, UpdateFeePaymentDto } from '../dto/fee-payment.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fee-payments')
export class FeePaymentController {
  constructor(private readonly service: FeePaymentService) {}

  /** Records a receipt and applies it to the invoice atomically. */
  @Permissions('fee_payments.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeePaymentDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('fee_payments.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('fee_payments.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('fee_payments.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeePaymentDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  /**
   * Reverses a receipt and restores the invoice balance. A receipt is never
   * silently erased.
   */
  @Permissions('fee_payments.manage')
  @Post(':id/reverse')
  reverse(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.service.reverse(tenantId, id, body?.reason ?? 'Reversed');
  }

  @Permissions('fee_payments.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('fee_payments.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
