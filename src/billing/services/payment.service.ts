import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id: dto.invoiceId, tenantId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    const payment = await this.prisma.payment.create({ data: dto });
    if (dto.status === 'SUCCESS') {
      await this.prisma.invoice.update({ where: { id: dto.invoiceId }, data: { status: 'PAID', paidAt: dto.paidAt ?? new Date() } });
    }
    return payment;
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { invoice: { tenantId } };
    if (q.status) where.status = q.status;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: { invoice: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { invoice: true } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}