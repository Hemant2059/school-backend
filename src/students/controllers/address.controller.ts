import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AddressService } from '../services/address.service.js';
import { CreateAddressDto, UpdateAddressDto } from '../dto/address.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/addresses')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Permissions('addresses.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateAddressDto) { return this.service.create(tenantId, dto); }

  @Permissions('addresses.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('addresses.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('addresses.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateAddressDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('addresses.manage')
  @Delete(':id')
  softDelete(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.softDelete(tenantId, id); }

  @Permissions('addresses.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }
}