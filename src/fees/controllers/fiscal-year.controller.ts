import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FiscalYearService } from '../services/fiscal-year.service.js';
import { CreateFiscalYearDto, UpdateFiscalYearDto } from '../dto/fiscal-year.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fiscal-years')
export class FiscalYearController {
  constructor(private readonly service: FiscalYearService) {}

  @Permissions('fees.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFiscalYearDto) { return this.service.create(tenantId, dto); }

  @Permissions('fees.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('fees.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('fees.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFiscalYearDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('fees.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('fees.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}