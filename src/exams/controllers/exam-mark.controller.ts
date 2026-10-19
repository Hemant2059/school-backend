import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ExamMarkService } from '../services/exam-mark.service.js';
import { CreateExamMarkDto, UpdateExamMarkDto } from '../dto/exam-mark.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/exam-marks')
export class ExamMarkController {
  constructor(private readonly service: ExamMarkService) {}

  @Permissions('exams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateExamMarkDto) { return this.service.create(tenantId, dto); }

  @Permissions('exams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('exams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('exams.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateExamMarkDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('exams.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}