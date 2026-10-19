import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RouteService } from '../services/route.service.js';
import { CreateRouteDto, UpdateRouteDto } from '../dto/route.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/transport-routes')
export class RouteController {
  constructor(private readonly service: RouteService) {}

  @Permissions('transport.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateRouteDto) { return this.service.create(tenantId, dto); }

  @Permissions('transport.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('transport.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('transport.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateRouteDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('transport.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('transport.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}