import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeacherSubjectAllocationService } from '../services/teacher-subject-allocation.service.js';
import { CreateTeacherSubjectAllocationDto, UpdateTeacherSubjectAllocationDto } from '../dto/teacher-subject-allocation.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/teacher-subject-allocations')
export class TeacherSubjectAllocationController {
  constructor(private readonly service: TeacherSubjectAllocationService) {}

  @Permissions('hr.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateTeacherSubjectAllocationDto) { return this.service.create(tenantId, dto); }

  @Permissions('hr.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('hr.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('hr.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateTeacherSubjectAllocationDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('hr.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('hr.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}