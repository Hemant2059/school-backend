import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HostelRoomService } from '../services/hostel-room.service.js';
import { CreateHostelRoomDto, UpdateHostelRoomDto } from '../dto/hostel.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/hostel-rooms')
export class HostelRoomController {
  constructor(private readonly service: HostelRoomService) {}

  @Permissions('hostel.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateHostelRoomDto) { return this.service.create(tenantId, dto); }

  @Permissions('hostel.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('hostel.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('hostel.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateHostelRoomDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('hostel.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('hostel.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}