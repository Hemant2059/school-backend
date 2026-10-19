import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class PlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    try {
      return await this.prisma.subscriptionPlan.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Plan code already exists');
      }
      throw e;
    }
  }

  async findAll(q: any) {
    const where: Prisma.SubscriptionPlanWhereInput = {};
    if (q.isActive !== undefined) where.isActive = q.isActive;
    const [data, total] = await Promise.all([
      this.prisma.subscriptionPlan.findMany({
        where,
        include: { features: { include: { feature: true } } },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.subscriptionPlan.count({ where }),
    ]);
    return { data, meta: { total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) || 1 } };
  }

  async findOne(idOrCode: string) {
    const plan = await this.prisma.subscriptionPlan.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
      include: { features: { include: { feature: true } } },
    });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async update(idOrCode: string, dto: any) {
    const plan = await this.findOne(idOrCode);
    try {
      return await this.prisma.subscriptionPlan.update({ where: { id: plan.id }, data: dto, include: { features: { include: { feature: true } } } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Plan code already exists');
      }
      throw e;
    }
  }

  async remove(idOrCode: string) {
    const plan = await this.findOne(idOrCode);
    await this.prisma.subscriptionPlan.delete({ where: { id: plan.id } });
    return { deleted: true };
  }
}