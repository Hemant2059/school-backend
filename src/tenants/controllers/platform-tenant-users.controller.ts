import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { TenantUserService } from '../../tenant-rbac/services/tenant-user.service.js';
import { TenantRoleService } from '../../tenant-rbac/services/role.service.js';

@Controller('platform/tenants/:tenantId/users')
export class PlatformTenantUsersController {
  constructor(private readonly service: TenantUserService, private readonly roleService: TenantRoleService) {}

  @Permissions('tenants.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Permissions('tenants.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: any) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('tenants.manage')
  @Post(':id/send-credentials')
  sendCredentials(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return { sent: true, message: 'Credentials email queued' };
  }

  @Permissions('tenants.read')
  @Get('roles')
  roles(@Param('tenantId') tenantId: string) {
    return this.roleService.findAll(tenantId);
  }
}
