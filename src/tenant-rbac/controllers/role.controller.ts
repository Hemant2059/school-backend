import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TenantRoleService } from '../services/role.service.js';
import { CreateRoleDto, UpdateRoleDto, AssignRolePermissionsDto } from '../dto/role.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/roles')
export class RoleController {
  constructor(private readonly service: TenantRoleService) {}

  @Permissions('roles.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateRoleDto) { return this.service.create(tenantId, dto); }

  @Permissions('roles.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('roles.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('roles.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateRoleDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('roles.manage')
  @Delete(':id')
  remove(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.remove(tenantId, id); }

  @Permissions('roles.manage')
  @Post(':id/restore')
  restore(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.restore(tenantId, id); }

  @Permissions('roles.manage')
  @Put(':id/permissions')
  replace(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(tenantId, id, dto.permissionCodes, 'replace');
  }

  @Permissions('roles.manage')
  @Post(':id/permissions')
  add(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(tenantId, id, dto.permissionCodes, 'add');
  }

  @Permissions('roles.manage')
  @Delete(':id/permissions')
  removePerms(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: AssignRolePermissionsDto) {
    return this.service.setPermissions(tenantId, id, dto.permissionCodes, 'remove');
  }
}