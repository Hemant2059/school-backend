import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from '../services/student.service.js';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Permissions('students.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStudentDto) { return this.service.create(tenantId, dto); }

  @Permissions('students.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('students.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('students.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStudentDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('students.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('students.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}