import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentScholarshipService } from '../services/student-scholarship.service.js';
import { CreateStudentScholarshipDto, UpdateStudentScholarshipDto } from '../dto/student-scholarship.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/student-scholarships')
export class StudentScholarshipController {
  constructor(private readonly service: StudentScholarshipService) {}

  @Permissions('scholarships.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateStudentScholarshipDto) { return this.service.create(tenantId, dto); }

  @Permissions('scholarships.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('scholarships.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('scholarships.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateStudentScholarshipDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('scholarships.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }
}