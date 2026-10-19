import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FeeInvoiceService } from '../services/fee-invoice.service.js';
import { CreateFeeInvoiceDto, UpdateFeeInvoiceDto } from '../dto/fee-invoice.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fee-invoices')
export class FeeInvoiceController {
  constructor(private readonly service: FeeInvoiceService) {}

  @Permissions('fee_invoices.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeeInvoiceDto) { return this.service.create(tenantId, dto); }

  @Permissions('fee_invoices.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('fee_invoices.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('fee_invoices.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFeeInvoiceDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('fee_invoices.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('fee_invoices.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}