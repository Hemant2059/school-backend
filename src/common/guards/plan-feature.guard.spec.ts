import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlanFeatureGuard } from './plan-feature.guard.js';
import { PLAN_FEATURE_KEY } from '../decorators/plan-feature.decorator.js';

function makeContext(options: {
  user?: any;
  params?: Record<string, string>;
  feature?: string;
}): ExecutionContext {
  const handler = () => undefined;
  const cls = class {};
  if (options.feature) {
    Reflect.defineMetadata(PLAN_FEATURE_KEY, options.feature, handler);
  }
  const request = { user: options.user, params: options.params ?? {} };
  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function makeEntitlements() {
  return {
    assertFeatureEnabled: vi.fn(async () => undefined),
  } as any;
}

describe('PlanFeatureGuard', () => {
  let guard: PlanFeatureGuard;
  let entitlements: any;

  beforeEach(() => {
    entitlements = makeEntitlements();
    guard = new PlanFeatureGuard(new Reflector(), entitlements);
  });

  it('allows routes with no feature metadata without consulting the plan', async () => {
    const context = makeContext({ user: undefined });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(entitlements.assertFeatureEnabled).not.toHaveBeenCalled();
  });

  it('allows a tenant whose plan includes the feature', async () => {
    const context = makeContext({
      user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: [] },
      feature: 'fee.management',
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(entitlements.assertFeatureEnabled).toHaveBeenCalledWith('t1', 'fee.management');
  });

  it('rejects a tenant whose plan does not include the feature', async () => {
    entitlements.assertFeatureEnabled.mockRejectedValueOnce(
      new ForbiddenException('The "fee.management" feature is not included in this school\'s plan'),
    );
    const context = makeContext({
      user: { type: 'tenant', id: 'u1', tenantId: 't1', permissions: [] },
      feature: 'fee.management',
    });
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('falls back to the :tenantId path param for non-tenant principals', async () => {
    const context = makeContext({
      user: { type: 'platform', id: 'p1', permissions: [] },
      params: { tenantId: 't2' },
      feature: 'fee.management',
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(entitlements.assertFeatureEnabled).toHaveBeenCalledWith('t2', 'fee.management');
  });

  it('fails closed when there is no tenant context at all', async () => {
    const context = makeContext({
      user: { type: 'platform', id: 'p1', permissions: [] },
      feature: 'fee.management',
    });
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
