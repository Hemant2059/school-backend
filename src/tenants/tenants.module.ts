import { Module } from '@nestjs/common';
import { TenantController } from './controllers/tenant.controller.js';
import { TenantService } from './services/tenant.service.js';

@Module({
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantsModule {}