import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PayrollRunService } from '../services/payroll-run.service.js';
import { CreatePayrollRunDto, UpdatePayrollRunDto } from '../dto/payroll-run.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/payroll-runs')
export class PayrollRunController {
  constructor(private readonly service: PayrollRunService) {}

  @Permissions('hr.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreatePayrollRunDto) {
    return this.service.create(tenantId, dto);
  }

  /**
   * Generates the salary slips of a run. Every figure — gross, PF/SSF, CIT,
   * TDS, SST and the net — is computed by the payroll engine.
   */
  @Permissions('hr.manage')
  @Post('generate')
  generate(
    @Param('tenantId') tenantId: string,
    @Body() dto: { fiscalYearId: string; bsYear: number; bsMonth: number },
  ) {
    return this.service.generate(tenantId, dto);
  }

  @Permissions('hr.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('hr.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('hr.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePayrollRunDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Permissions('hr.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('hr.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
