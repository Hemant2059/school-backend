import { Body, Controller, Param, Patch } from '@nestjs/common';
import { TenantService } from '../services/tenant.service.js';
import { UpdateBrandingDto } from '../dto/branding.dto.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { TenantOnly } from '../../auth/decorators/tenant-only.decorator.js';
import { PlanFeature } from '../../common/decorators/plan-feature.decorator.js';

/**
 * The school's own branding — logo, website, motto — for premium plans.
 * Deliberately narrower than the platform tenant update:
 * legal identity (IEMIS code, PAN, subdomain) is platform-only.
 */
@Controller('tenants/:tenantId/branding')
@TenantOnly()
export class TenantBrandingController {
  constructor(private readonly service: TenantService) {}

  @Permissions('school.manage')
  @PlanFeature('custom.branding')
  @Patch()
  update(@Param('tenantId') tenantId: string, @Body() dto: UpdateBrandingDto) {
    return this.service.updateBranding(tenantId, dto);
  }
}
