import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ExamService } from '../services/exam.service.js';
import { ExamResultService } from '../services/exam-result.service.js';
import { CreateExamDto, UpdateExamDto } from '../dto/exam.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/exams')
export class ExamController {
  constructor(
    private readonly service: ExamService,
    private readonly results: ExamResultService,
  ) {}

  @Permissions('exams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateExamDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('exams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: Record<string, any>) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('exams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('exams.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExamDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  /** Publishes an exam so marks can be recorded against it. */
  @Permissions('exams.manage')
  @Post(':id/publish')
  publish(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.publish(tenantId, id);
  }

  /** Locks an exam, freezing its marks and results. */
  @Permissions('exams.manage')
  @Post(':id/lock')
  lock(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.lock(tenantId, id);
  }

  @Permissions('exams.manage')
  @Post(':id/unlock')
  unlock(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.unlock(tenantId, id);
  }

  /**
   * Computes the results of every eligible student: marks, percentage,
   * credit-weighted GPA, final grade, section and grade ranks, attendance.
   */
  @Permissions('exams.manage')
  @Post(':id/generate-results')
  generateResults(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.results.generateForExam(tenantId, id);
  }

  @Permissions('exams.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('exams.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
