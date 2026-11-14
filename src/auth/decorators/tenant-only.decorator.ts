import { SetMetadata } from '@nestjs/common';

export const TENANT_ONLY_KEY = 'tenantOnly';

/**
 * Marks a route (or controller) as reachable only by tenant principals —
 * staff of a single school.
 *
 * Platform principals may still read tenant data (support workflows) but that
 * access is written to the audit log. Tenant principals are additionally
 * pinned to their own tenant by the authorization guard.
 */
export const TenantOnly = () => SetMetadata(TENANT_ONLY_KEY, true);
