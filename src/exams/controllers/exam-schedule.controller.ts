import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ExamScheduleService } from '../services/exam-schedule.service.js';
import { CreateExamScheduleDto, UpdateExamScheduleDto } from '../dto/exam-schedule.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/exam-schedules')
export class ExamScheduleController {
  constructor(private readonly service: ExamScheduleService) {}

  @Permissions('exams.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateExamScheduleDto) { return this.service.create(tenantId, dto); }

  @Permissions('exams.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('exams.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('exams.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateExamScheduleDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('exams.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }
}