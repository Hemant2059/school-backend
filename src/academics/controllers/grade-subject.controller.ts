import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GradeSubjectService } from '../services/grade-subject.service.js';
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from '../dto/grade-subject.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/grade-subjects')
export class GradeSubjectController {
  constructor(private readonly service: GradeSubjectService) {}

  @Permissions('grade_subjects.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateGradeSubjectDto) { return this.service.create(tenantId, dto); }

  @Permissions('grade_subjects.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('grade_subjects.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('grade_subjects.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateGradeSubjectDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('grade_subjects.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('grade_subjects.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}