import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentExamSummaryService } from '../services/student-exam-summary.service.js';
import { CreateStudentExamSummaryDto, UpdateStudentExamSummaryDto } from '../dto/student-exam-summary.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/student-exam-summaries')
export class StudentExamSummaryController {
  constructor(private readonly service: StudentExamSummaryService) {}

  @Permissions('exams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStudentExamSummaryDto) { return this.service.create(tenantId, dto); }

  @Permissions('exams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('exams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('exams.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStudentExamSummaryDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('exams.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}