import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ScholarshipSchemeService } from '../services/scholarship-scheme.service.js';
import { CreateScholarshipSchemeDto, UpdateScholarshipSchemeDto } from '../dto/scholarship-scheme.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/scholarship-schemes')
export class ScholarshipSchemeController {
  constructor(private readonly service: ScholarshipSchemeService) {}

  @Permissions('scholarships.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateScholarshipSchemeDto) { return this.service.create(tenantId, dto); }

  @Permissions('scholarships.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('scholarships.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('scholarships.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateScholarshipSchemeDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('scholarships.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('scholarships.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}