import { Module } from '@nestjs/common';
import { TenantController } from './controllers/tenant.controller.js';
import { PlatformTenantUsersController } from './controllers/platform-tenant-users.controller.js';
import { TenantService } from './services/tenant.service.js';
import { TenantRbacModule } from '../tenant-rbac/tenant-rbac.module.js';

@Module({
  imports: [TenantRbacModule],
  controllers: [TenantController, PlatformTenantUsersController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantsModule {}