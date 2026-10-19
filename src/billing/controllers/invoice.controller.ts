import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TenantInvoiceService } from '../services/invoice.service.js';
import { CreateInvoiceDto, UpdateInvoiceDto, QueryInvoicesDto } from '../dto/invoice.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/invoices')
export class InvoiceController {
  constructor(private readonly service: TenantInvoiceService) {}

  @Permissions('billing.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateInvoiceDto) { return this.service.create(tenantId, dto); }

  @Permissions('billing.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryInvoicesDto) { return this.service.findAll(tenantId, q); }

  @Permissions('billing.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('billing.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateInvoiceDto) { return this.service.update(tenantId, id, dto); }
}