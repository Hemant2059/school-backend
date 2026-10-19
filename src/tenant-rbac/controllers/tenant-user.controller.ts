import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TenantUserService } from '../services/tenant-user.service.js';
import { CreateTenantUserDto, UpdateTenantUserDto, AssignTenantUserRolesDto } from '../dto/role.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/users')
export class TenantUserController {
  constructor(private readonly service: TenantUserService) {}

  @Permissions('tenant_users.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: CreateTenantUserDto) { return this.service.create(tenantId, dto); }

  @Permissions('tenant_users.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) { return this.service.findAll(tenantId); }

  @Permissions('tenant_users.read')
  @Get(':id')
  findOne(@Param('tenantId') tenantId: string, @Param('id') id: string) { return this.service.findOne(tenantId, id); }

  @Permissions('tenant_users.manage')
  @Patch(':id')
  update(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: UpdateTenantUserDto) { return this.service.update(tenantId, id, dto); }

  @Permissions('tenant_users.manage')
  @Post(':id/roles')
  assignRoles(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: AssignTenantUserRolesDto) {
    return this.service.assignRoles(tenantId, id, dto.roleNames);
  }

  @Permissions('tenant_users.manage')
  @Delete(':id/roles')
  revokeRoles(@Param('tenantId') tenantId: string, @Param('id') id: string, @Body() dto: AssignTenantUserRolesDto) {
    return this.service.revokeRoles(tenantId, id, dto.roleNames);
  }
}