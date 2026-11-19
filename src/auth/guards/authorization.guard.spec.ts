import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthorizationGuard } from './authorization.guard.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator.js';
import { PLATFORM_ONLY_KEY } from '../decorators/platform-only.decorator.js';
import { TENANT_ONLY_KEY } from '../decorators/tenant-only.decorator.js';

function makeContext(options: {
  user?: any;
  params?: Record<string, string>;
  public?: boolean;
  permissions?: string[];
  platformOnly?: boolean;
  tenantOnly?: boolean;
  path?: string;
  method?: string;
}): ExecutionContext {
  const handler = () => undefined;
  const cls = class {};
  const _reflector = new Reflector();
  const metadata = (key: string, value: unknown) =>
    (Reflect as any).defineMetadata
      ? (Reflect as any).defineMetadata(key, value, handler)
      : undefined;

  if (options.public) metadata(IS_PUBLIC_KEY, true);
  if (options.permissions) metadata(PERMISSIONS_KEY, options.permissions);
  if (options.platformOnly) metadata(PLATFORM_ONLY_KEY, true);
  if (options.tenantOnly) metadata(TENANT_ONLY_KEY, true);

  const request = {
    user: options.user,
    params: options.params ?? {},
    path: (options as any).path ?? '/whatever',
    method: (options as any).method ?? 'GET',
  };

  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;

  beforeEach(() => {
    guard = new AuthorizationGuard(new Reflector());
  });

  describe('public routes', () => {
    it('allows a request without a principal', () => {
      const context = makeContext({ public: true });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('authentication', () => {
    it('rejects a request with no principal', () => {
      expect(() => guard.canActivate(makeContext({}))).toThrow(/Authentication required/);
    });
  });

  describe('domain separation', () => {
    it('blocks a tenant principal from a platform-only route', () => {
      const context = makeContext({
        user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: ['roles.manage'] },
        platformOnly: true,
      });
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('lets a platform principal reach a platform-only route', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: ['roles.manage'] },
        platformOnly: true,
        permissions: ['roles.manage'],
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('blocks a platform principal from a tenant-only route', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: ['students.read'] },
        tenantOnly: true,
      });
      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('lets a tenant principal reach a tenant-only route', () => {
      const context = makeContext({
        user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: [] },
        tenantOnly: true,
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('tenant scope', () => {
    it('rejects a tenant principal addressing another tenant', () => {
      const context = makeContext({
        user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: ['students.read'] },
        params: { tenantId: 't2' },
        permissions: ['students.read'],
      });
      expect(() => guard.canActivate(context)).toThrow(/another tenant/);
    });

    it('allows a tenant principal addressing its own tenant', () => {
      const context = makeContext({
        user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: ['students.read'] },
        params: { tenantId: 't1' },
        permissions: ['students.read'],
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('does not constrain a platform principal', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: ['students.read'] },
        params: { tenantId: 't2' },
        permissions: ['students.read'],
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('subscription status', () => {
    it('blocks a tenant whose subscription has been cancelled', () => {
      const context = makeContext({
        user: {
          type: 'tenant',
          id: 'u1',
          tenantId: 't1',
          permissions: [],
          subscriptionStatus: 'CANCELLED',
        },
      });
      expect(() => guard.canActivate(context)).toThrow(/subscription is cancelled/);
    });

    it('allows a tenant on a trial', () => {
      const context = makeContext({
        user: {
          type: 'tenant',
          id: 'u1',
          tenantId: 't1',
          permissions: [],
          subscriptionStatus: 'TRIAL',
        },
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('allows a tenant with no subscription yet (onboarding)', () => {
      const context = makeContext({
        user: {
          type: 'tenant',
          id: 'u1',
          tenantId: 't1',
          permissions: [],
          subscriptionStatus: 'NONE',
        },
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('mustChangePassword', () => {
    const tempPrincipal = {
      type: 'platform',
      id: 'p1',
      permissions: ['students.read'],
      mustChangePassword: true,
    };

    it('blocks every non-whitelisted route while the flag is set', () => {
      const context = makeContext({ user: tempPrincipal });
      expect(() => guard.canActivate(context)).toThrow(/must change your password/i);
    });

    it('allows the change-password route', () => {
      const context = makeContext({
        user: tempPrincipal,
        path: '/auth/change-password',
        method: 'POST',
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('allows the tenant change-password route', () => {
      const context = makeContext({
        user: tempPrincipal,
        path: '/tenant/auth/change-password',
        method: 'POST',
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('allows the identity endpoint', () => {
      const context = makeContext({ user: tempPrincipal, path: '/auth/me', method: 'GET' });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('allows a cleared flag to use any route', () => {
      const context = makeContext({
        user: { ...tempPrincipal, mustChangePassword: false },
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('permissions', () => {
    it('allows a route with no permission requirement', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: [] },
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('requires every listed permission', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: ['a.read'] },
        permissions: ['a.read', 'b.manage'],
      });
      expect(() => guard.canActivate(context)).toThrow(/Insufficient permissions/);
    });

    it('allows a route when all permissions are held', () => {
      const context = makeContext({
        user: { type: 'platform', id: 'p1', permissions: ['a.read', 'b.manage'] },
        permissions: ['a.read', 'b.manage'],
      });
      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
