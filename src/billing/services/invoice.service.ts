import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.subscriptionId) {
      const sub = await this.prisma.subscription.findFirst({ where: { id: dto.subscriptionId, tenantId } });
      if (!sub) throw new NotFoundException('Subscription not found');
    }
    try {
      return await this.prisma.invoice.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Invoice number already exists');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId };
    if (q.status) where.status = q.status;
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: { subscription: true, payments: true },
        orderBy: { issueDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const inv = await this.prisma.invoice.findFirst({ where: { id, tenantId }, include: { subscription: true, payments: true } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.invoice.update({ where: { id }, data: dto, include: { subscription: true, payments: true } });
  }
}