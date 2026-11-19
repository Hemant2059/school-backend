import { Controller, Get, Param } from '@nestjs/common';
import { OnboardingService } from '../onboarding.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId')
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  /** The setup checklist for this school — what is configured and what is not. */
  @Permissions('academic_years.read')
  @Get('onboarding-status')
  status(@Param('tenantId') tenantId: string) {
    return this.service.status(tenantId);
  }
}
