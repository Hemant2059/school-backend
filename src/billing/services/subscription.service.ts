import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any, assignedByPlatformUserId?: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    return this.prisma.subscription.create({ data: { ...dto, tenantId, assignedByPlatformUserId } });
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId };
    if (q.status) where.status = q.status;
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        include: { plan: true, assignedByPlatformUser: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.subscription.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const sub = await this.prisma.subscription.findFirst({ where: { id, tenantId }, include: { plan: true, assignedByPlatformUser: true, invoices: true } });
    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.subscription.update({ where: { id }, data: dto, include: { plan: true, assignedByPlatformUser: true } });
  }

  async cancel(tenantId: string, id: string) {
    const sub = await this.findOne(tenantId, id);
    if (sub.status === 'CANCELLED') throw new ConflictException('Already cancelled');
    return this.prisma.subscription.update({ where: { id }, data: { status: 'CANCELLED', cancelledAt: new Date(), autoRenew: false }, include: { plan: true, assignedByPlatformUser: true } });
  }
}