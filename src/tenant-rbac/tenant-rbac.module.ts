import { Module } from '@nestjs/common';
import { PermissionController } from './controllers/permission.controller.js';
import { RoleController } from './controllers/role.controller.js';
import { TenantUserController } from './controllers/tenant-user.controller.js';
import { TenantPermissionService } from './services/permission.service.js';
import { TenantRoleService } from './services/role.service.js';
import { TenantUserService } from './services/tenant-user.service.js';

@Module({
  controllers: [PermissionController, RoleController, TenantUserController],
  providers: [TenantPermissionService, TenantRoleService, TenantUserService],
  exports: [TenantPermissionService, TenantRoleService, TenantUserService],
})
export class TenantRbacModule {}