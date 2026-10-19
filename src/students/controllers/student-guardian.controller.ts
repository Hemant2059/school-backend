import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentGuardianService } from '../services/student-guardian.service.js';
import { CreateStudentGuardianDto, UpdateStudentGuardianDto } from '../dto/student-guardian.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/student-guardians')
export class StudentGuardianController {
  constructor(private readonly service: StudentGuardianService) {}

  @Permissions('students.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStudentGuardianDto) { return this.service.create(tenantId, dto); }

  @Permissions('students.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('students.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('students.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStudentGuardianDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('students.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}