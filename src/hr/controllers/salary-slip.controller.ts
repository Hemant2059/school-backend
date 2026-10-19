import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SalarySlipService } from '../services/salary-slip.service.js';
import { CreateSalarySlipDto, UpdateSalarySlipDto } from '../dto/salary-slip.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/salary-slips')
export class SalarySlipController {
  constructor(private readonly service: SalarySlipService) {}

  @Permissions('hr.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateSalarySlipDto) { return this.service.create(tenantId, dto); }

  @Permissions('hr.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('hr.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('hr.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateSalarySlipDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('hr.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('hr.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}