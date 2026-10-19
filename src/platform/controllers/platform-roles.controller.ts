import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PlatformRolesService } from '../services/platform-roles.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { CreatePlatformRoleDto } from '../dto/create-platform-role.dto.js';
import { UpdatePlatformRoleDto } from '../dto/update-platform-role.dto.js';
import { QueryPlatformRolesDto } from '../dto/query-platform-roles.dto.js';
import { AssignRolePermissionsDto } from '../dto/assign-role-permissions.dto.js';

@Controller('platform/roles')
export class PlatformRolesController {
  constructor(private readonly service: PlatformRolesService) {}

  @Permissions('roles.manage')
  @Post()
  create(@Body() dto: CreatePlatformRoleDto) {
    return this.service.create(dto);
  }

  @Permissions('roles.read')
  @Get()
  findAll(@Query() query: QueryPlatformRolesDto) {
    return this.service.findAll(query);
  }

  @Permissions('roles.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Permissions('roles.manage')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatformRoleDto) {
    return this.service.update(id, dto);
  }

  @Permissions('roles.manage')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Permissions('roles.manage')
  @Put(':id/permissions')
  replacePermissions(@Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(id, dto.permissionCodes, 'replace');
  }

  @Permissions('roles.manage')
  @Post(':id/permissions')
  addPermissions(@Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(id, dto.permissionCodes, 'add');
  }

  @Permissions('roles.manage')
  @Delete(':id/permissions')
  removePermissions(@Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(id, dto.permissionCodes, 'remove');
  }
}