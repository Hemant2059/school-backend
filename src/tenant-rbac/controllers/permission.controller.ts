import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TenantPermissionService } from '../services/permission.service.js';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly service: TenantPermissionService) {}

  @Permissions('permissions.manage')
  @Post()
  create(@Body() dto: CreatePermissionDto) { return this.service.create(dto); }

  @Permissions('permissions.read')
  @Get()
  findAll(@Query() q: any) { return this.service.findAll(q); }

  @Permissions('permissions.read')
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Permissions('permissions.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) { return this.service.update(id, dto); }

  @Permissions('permissions.manage')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}