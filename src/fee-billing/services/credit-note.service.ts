import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { FeeEngineService } from './fee-engine.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class CreditNoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: FeeEngineService,
  ) {}

  /**
   * Issues a credit note against an invoice and reduces the invoice balance.
   */
  async create(tenantId: string, dto: any) {
    return this.engine.applyCreditNote(tenantId, dto);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId };
    if (query.invoiceId) where.invoiceId = query.invoiceId;

    const [data, total] = await Promise.all([
      this.prisma.creditNote.findMany({
        where,
        include: { invoice: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.creditNote.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const cn = await this.prisma.creditNote.findFirst({
      where: { id, tenantId },
      include: { invoice: true },
    });
    if (!cn) throw new NotFoundException('Credit note not found');
    return cn;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.creditNote.update({
      where: { id },
      data: dto,
      include: { invoice: true },
    });
  }

  /**
   * Credit notes are financial documents and are never hard-deleted. They are
   * cancelled by issuing an offsetting credit note.
   */
  async remove(tenantId: string, id: string) {
    const note = await this.findOne(tenantId, id);
    throw new NotFoundException(
      `Credit note ${note.creditNoteNumber} cannot be deleted; issue an offsetting credit note instead`,
    );
  }
}
