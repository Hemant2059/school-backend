import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service.js';
import { CreateVehicleDto, UpdateVehicleDto } from '../dto/vehicle.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/transport-vehicles')
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Permissions('transport.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateVehicleDto) { return this.service.create(tenantId, dto); }

  @Permissions('transport.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('transport.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('transport.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateVehicleDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('transport.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('transport.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}