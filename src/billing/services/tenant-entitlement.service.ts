import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

export interface PlanLimit {
  featureCode: string;
  limit: number | null;
  enabled: boolean;
}

/**
 * Subscription and plan entitlements.
 *
 * The subscription, plan and feature models were fully modelled and seeded
 * but never read: a tenant whose subscription had been cancelled or expired
 * kept 100% API access, and the plan limits (`students.limit: 200`,
 * `teachers.limit: 20`) were never enforced, so a school on the Basic plan
 * could enrol ten thousand students.
 */
@Injectable()
export class TenantEntitlementService {
  private readonly logger = new Logger(TenantEntitlementService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the tenant's current subscription, if any.
   *
   * A tenant without a subscription is allowed through: schools are onboarded
   * before their plan is assigned. A tenant whose subscription has been
   * cancelled, suspended or expired is not.
   */
  async getCurrentSubscription(tenantId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        tenantId,
        status: { in: ['TRIAL', 'ACTIVE', 'PAST_DUE'] },
      },
      orderBy: { createdAt: 'desc' },
      include: { plan: { include: { features: { include: { feature: true } } } } },
    });
    return subscription;
  }

  /**
   * The status of a tenant's subscription, as a single word, for the
   * authentication principal.
   */
  async getSubscriptionStatus(tenantId: string): Promise<string> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { status: true, endDate: true },
    });
    if (!subscription) return 'NONE';
    if (subscription.endDate && subscription.endDate < new Date() && subscription.status !== 'EXPIRED') {
      return 'EXPIRED';
    }
    return subscription.status;
  }

  /** The entitlements of the tenant's current plan. */
  async getPlanLimits(tenantId: string): Promise<Map<string, PlanLimit>> {
    const subscription = await this.getCurrentSubscription(tenantId);
    const limits = new Map<string, PlanLimit>();
    if (!subscription) return limits;

    for (const planFeature of subscription.plan.features) {
      limits.set(planFeature.feature.code, {
        featureCode: planFeature.feature.code,
        limit: planFeature.limit,
        enabled: planFeature.isEnabled,
      });
    }
    return limits;
  }

  /**
   * Plan code + enabled feature codes for the tenant, for clients that
   * gate UI on plan entitlements (e.g. whether to show the mobile-app
   * download, brand colors, or a priority-support badge).
   *
   * `mobile.app` and `priority.support` have no server-side surface —
   * the same API serves web and mobile — so they are delivered to the
   * client here. Server-enforceable flags are enforced by the guards, not
   * merely listed.
   */
  async getPlanFeatures(
    tenantId: string,
  ): Promise<{ planCode: string | null; features: string[] }> {
    const subscription = await this.getCurrentSubscription(tenantId);
    if (!subscription?.plan) return { planCode: null, features: [] };
    return {
      planCode: subscription.plan.code,
      features: subscription.plan.features
        .filter((f) => f.isEnabled)
        .map((f) => f.feature.code)
        .sort(),
    };
  }

  /**
   * Rejects a tenant whose subscription has lapsed.
   *
   * `TRIAL` and `ACTIVE` are allowed; `PAST_DUE` is allowed but logged.
   * `CANCELLED`, `SUSPENDED`, `EXPIRED` and a missing subscription that has
   * ended are not.
   */
  assertSubscriptionUsable(status: string): void {
    const blocked = ['CANCELLED', 'SUSPENDED', 'EXPIRED'];
    if (blocked.includes(status)) {
      throw new ForbiddenException(
        `This school's subscription is ${status.toLowerCase()}. Please contact the platform administrator.`,
      );
    }
  }

  /**
   * Throws when a feature is not part of the tenant's plan.
   *
   * A tenant with no subscription at all gets nothing: trials and paid
   * plans carry feature sets, and an unsubscribed school has not bought any.
   * (The old behaviour silently allowed everything, which made plan gating
   * decorative for any tenant without a subscription row.)
   */
  async assertFeatureEnabled(tenantId: string, featureCode: string): Promise<void> {
    const limits = await this.getPlanLimits(tenantId);
    if (limits.size === 0) {
      throw new ForbiddenException(
        'This school has no subscription — an active plan is required to use this feature. Please contact the platform administrator.',
      );
    }
    const limit = limits.get(featureCode);
    if (!limit || !limit.enabled) {
      throw new ForbiddenException(
        `The "${featureCode}" feature is not included in this school's plan`,
      );
    }
  }

  /**
   * Throws when the tenant has reached the limit of a countable feature
   * (students, teachers, storage).
   */
  async assertWithinLimit(
    tenantId: string,
    featureCode: string,
    currentCount: number,
  ): Promise<void> {
    const limits = await this.getPlanLimits(tenantId);
    if (limits.size === 0) return;
    const limit = limits.get(featureCode);
    if (!limit || !limit.enabled || limit.limit === null) return;
    if (currentCount >= limit.limit) {
      throw new BadRequestException(
        `This school's plan allows at most ${limit.limit} for "${featureCode}"`,
      );
    }
  }
}
