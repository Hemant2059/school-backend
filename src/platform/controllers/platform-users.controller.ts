import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PlatformUsersService } from '../services/platform-users.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { CreatePlatformUserDto } from '../dto/create-platform-user.dto.js';
import { UpdatePlatformUserDto } from '../dto/update-platform-user.dto.js';
import { QueryPlatformUsersDto } from '../dto/query-platform-users.dto.js';
import { AssignUserRolesDto, RevokeUserRolesDto } from '../dto/assign-user-roles.dto.js';
import { OverrideUserPermissionsDto } from '../dto/override-user-permissions.dto.js';

@Controller('platform/users')
export class PlatformUsersController {
  constructor(private readonly service: PlatformUsersService) {}

  @Permissions('platform_users.create')
  @Post()
  create(@Body() dto: CreatePlatformUserDto) {
    return this.service.create(dto);
  }

  @Permissions('platform_users.read')
  @Get()
  findAll(@Query() query: QueryPlatformUsersDto) {
    return this.service.findAll(query);
  }

  @Permissions('platform_users.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Permissions('platform_users.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatformUserDto) {
    return this.service.update(id, dto);
  }

  @Permissions('platform_users.delete')
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }

  @Permissions('platform_users.delete')
  @Delete(':id/permanent')
  hardDelete(@Param('id') id: string) { return this.service.hardDelete(id); }

  @Permissions('platform_users.update')
  @Post(':id/restore')
  @HttpCode(200)
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }

  @Permissions('platform_users.update')
  @Post(':id/roles')
  @HttpCode(200)
  assignRoles(@Param('id') id: string, @Body() dto: AssignUserRolesDto) {
    return this.service.assignRoles(id, dto.roleNames);
  }

  @Permissions('platform_users.update')
  @Delete(':id/roles')
  revokeRoles(@Param('id') id: string, @Body() dto: RevokeUserRolesDto) {
    return this.service.revokeRoles(id, dto.roleNames);
  }

  @Permissions('platform_users.update')
  @Post(':id/permissions')
  @HttpCode(200)
  overridePermissions(@Param('id') id: string, @Body() dto: OverrideUserPermissionsDto) {
    return this.service.overridePermissions(id, dto.permissionCodes, dto.granted);
  }

  @Permissions('platform_users.update')
  @Delete(':id/permissions/:code')
  removePermissionOverride(@Param('id') id: string, @Param('code') code: string) {
    return this.service.removePermissionOverride(id, code);
  }
}