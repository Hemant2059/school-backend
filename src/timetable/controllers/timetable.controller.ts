import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TimetableService } from '../services/timetable.service.js';
import {
  CreateTimetableSlotDto,
  QueryTimetableDto,
  UpdateTimetableSlotDto,
} from '../dto/timetable.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/timetable')
export class TimetableController {
  constructor(private readonly service: TimetableService) {}

  @Permissions('sections.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateTimetableSlotDto) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('sections.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() query: QueryTimetableDto) {
    return this.service.findAll(tenantId, query);
  }

  /** The timetable of one section, grouped by day. */
  @Permissions('sections.read')
  @Get('section/:sectionId')
  forSection(
    @Param('tenantId') tenantId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.service.forSection(tenantId, sectionId);
  }

  @Permissions('sections.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Permissions('sections.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTimetableSlotDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Permissions('sections.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.softDelete(tenantId, id);
  }

  @Permissions('sections.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.restore(tenantId, id);
  }
}
