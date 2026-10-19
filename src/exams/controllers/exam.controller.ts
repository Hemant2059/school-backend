import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ExamService } from '../services/exam.service.js';
import { CreateExamDto, UpdateExamDto } from '../dto/exam.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/exams')
export class ExamController {
  constructor(private readonly service: ExamService) {}

  @Permissions('exams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateExamDto) { return this.service.create(tenantId, dto); }

  @Permissions('exams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('exams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('exams.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateExamDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('exams.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('exams.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}