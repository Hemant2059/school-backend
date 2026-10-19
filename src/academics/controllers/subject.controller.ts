import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubjectService } from '../services/subject.service.js';
import { CreateSubjectDto, UpdateSubjectDto } from '../dto/subject.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/subjects')
export class SubjectController {
  constructor(private readonly service: SubjectService) {}

  @Permissions('subjects.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateSubjectDto) { return this.service.create(tenantId, dto); }

  @Permissions('subjects.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('subjects.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('subjects.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateSubjectDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('subjects.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('subjects.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}