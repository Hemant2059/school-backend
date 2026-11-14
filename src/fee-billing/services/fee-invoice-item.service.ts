import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { FeeEngineService } from './fee-engine.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import { money } from '../../common/utils/money.js';

@Injectable()
export class FeeInvoiceItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: FeeEngineService,
  ) {}

  /**
   * Adds a line item and recalculates the invoice totals.
   *
   * Previously the invoice's subtotal, payable and balance were never
   * recomputed, so they could contradict the line items.
   */
  async create(tenantId: string, dto: any) {
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: dto.invoiceId, tenantId, deletedAt: null },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    const feeHead = await this.prisma.feeHead.findFirst({
      where: { id: dto.feeHeadId, tenantId, deletedAt: null },
    });
    if (!feeHead) throw new NotFoundException('Fee head not found');

    const gross = money(dto.grossAmount);
    const discount = money(dto.discountAmount ?? 0);
    if (discount.greaterThan(gross)) {
      throw new NotFoundException('Discount cannot exceed the gross amount');
    }

    await this.prisma.feeInvoiceItem.create({
      data: {
        tenantId,
        invoiceId: dto.invoiceId,
        feeHeadId: dto.feeHeadId,
        bsMonth: dto.bsMonth,
        description: dto.description,
        grossAmount: gross,
        discountAmount: discount,
        netAmount: money(gross.minus(discount)),
      },
    });

    return this.engine.recalculateInvoice(tenantId, dto.invoiceId);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId };
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.feeHeadId) where.feeHeadId = query.feeHeadId;

    const [data, total] = await Promise.all([
      this.prisma.feeInvoiceItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.feeInvoiceItem.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.feeInvoiceItem.findFirst({ where: { id, tenantId } });
    if (!item) throw new NotFoundException('Fee invoice item not found');
    return item;
  }

  async update(tenantId: string, id: string, dto: any) {
    const item = await this.findOne(tenantId, id);
    const gross = dto.grossAmount !== undefined ? money(dto.grossAmount) : money(item.grossAmount);
    const discount =
      dto.discountAmount !== undefined ? money(dto.discountAmount) : money(item.discountAmount);
    if (discount.greaterThan(gross)) {
      throw new NotFoundException('Discount cannot exceed the gross amount');
    }

    await this.prisma.feeInvoiceItem.update({
      where: { id },
      data: {
        bsMonth: dto.bsMonth,
        description: dto.description,
        grossAmount: gross,
        discountAmount: discount,
        netAmount: money(gross.minus(discount)),
      },
    });

    return this.engine.recalculateInvoice(tenantId, item.invoiceId);
  }

  async remove(tenantId: string, id: string) {
    const item = await this.findOne(tenantId, id);
    await this.prisma.feeInvoiceItem.delete({ where: { id } });
    return this.engine.recalculateInvoice(tenantId, item.invoiceId);
  }
}
