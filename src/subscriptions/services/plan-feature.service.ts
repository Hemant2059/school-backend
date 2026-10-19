import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class PlanFeatureService {
  constructor(private readonly prisma: PrismaService) {}

  async list(planId: string) {
    const plan = await this.resolvePlan(planId);
    return this.prisma.planFeature.findMany({
      where: { planId: plan.id },
      include: { feature: true },
      orderBy: { feature: { code: 'asc' } },
    });
  }

  async add(planId: string, dto: any) {
    const plan = await this.resolvePlan(planId);
    const planIdResolved = plan.id;
    const feature = await this.prisma.feature.findFirst({
      where: { OR: [{ id: dto.featureCode }, { code: dto.featureCode }] },
    });
    if (!feature) throw new NotFoundException('Feature not found');

    return this.prisma.planFeature.upsert({
      where: { planId_featureId: { planId: planIdResolved, featureId: feature.id } },
      update: { isEnabled: dto.isEnabled ?? true, limit: dto.limit, config: dto.config },
      create: { planId: planIdResolved, featureId: feature.id, isEnabled: dto.isEnabled ?? true, limit: dto.limit, config: dto.config },
      include: { feature: true },
    });
  }

  async replace(planId: string, features: any[]) {
    const plan = await this.resolvePlan(planId);
    const resolvedId = plan.id;

    await this.prisma.planFeature.deleteMany({ where: { planId: resolvedId } });

    const rows: any[] = [];
    for (const f of features) {
      const feature = await this.prisma.feature.findFirst({
        where: { OR: [{ id: f.featureCode }, { code: f.featureCode }] },
      });
      if (!feature) throw new NotFoundException(`Feature not found: ${f.featureCode}`);
      rows.push({ planId: resolvedId, featureId: feature.id, isEnabled: f.isEnabled ?? true, limit: f.limit, config: f.config });
    }
    if (rows.length) {
      await this.prisma.planFeature.createMany({ data: rows, skipDuplicates: true });
    }
    return this.list(resolvedId);
  }

  async update(planId: string, featureCode: string, dto: any) {
    const plan = await this.resolvePlan(planId);
    const resolvedId = plan.id;
    const feature = await this.prisma.feature.findFirst({
      where: { OR: [{ id: featureCode }, { code: featureCode }] },
    });
    if (!feature) throw new NotFoundException('Feature not found');
    const existing = await this.prisma.planFeature.findUnique({
      where: { planId_featureId: { planId: resolvedId, featureId: feature.id } },
    });
    if (!existing) throw new NotFoundException('Plan feature not found');
    return this.prisma.planFeature.update({
      where: { planId_featureId: { planId: resolvedId, featureId: feature.id } },
      data: { isEnabled: dto.isEnabled, limit: dto.limit, config: dto.config },
      include: { feature: true },
    });
  }

  async remove(planId: string, featureCode: string) {
    const plan = await this.resolvePlan(planId);
    const resolvedId = plan.id;
    const feature = await this.prisma.feature.findFirst({
      where: { OR: [{ id: featureCode }, { code: featureCode }] },
    });
    if (!feature) throw new NotFoundException('Feature not found');
    await this.prisma.planFeature.deleteMany({
      where: { planId: resolvedId, featureId: feature.id },
    });
    return { deleted: true };
  }

  private async resolvePlan(planIdOrCode: string) {
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { OR: [{ id: planIdOrCode }, { code: planIdOrCode }] },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }
}