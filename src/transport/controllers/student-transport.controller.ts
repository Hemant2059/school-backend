import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentTransportService } from '../services/student-transport.service.js';
import { CreateStudentTransportDto, UpdateStudentTransportDto } from '../dto/student-transport.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/student-transports')
export class StudentTransportController {
  constructor(private readonly service: StudentTransportService) {}

  @Permissions('transport.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStudentTransportDto) { return this.service.create(tenantId, dto); }

  @Permissions('transport.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('transport.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('transport.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStudentTransportDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('transport.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('transport.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}