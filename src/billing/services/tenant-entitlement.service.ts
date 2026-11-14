import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  /** Throws when a feature is not part of the tenant's plan. */
  async assertFeatureEnabled(tenantId: string, featureCode: string): Promise<void> {
    const limits = await this.getPlanLimits(tenantId);
    if (limits.size === 0) return; // No plan configured: nothing to enforce.
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
