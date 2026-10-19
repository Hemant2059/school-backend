import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AcademicCalendarEventService } from '../services/academic-calendar-event.service.js';
import { CreateAcademicCalendarEventDto, UpdateAcademicCalendarEventDto } from '../dto/academic-calendar-event.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/academic-calendar-events')
export class AcademicCalendarEventController {
  constructor(private readonly service: AcademicCalendarEventService) {}

  @Permissions('academic_calendar.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateAcademicCalendarEventDto) {
    return this.service.create(tenantId, dto.academicYearId, dto);
  }

  @Permissions('academic_calendar.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('academic_calendar.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('academic_calendar.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateAcademicCalendarEventDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('academic_calendar.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('academic_calendar.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}