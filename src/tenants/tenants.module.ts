import { Module } from '@nestjs/common';
import { TenantController } from './controllers/tenant.controller.js';
import { TenantBrandingController } from './controllers/tenant-branding.controller.js';
import { PlatformTenantUsersController } from './controllers/platform-tenant-users.controller.js';
import { TenantService } from './services/tenant.service.js';
import { TenantRbacModule } from '../tenant-rbac/tenant-rbac.module.js';
import { PlatformModule } from '../platform/platform.module.js';

import { TenantProvisioningService } from './services/tenant-provisioning.service.js';

@Module({
  imports: [TenantRbacModule, PlatformModule],
  controllers: [TenantController, PlatformTenantUsersController, TenantBrandingController],
  providers: [TenantService, TenantProvisioningService],
  exports: [TenantService],
})
export class TenantsModule {}
