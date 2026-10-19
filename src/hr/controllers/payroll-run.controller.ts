import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PayrollRunService } from '../services/payroll-run.service.js';
import { CreatePayrollRunDto, UpdatePayrollRunDto } from '../dto/payroll-run.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/payroll-runs')
export class PayrollRunController {
  constructor(private readonly service: PayrollRunService) {}

  @Permissions('hr.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreatePayrollRunDto) { return this.service.create(tenantId, dto); }

  @Permissions('hr.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('hr.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('hr.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdatePayrollRunDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('hr.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('hr.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}