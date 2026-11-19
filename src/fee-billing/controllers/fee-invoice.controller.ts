import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FeeInvoiceService } from '../services/fee-invoice.service.js';
import {
  CreateFeeInvoiceDto,
  GenerateFeeInvoiceDto,
  UpdateFeeInvoiceDto,
} from '../dto/fee-invoice.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlanFeature } from '../../common/decorators/plan-feature.decorator.js';

@PlanFeature('fee.management')
@Controller('tenants/:tenantId/fee-invoices')
export class FeeInvoiceController {
  constructor(private readonly service: FeeInvoiceService) {}

  /**
   * Generates an invoice from the tenant's class fee structure. Every line
   * and total is computed by the server.
   */
  @Permissions('fee_invoices.manage')
  @Post('generate')
  generate(@Param('tenantId') tenantId: string, @Body() dto: GenerateFeeInvoiceDto) {
    return this.service.generate(tenantId, dto);
  }

  @Permissions('fee_invoices.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeeInvoiceDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('fee_invoices.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  /** The outstanding balance across every unpaid invoice of an enrolment. */
  @Permissions('fee_invoices.read')
  @Get('outstanding')
  outstanding(@Param('tenantId') tenantId: string, @Query('enrollmentId') enrollmentId: string) {
    return this.service.outstanding(tenantId, enrollmentId);
  }

  @Permissions('fee_invoices.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('fee_invoices.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateFeeInvoiceDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  /** Recomputes the invoice totals from its line items. */
  @Permissions('fee_invoices.manage')
  @Post(':id/recalculate')
  recalculate(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.recalculate(tenantId, id);
  }

  @Permissions('fee_invoices.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('fee_invoices.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
