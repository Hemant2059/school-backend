import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller.js';
import { OrganizationService } from './services/organization.service.js';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationsModule {}