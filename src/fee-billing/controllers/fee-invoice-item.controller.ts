import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FeeInvoiceItemService } from '../services/fee-invoice-item.service.js';
import { CreateFeeInvoiceItemDto, UpdateFeeInvoiceItemDto } from '../dto/fee-invoice-item.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fee-invoice-items')
export class FeeInvoiceItemController {
  constructor(private readonly service: FeeInvoiceItemService) {}

  @Permissions('fee_invoices.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeeInvoiceItemDto) { return this.service.create(tenantId, dto); }

  @Permissions('fee_invoices.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('fee_invoices.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('fee_invoices.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFeeInvoiceItemDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('fee_invoices.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}