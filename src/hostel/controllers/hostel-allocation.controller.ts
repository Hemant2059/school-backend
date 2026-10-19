import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HostelAllocationService } from '../services/hostel-allocation.service.js';
import { CreateHostelAllocationDto, UpdateHostelAllocationDto } from '../dto/hostel.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/hostel-allocations')
export class HostelAllocationController {
  constructor(private readonly service: HostelAllocationService) {}

  @Permissions('hostel.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateHostelAllocationDto) { return this.service.create(tenantId, dto); }

  @Permissions('hostel.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('hostel.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('hostel.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateHostelAllocationDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('hostel.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('hostel.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}