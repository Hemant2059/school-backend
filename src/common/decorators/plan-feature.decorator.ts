import { SetMetadata } from '@nestjs/common';

export const PLAN_FEATURE_KEY = 'planFeature';

/**
 * Requires the calling tenant's plan to include `code`.
 *
 * Used for plan-gated features that would otherwise silently degrade:
 * fee management, online payments, SMS, reports, portals, integrations.
 * The check runs after authentication (the guard sees the tenant from the
 * token, falling back to the `:tenantId` path parameter for safety).
 */
export const PlanFeature = (code: string) => SetMetadata(PLAN_FEATURE_KEY, code);
