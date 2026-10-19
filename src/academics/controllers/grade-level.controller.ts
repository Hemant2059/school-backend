import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { GradeLevelService } from '../services/grade-level.service.js';
import { CreateGradeLevelDto, UpdateGradeLevelDto } from '../dto/grade-level.dto.js';
import { QueryGradeLevelsDto } from '../dto/query.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/grade-levels')
export class GradeLevelController {
  constructor(private readonly service: GradeLevelService) {}

  @Permissions('grade_levels.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateGradeLevelDto) { return this.service.create(tenantId, dto); }

  @Permissions('grade_levels.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryGradeLevelsDto) { return this.service.findAll(tenantId, q); }

  @Permissions('grade_levels.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('grade_levels.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateGradeLevelDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('grade_levels.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('grade_levels.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}