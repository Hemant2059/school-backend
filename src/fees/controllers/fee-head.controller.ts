import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FeeHeadService } from '../services/fee-head.service.js';
import { CreateFeeHeadDto, UpdateFeeHeadDto } from '../dto/fee-head.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/fee-heads')
export class FeeHeadController {
  constructor(private readonly service: FeeHeadService) {}

  @Permissions('fees.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateFeeHeadDto) { return this.service.create(tenantId, dto); }

  @Permissions('fees.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('fees.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('fees.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateFeeHeadDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('fees.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('fees.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}