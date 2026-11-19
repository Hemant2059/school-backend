import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PLAN_FEATURE_KEY } from '../decorators/plan-feature.decorator.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';

/**
 * Plan-entitlement gate for features sold as plan tiers.
 *
 * Only active on routes annotated `@PlanFeature('feature.code')`; everything
 * else passes through untouched. The tenant is taken from the JWT (never
 * from the path — path tenant ids are attacker-controlled elsewhere, but
 * here we prefer the path param only as a fallback when the caller is not
 * a tenant principal).
 */
@Injectable()
export class PlanFeatureGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string>(PLAN_FEATURE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true; // no plan-gated feature on this route

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedPrincipal | undefined;
    const tenantId =
      user?.type === 'tenant'
        ? (user.tenantId ?? request.params?.tenantId)
        : request.params?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException('A tenant context is required for this resource');
    }

    await this.entitlements.assertFeatureEnabled(tenantId, required);
    return true;
  }
}
