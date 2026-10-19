import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StaffProfileService } from '../services/staff-profile.service.js';
import { CreateStaffProfileDto, UpdateStaffProfileDto } from '../dto/staff-profile.dto.js';
import { QueryStaffProfilesDto } from '../dto/query.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/staff-profiles')
export class StaffProfileController {
  constructor(private readonly service: StaffProfileService) {}

  @Permissions('staff.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStaffProfileDto) { return this.service.create(tenantId, dto); }

  @Permissions('staff.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string, @Query() q: QueryStaffProfilesDto) { return this.service.findAll(tenantId, q); }

  @Permissions('staff.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('staff.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStaffProfileDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('staff.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('staff.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}