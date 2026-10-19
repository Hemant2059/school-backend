import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlatformPermissionsService } from '../services/platform-permissions.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { CreatePlatformPermissionDto } from '../dto/create-platform-permission.dto.js';
import { UpdatePlatformPermissionDto } from '../dto/update-platform-permission.dto.js';
import { QueryPlatformPermissionsDto } from '../dto/query-platform-permissions.dto.js';

@Controller('platform/permissions')
export class PlatformPermissionsController {
  constructor(private readonly service: PlatformPermissionsService) {}

  @Permissions('permissions.manage')
  @Post()
  create(@Body() dto: CreatePlatformPermissionDto) {
    return this.service.create(dto);
  }

  @Permissions('permissions.read')
  @Get()
  findAll(@Query() query: QueryPlatformPermissionsDto) {
    return this.service.findAll(query);
  }

  @Permissions('permissions.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Permissions('permissions.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatformPermissionDto) {
    return this.service.update(id, dto);
  }

  @Permissions('permissions.manage')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}