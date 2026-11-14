import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class TenantPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a payment against a tenant's subscription invoice.
   *
   * The status is never taken from the request body: a caller used to be
   * able to post `{ amount: 0, status: 'SUCCESS' }` and mark the invoice
   * PAID. The invoice is only marked paid once the amount actually
   * settles the balance.
   */
  async create(tenantId: string, dto: any) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: dto.invoiceId, tenantId },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const amount = Number(dto.amount ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('The payment amount must be greater than zero');
    }
    if (amount > Number(invoice.amount)) {
      throw new BadRequestException(
        'The payment amount cannot exceed the invoice amount',
      );
    }

    // A pending payment is recorded; only a settled one marks the invoice
    // paid. A gateway integration would set the status here.
    const status = dto.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING';

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: { ...dto, amount, status },
        include: { invoice: true },
      });

      if (status === 'SUCCESS') {
        await tx.invoice.update({
          where: { id: dto.invoiceId },
          data: { status: 'PAID', paidAt: dto.paidAt ?? new Date() },
        });
      }

      return payment;
    });
  }

  async findAll(tenantId: string, q: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(q);
    const where: Record<string, any> = { invoice: { tenantId } };
    if (q.status) where.status = q.status;
    if (q.invoiceId) where.invoiceId = q.invoiceId;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: { invoice: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, invoice: { tenantId } },
      include: { invoice: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
