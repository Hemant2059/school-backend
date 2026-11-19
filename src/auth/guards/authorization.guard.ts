import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { PLATFORM_ONLY_KEY } from '../decorators/platform-only.decorator.js';
import { TENANT_ONLY_KEY } from '../decorators/tenant-only.decorator.js';
import type { AuthenticatedPrincipal } from '../types/principal.js';

/**
 * Single authorization gate for the whole application.
 *
 * It enforces, in order:
 *
 *  1. `@Public()` routes are open.
 *  2. A principal must exist (the JWT strategy ran first).
 *  3. **Domain check** — a route marked `@PlatformOnly()` requires a platform
 *     principal, a route marked `@TenantOnly()` requires a tenant principal.
 *     This is what stops a school tenant from reaching `/platform/roles` and
 *     rewriting the platform RBAC catalogue (the platform and tenant
 *     permission tables share code strings such as `roles.manage`).
 *  4. **Tenant scope check** — a tenant principal may only address its own
 *     tenant. The `:tenantId` path segment is attacker-controlled, so it must
 *     be compared against the tenant baked into the token. This is what closes
 *     the cross-tenant IDOR.
 *  5. **Permission check** — every `@Permissions('code')` entry must be held.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedPrincipal | undefined;
    if (!user) throw new UnauthorizedException('Authentication required');

    const platformOnly = this.reflector.getAllAndOverride<boolean>(PLATFORM_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const tenantOnly = this.reflector.getAllAndOverride<boolean>(TENANT_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (platformOnly && user.type !== 'platform') {
      throw new ForbiddenException('This resource is restricted to platform administrators');
    }
    if (tenantOnly && user.type !== 'tenant') {
      throw new ForbiddenException('This resource is restricted to school accounts');
    }

    // A school whose subscription has lapsed loses access entirely. The
    // status is resolved once per request by the JWT strategy.
    if (user.type === 'tenant' && user.subscriptionStatus) {
      this.assertSubscriptionUsable(user.subscriptionStatus);
    }

    this.assertPasswordChangeAllowed(user, request);

    this.assertTenantScope(user, request.params);

    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const held = new Set(user.permissions ?? []);
    const missing = required.filter((perm) => !held.has(perm));
    if (missing.length > 0) {
      throw new ForbiddenException(`Insufficient permissions: ${missing.join(', ')}`);
    }
    return true;
  }

  /**
   * A principal whose account carries a forced password change may only
   * reach the password change + identity endpoints; everything else is
   * refused until the flag is cleared (a new password clears it).
   */
  private assertPasswordChangeAllowed(
    user: AuthenticatedPrincipal,
    request: { path?: string; url?: string; method?: string } = {},
  ): void {
    if (!user.mustChangePassword) return;
    const path = (request.path ?? request.url?.split('?')[0] ?? '').replace(/\/+$/, '');
    const method = (request.method ?? 'GET').toUpperCase();
    const allowed: Array<[string, string]> = [
      ['POST', '/auth/change-password'],
      ['POST', '/tenant/auth/change-password'],
      ['GET', '/auth/me'],
      ['GET', '/tenant/auth/me'],
    ];
    if (!allowed.some(([m, p]) => m === method && p === path)) {
      throw new ForbiddenException(
        'You must change your password before using this application',
      );
    }
  }

  /**
   * A tenant principal is pinned to the tenant in its token. The `:tenantId`
   * route segment is supplied by the caller and must never be trusted.
   */
  private assertTenantScope(user: AuthenticatedPrincipal, params: Record<string, string> = {}): void {
    if (user.type !== 'tenant') return;
    const requested = params['tenantId'];
    if (!requested) return;
    if (requested !== user.tenantId) {
      throw new ForbiddenException('Access to another tenant is not permitted');
    }
  }

  /**
   * A school whose subscription has been cancelled, suspended or expired
   * must not be able to use the API.
   *
   * `NONE` (no subscription at all) is allowed so that a school can be
   * onboarded before its plan is assigned.
   */
  private assertSubscriptionUsable(status: string): void {
    if (['CANCELLED', 'SUSPENDED', 'EXPIRED'].includes(status)) {
      throw new ForbiddenException(
        `This school's subscription is ${status.toLowerCase()}. Please contact the platform administrator.`,
      );
    }
  }
}
