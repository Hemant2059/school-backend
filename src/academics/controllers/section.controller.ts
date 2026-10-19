import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SectionService } from '../services/section.service.js';
import { CreateSectionDto, UpdateSectionDto } from '../dto/section.dto.js';
import { QuerySectionsDto } from '../dto/query.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/sections')
export class SectionController {
  constructor(private readonly service: SectionService) {}

  @Permissions('sections.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateSectionDto) { return this.service.create(tenantId, dto); }

  @Permissions('sections.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QuerySectionsDto) { return this.service.findAll(tenantId, q); }

  @Permissions('sections.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('sections.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateSectionDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('sections.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('sections.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}