import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { FeeEngineService } from './fee-engine.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import type { CreateFeePaymentDto, UpdateFeePaymentDto } from '../dto/fee-payment.dto.js';

@Injectable()
export class FeePaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: FeeEngineService,
  ) {}

  /**
   * Records a receipt and applies it to the invoice atomically.
   */
  async create(tenantId: string, dto: CreateFeePaymentDto) {
    return this.engine.recordPayment(tenantId, dto);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.fiscalYearId) where.fiscalYearId = query.fiscalYearId;
    if (query.status) where.status = query.status;
    if (query.receiptNumber) where.receiptNumber = { contains: query.receiptNumber };

    const [data, total] = await Promise.all([
      this.prisma.feePayment.findMany({
        where,
        include: { invoice: true, enrollment: true, fiscalYear: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.feePayment.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.feePayment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { invoice: true, enrollment: true, fiscalYear: true },
    });
    if (!payment) throw new NotFoundException('Fee payment not found');
    return payment;
  }

  /**
   * Updates the collection details of a receipt. The amount is immutable —
   * a mistake is fixed by reversing the receipt.
   */
  async update(tenantId: string, id: string, dto: UpdateFeePaymentDto) {
    await this.findOne(tenantId, id);
    return this.prisma.feePayment.update({
      where: { id },
      data: {
        paymentMethod: dto.paymentMethod,
        gatewayTransactionId: dto.gatewayTransactionId,
        gatewayResponsePayload: dto.gatewayResponsePayload as Prisma.InputJsonValue | undefined,
      },
      include: { invoice: true, enrollment: true, fiscalYear: true },
    });
  }

  /** Reverses a receipt and restores the invoice balance. */
  async reverse(tenantId: string, id: string, reason: string) {
    await this.findOne(tenantId, id);
    return this.engine.reversePayment(tenantId, id, reason);
  }

  /**
   * "Deleting" a receipt reverses it.
   *
   * A receipt is a financial document: erasing it would remove money from
   * the receivables report while it remained in the bank. Reversing it keeps
   * the row, adds the amount back to the invoice balance and records why.
   */
  async softDelete(tenantId: string, id: string) {
    const payment = await this.findOne(tenantId, id);
    if (payment.status === 'REVERSED') {
      throw new NotFoundException('Fee payment is already reversed');
    }
    return this.engine.reversePayment(tenantId, id, 'Deleted');
  }

  async restore(tenantId: string, id: string) {
    const payment = await this.prisma.feePayment.findUnique({ where: { id } });
    if (!payment || payment.tenantId !== tenantId) throw new NotFoundException('Fee payment not found');
    if (!payment.deletedAt) throw new NotFoundException('Fee payment is not deleted');
    return this.prisma.feePayment.update({
      where: { id },
      data: { deletedAt: null, status: 'SUCCESS' },
    });
  }
}
