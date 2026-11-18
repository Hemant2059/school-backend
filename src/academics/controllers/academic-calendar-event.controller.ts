import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AcademicCalendarEventService } from '../services/academic-calendar-event.service.js';
import {
  CreateAcademicCalendarEventDto,
  UpdateAcademicCalendarEventDto,
} from '../dto/academic-calendar-event.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/academic-calendar-events')
export class AcademicCalendarEventController {
  constructor(private readonly service: AcademicCalendarEventService) {}

  @Permissions('academic_calendar.manage')
  @Post()
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateAcademicCalendarEventDto,
  ) {
    return this.service.create(tenantId, dto.academicYearId, dto);
  }

  /**
   * Bulk-import calendar events (e.g. holidays) from CSV.
   *
   * Two ways to call it:
   *   1. Raw CSV body —  POST .../import?academicYearId=...  with
   *      Content-Type: text/csv
   *   2. JSON wrapper —   POST .../import?academicYearId=...  with
   *      Content-Type: application/json  and  { "csv": "..." }
   *
   * Expected CSV header (case-insensitive):
   *   dateAd,dateBs,titleEn,titleNe,isHoliday
   * Only dateAd and titleEn are required. Responds with a summary
   * { total, created, duplicates, errors[] } — rows that fail validation
   * do not abort the rest of the import.
   */
  @Permissions('academic_calendar.manage')
  @Post('import')
  importCsv(
    @Param('tenantId') tenantId: string,
    @Query('academicYearId') academicYearId: string | undefined,
    @Req() req: Request,
  ) {
    const body = req.body as unknown;
    const csv =
      typeof body === 'string'
        ? body
        : (body as { csv?: string } | undefined)?.csv;
    return this.service.importCsv(tenantId, academicYearId, csv ?? '');
  }

  @Permissions('academic_calendar.read')
  @Get()
  findAll(
    @Param('tenantId') tenantId: string,
    @Query() query: Record<string, any>,
  ) {
    return this.service.findAll(tenantId, query);
  }

  @Permissions('academic_calendar.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('academic_calendar.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAcademicCalendarEventDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Permissions('academic_calendar.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('academic_calendar.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
