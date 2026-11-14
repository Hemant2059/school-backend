import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { FeeInvoiceStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { FeeEngineService } from './fee-engine.service.js';
import { money, toDecimal } from '../../common/utils/money.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import type { CreateFeeInvoiceDto, GenerateFeeInvoiceDto } from '../dto/fee-invoice.dto.js';

@Injectable()
export class FeeInvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: FeeEngineService,
  ) {}

  /**
   * Raises an invoice from the tenant's class fee structure. Every line and
   * every total is computed by the server.
   */
  async generate(tenantId: string, dto: GenerateFeeInvoiceDto) {
    return this.engine.generateInvoice(tenantId, dto);
  }

  /**
   * Raises a manually composed invoice.
   *
   * The client states the subtotal and discount; the payable amount and the
   * balance are derived here so the invoice can never contradict itself.
   */
  async create(tenantId: string, dto: CreateFeeInvoiceDto) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
    });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');

    const academicYear = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId, deletedAt: null },
    });
    if (!academicYear) throw new NotFoundException('Academic year not found');

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const subtotal = money(dto.subtotalAmount);
    const discount = money(dto.discountAmount ?? 0);
    if (discount.greaterThan(subtotal)) {
      throw new ConflictException('Discount cannot exceed the subtotal');
    }
    const previousDues = money(dto.previousDuesBroughtForward ?? 0);
    const paid = money(dto.paidAmount ?? 0);
    const netPayable = money(subtotal.minus(discount).plus(previousDues));
    if (paid.greaterThan(netPayable)) {
      throw new ConflictException('Amount already paid cannot exceed the payable amount');
    }
    const balanceDue = money(netPayable.minus(paid));

    try {
      const invoice = await this.prisma.feeInvoice.create({
        data: {
          tenantId,
          fiscalYearId: dto.fiscalYearId,
          academicYearId: dto.academicYearId,
          enrollmentId: dto.enrollmentId,
          invoiceNumber: dto.invoiceNumber,
          issueDateAd: dto.issueDateAd,
          issueDateBs: dto.issueDateBs,
          dueDateBs: dto.dueDateBs,
          billedUpToBsMonth: dto.billedUpToBsMonth,
          subtotalAmount: subtotal,
          discountAmount: discount,
          previousDuesBroughtForward: previousDues,
          netPayableAmount: netPayable,
          paidAmount: paid,
          balanceDue,
          status:
            paid.isZero()
              ? FeeInvoiceStatus.UNPAID
              : paid.greaterThanOrEqualTo(netPayable)
                ? FeeInvoiceStatus.PAID
                : FeeInvoiceStatus.PARTIALLY_PAID,
          notes: dto.notes,
        },
      });
      return invoice;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Invoice number already exists for this fiscal year');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Prisma.FeeInvoiceWhereInput = { tenantId, deletedAt: null };
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.fiscalYearId) where.fiscalYearId = query.fiscalYearId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
        { enrollment: { student: { admissionNo: { contains: query.search, mode: 'insensitive' } } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.feeInvoice.findMany({
        where,
        include: { items: true, payments: true, creditNotes: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.feeInvoice.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const inv = await this.prisma.feeInvoice.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { items: true, payments: true, creditNotes: true },
    });
    if (!inv) throw new NotFoundException('Fee invoice not found');
    return inv;
  }

  /**
   * Updates the operational flags of an invoice. The money fields are not
   * editable — they are derived from the line items and the receipts.
   */
  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.feeInvoice.update({
      where: { id },
      data: {
        printCount: dto.printCount,
        isSyncedToIrd: dto.isSyncedToIrd,
        notes: dto.notes,
      },
      include: { items: true, payments: true, creditNotes: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.feeInvoice.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const inv = await this.prisma.feeInvoice.findUnique({ where: { id } });
    if (!inv || inv.tenantId !== tenantId) throw new NotFoundException('Fee invoice not found');
    if (!inv.deletedAt) throw new ConflictException('Fee invoice is not deleted');
    return this.prisma.feeInvoice.update({ where: { id }, data: { deletedAt: null } });
  }

  /** Recomputes the invoice totals from its line items. */
  async recalculate(tenantId: string, id: string) {
    return this.engine.recalculateInvoice(tenantId, id);
  }

  /** The outstanding balance across every unpaid invoice of an enrolment. */
  async outstanding(tenantId: string, enrollmentId: string) {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: {
        tenantId,
        enrollmentId,
        deletedAt: null,
        status: { in: [FeeInvoiceStatus.UNPAID, FeeInvoiceStatus.PARTIALLY_PAID] },
      },
      select: { balanceDue: true },
    });
    const total = invoices.reduce(
      (acc, i) => acc.plus(toDecimal(i.balanceDue)),
      toDecimal(0),
    );
    return { outstandingAmount: money(total), invoiceCount: invoices.length };
  }
}
