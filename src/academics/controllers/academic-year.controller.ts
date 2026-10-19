import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AcademicYearService } from '../services/academic-year.service.js';
import { CreateAcademicYearDto, UpdateAcademicYearDto, QueryAcademicYearsDto } from '../dto/academic-year.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/academic-years')
export class AcademicYearController {
  constructor(private readonly service: AcademicYearService) {}

  @Permissions('academic_years.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateAcademicYearDto) { return this.service.create(tenantId, dto); }

  @Permissions('academic_years.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryAcademicYearsDto) { return this.service.findAll(tenantId, q); }

  @Permissions('academic_years.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('academic_years.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateAcademicYearDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('academic_years.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('academic_years.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}