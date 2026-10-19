import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EnrollmentService } from '../services/enrollment.service.js';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from '../dto/enrollment.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/enrollments')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Permissions('enrollments.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateEnrollmentDto) { return this.service.create(tenantId, dto); }

  @Permissions('enrollments.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('enrollments.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('enrollments.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateEnrollmentDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('enrollments.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('enrollments.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}