import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FeeFrequency, FeeInvoiceStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { DocumentSequenceService } from '../../common/services/document-sequence.service.js';
import { applyDiscount, money, sum, toDecimal } from '../../common/utils/money.js';
import type { GenerateFeeInvoiceDto } from '../dto/fee-invoice.dto.js';
import type { CreateFeePaymentDto } from '../dto/fee-payment.dto.js';

type ClassFeeStructureWithHead = Prisma.ClassFeeStructureGetPayload<{
  include: { feeHead: true };
}>;

type StudentScholarshipWithHead = Prisma.StudentScholarshipGetPayload<{
  include: { feeHead: true };
}>;

interface ComputedLine {
  feeHeadId: string;
  bsMonth: number | null;
  description: string;
  grossAmount: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  netAmount: Prisma.Decimal;
}

/**
 * The fee engine.
 *
 * Before this existed every monetary value on an invoice was supplied by the
 * client and never re-derived: `netPayableAmount` was not checked against
 * `subtotalAmount - discountAmount`, `balanceDue` was not checked against
 * `netPayableAmount - paidAmount`, recording a payment did not touch the
 * invoice at all, and credit notes had no effect on anything. The ledger was
 * therefore whatever the front-end said it was.
 *
 * This service owns every derived value. Clients state intent; the server
 * decides the arithmetic.
 */
@Injectable()
export class FeeEngineService {
  private readonly logger = new Logger(FeeEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sequences: DocumentSequenceService,
  ) {}

  // ---------------------------------------------------------------------
  // Invoice generation
  // ---------------------------------------------------------------------

  /**
   * Builds an invoice from the tenant's class fee structure.
   *
   * Fee heads with `MONTHLY_BS` frequency are expanded into one line per
   * applicable Bikram Sambat month. Scholarships are applied per fee head
   * (percentage or flat amount). Outstanding dues from earlier invoices are
   * brought forward.
   */
  async generateInvoice(tenantId: string, dto: GenerateFeeInvoiceDto) {
    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
      include: { student: true, gradeLevel: true, academicYear: true },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
    });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');

    const academicYear = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId, deletedAt: null },
    });
    if (!academicYear) throw new NotFoundException('Academic year not found');

    // The enrolment must belong to the academic year being billed.
    if (enrollment.academicYearId !== dto.academicYearId) {
      throw new BadRequestException(
        'The enrollment does not belong to the given academic year',
      );
    }

    const structures = await this.prisma.classFeeStructure.findMany({
      where: {
        tenantId,
        academicYearId: dto.academicYearId,
        gradeLevelId: enrollment.gradeLevelId,
        deletedAt: null,
        OR: [{ fiscalYearId: null }, { fiscalYearId: dto.fiscalYearId }],
      },
      include: { feeHead: true },
      orderBy: { feeHeadId: 'asc' },
    });

    if (structures.length === 0) {
      throw new BadRequestException(
        'No fee structure is configured for this class and academic year',
      );
    }

    const scholarships = await this.prisma.studentScholarship.findMany({
      where: { tenantId, enrollmentId: dto.enrollmentId },
      include: { feeHead: true },
    });
    const scholarshipByFeeHead = new Map(
      scholarships.map((s) => [s.feeHeadId, s] as const),
    );

    const lines = this.expandLines(structures, scholarshipByFeeHead);
    if (lines.length === 0) {
      throw new BadRequestException('The fee structure produced no billable lines');
    }

    const subtotal = money(sum(lines.map((l) => l.grossAmount)));
    const discount = money(sum(lines.map((l) => l.discountAmount)));
    const previousDues = await this.outstandingBalance(tenantId, dto.enrollmentId);
    const netPayable = money(subtotal.minus(discount).plus(previousDues));

    const invoiceNumber = await this.sequences.next(
      tenantId,
      dto.fiscalYearId,
      'FEE_INVOICE',
      dto.invoicePrefix ? { prefix: dto.invoicePrefix } : {},
    );

    const invoice = await this.prisma.$transaction(async (tx) => {
      const created = await tx.feeInvoice.create({
        data: {
          tenantId,
          fiscalYearId: dto.fiscalYearId,
          academicYearId: dto.academicYearId,
          enrollmentId: dto.enrollmentId,
          invoiceNumber,
          issueDateAd: dto.issueDateAd,
          issueDateBs: dto.issueDateBs,
          dueDateBs: dto.dueDateBs,
          billedUpToBsMonth: dto.billedUpToBsMonth,
          subtotalAmount: subtotal,
          discountAmount: discount,
          previousDuesBroughtForward: previousDues,
          netPayableAmount: netPayable,
          paidAmount: new Prisma.Decimal(0),
          balanceDue: netPayable,
          status: netPayable.isZero() ? FeeInvoiceStatus.PAID : FeeInvoiceStatus.UNPAID,
          notes: dto.notes,
          items: {
            create: lines.map((l) => ({
              tenantId,
              feeHeadId: l.feeHeadId,
              bsMonth: l.bsMonth,
              description: l.description,
              grossAmount: l.grossAmount,
              discountAmount: l.discountAmount,
              netAmount: l.netAmount,
            })),
          },
        },
        include: { items: true },
      });
      return created;
    });

    return this.findOne(tenantId, invoice.id);
  }

  /**
   * Expands fee structures into billable lines.
   *
   * A `MONTHLY_BS` fee head becomes one line per applicable month; every
   * other frequency produces a single line.
   */
  private expandLines(
    structures: ClassFeeStructureWithHead[],
    scholarshipByFeeHead: Map<string, StudentScholarshipWithHead>,
  ): ComputedLine[] {
    const lines: ComputedLine[] = [];

    for (const structure of structures) {
      const feeHead = structure.feeHead;
      const scholarship = scholarshipByFeeHead.get(structure.feeHeadId);
      const gross = money(structure.amount);

      if (feeHead.frequency === FeeFrequency.MONTHLY_BS) {
        const months = (structure.applicableBsMonths ?? []).filter(
          (m) => Number.isInteger(m) && m >= 1 && m <= 12,
        );
        if (months.length === 0) continue;

        for (const bsMonth of months.sort((a, b) => a - b)) {
          const discount = this.discountFor(scholarship, gross);
          lines.push({
            feeHeadId: structure.feeHeadId,
            bsMonth,
            description: `${feeHead.nameEn} — ${feeHead.nameNe} (BS ${bsMonth})`,
            grossAmount: gross,
            discountAmount: discount,
            netAmount: money(gross.minus(discount)),
          });
        }
      } else {
        const discount = this.discountFor(scholarship, gross);
        lines.push({
          feeHeadId: structure.feeHeadId,
          bsMonth: null,
          description: `${feeHead.nameEn} — ${feeHead.nameNe}`,
          grossAmount: gross,
          discountAmount: discount,
          netAmount: money(gross.minus(discount)),
        });
      }
    }

    return lines;
  }

  private discountFor(
    scholarship: StudentScholarshipWithHead | undefined,
    gross: Prisma.Decimal,
  ): Prisma.Decimal {
    if (!scholarship) return new Prisma.Decimal(0);
    const net = applyDiscount(gross, scholarship.discountType, scholarship.discountValue);
    return money(gross.minus(net));
  }

  /** Outstanding balance across every earlier invoice of the enrolment. */
  private async outstandingBalance(tenantId: string, enrollmentId: string): Promise<Prisma.Decimal> {
    const invoices = await this.prisma.feeInvoice.findMany({
      where: {
        tenantId,
        enrollmentId,
        deletedAt: null,
        status: { in: [FeeInvoiceStatus.UNPAID, FeeInvoiceStatus.PARTIALLY_PAID] },
      },
      select: { balanceDue: true },
    });
    return money(sum(invoices.map((i) => i.balanceDue)));
  }

  // ---------------------------------------------------------------------
  // Payments
  // ---------------------------------------------------------------------

  /**
   * Records a receipt and applies it to the invoice in the same transaction.
   *
   * Previously creating a `FeePayment` did not touch the invoice at all: the
   * invoice's `paidAmount`/`balanceDue`/`status` had no writer other than
   * the client, so money received was invisible in the ledger.
   */
  async recordPayment(tenantId: string, dto: CreateFeePaymentDto) {
    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
    });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (dto.gatewayTransactionId) {
      const duplicate = await this.prisma.feePayment.findFirst({
        where: { tenantId, gatewayTransactionId: dto.gatewayTransactionId, deletedAt: null },
        select: { id: true, receiptNumber: true },
      });
      if (duplicate) {
        throw new ConflictException(
          `This gateway transaction was already recorded as receipt ${duplicate.receiptNumber}`,
        );
      }
    }

    let invoice: { id: string; netPayableAmount: Prisma.Decimal; balanceDue: Prisma.Decimal; paidAmount: Prisma.Decimal } | null = null;
    if (dto.invoiceId) {
      invoice = await this.prisma.feeInvoice.findFirst({
        where: { id: dto.invoiceId, tenantId, deletedAt: null },
      });
      if (!invoice) throw new NotFoundException('Fee invoice not found');

      const amount = toDecimal(dto.amountPaid);
      if (amount.greaterThan(invoice.balanceDue)) {
        throw new BadRequestException(
          `Payment of ${amount.toFixed(2)} exceeds the outstanding balance of ${invoice.balanceDue.toFixed(2)}`,
        );
      }
    }

    const receiptNumber =
      dto.receiptNumber ??
      (await this.sequences.next(tenantId, dto.fiscalYearId, 'FEE_RECEIPT'));

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.feePayment.create({
        data: {
          tenantId,
          fiscalYearId: dto.fiscalYearId,
          enrollmentId: dto.enrollmentId,
          invoiceId: dto.invoiceId ?? null,
          receiptNumber,
          paymentDateAd: dto.paymentDateAd,
          paymentDateBs: dto.paymentDateBs,
          amountPaid: money(dto.amountPaid),
          paymentMethod: dto.paymentMethod,
          gatewayTransactionId: dto.gatewayTransactionId,
          gatewayResponsePayload: dto.gatewayResponsePayload as Prisma.InputJsonValue | undefined,
        },
        include: { invoice: true, enrollment: true, fiscalYear: true },
      });

      if (invoice) {
        await this.applyToInvoice(tx, invoice.id, money(dto.amountPaid));
      }

      return payment;
    });
  }

  /**
   * Reverses a receipt: the invoice balance goes back up and the receipt is
   * retained with `REVERSED` status for audit.
   */
  async reversePayment(tenantId: string, paymentId: string, reason: string) {
    const payment = await this.prisma.feePayment.findFirst({
      where: { id: paymentId, tenantId, deletedAt: null },
    });
    if (!payment) throw new NotFoundException('Fee payment not found');
    if (payment.status === 'REVERSED') {
      throw new ConflictException('This receipt has already been reversed');
    }

    return this.prisma.$transaction(async (tx) => {
      const reversed = await tx.feePayment.update({
        where: { id: payment.id },
        data: { status: 'REVERSED', gatewayResponsePayload: { reversalReason: reason } },
      });
      if (payment.invoiceId) {
        await this.applyToInvoice(tx, payment.invoiceId, money(payment.amountPaid).negated());
      }
      return reversed;
    });
  }

  // ---------------------------------------------------------------------
  // Credit notes
  // ---------------------------------------------------------------------

  /**
   * Issues a credit note and reduces the invoice balance.
   *
   * Credit notes used to be inert records: they did not change the invoice,
   * did not change its status, could exceed the invoice value, and could be
   * hard-deleted.
   */
  async applyCreditNote(
    tenantId: string,
    dto: { invoiceId: string; creditNoteNumber: string; reason: string; amount: number; approvedByUserId?: string },
  ) {
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: dto.invoiceId, tenantId, deletedAt: null },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');

    const amount = money(dto.amount);
    if (amount.lte(0)) throw new BadRequestException('Credit note amount must be positive');
    if (amount.greaterThan(invoice.balanceDue)) {
      throw new BadRequestException(
        `Credit note of ${amount.toFixed(2)} exceeds the outstanding balance of ${invoice.balanceDue.toFixed(2)}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const creditNote = await tx.creditNote.create({
        data: {
          tenantId,
          invoiceId: dto.invoiceId,
          creditNoteNumber: dto.creditNoteNumber,
          reason: dto.reason,
          amount,
          approvedByUserId: dto.approvedByUserId ?? null,
        },
        include: { invoice: true },
      });

      const newBalance = money(invoice.balanceDue.minus(amount));
      const fullyCredited = newBalance.isZero();
      await tx.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          balanceDue: newBalance,
          status: fullyCredited
            ? FeeInvoiceStatus.VOIDED_BY_CREDIT_NOTE
            : invoice.status,
        },
      });

      return creditNote;
    });
  }

  // ---------------------------------------------------------------------
  // Recalculation
  // ---------------------------------------------------------------------

  /**
   * Re-derives an invoice's totals from its line items.
   *
   * Called whenever an item is added, changed or removed: the previous
   * implementation let the totals drift away from the items.
   */
  async recalculateInvoice(tenantId: string, invoiceId: string) {
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: invoiceId, tenantId },
      include: { items: true },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');

    const subtotal = money(sum(invoice.items.map((i) => i.grossAmount)));
    const discount = money(sum(invoice.items.map((i) => i.discountAmount)));
    const netPayable = money(subtotal.minus(discount).plus(invoice.previousDuesBroughtForward));
    const balanceDue = money(netPayable.minus(invoice.paidAmount));

    return this.prisma.feeInvoice.update({
      where: { id: invoice.id },
      data: {
        subtotalAmount: subtotal,
        discountAmount: discount,
        netPayableAmount: netPayable,
        balanceDue: balanceDue.isNegative() ? new Prisma.Decimal(0) : balanceDue,
        status:
          invoice.status === FeeInvoiceStatus.VOIDED_BY_CREDIT_NOTE
            ? invoice.status
            : this.statusFor(invoice.paidAmount, netPayable),
      },
      include: { items: true, payments: true, creditNotes: true },
    });
  }

  /**
   * Applies a signed amount to an invoice's balance and status.
   * `amount` is positive for a receipt and negative for a reversal.
   */
  private async applyToInvoice(
    tx: Prisma.TransactionClient,
    invoiceId: string,
    amount: Prisma.Decimal,
  ): Promise<void> {
    const invoice = await tx.feeInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return;

    const paid = money(invoice.paidAmount.plus(amount));
    const balance = money(invoice.netPayableAmount.minus(paid));
    const nonNegativeBalance = balance.isNegative() ? new Prisma.Decimal(0) : balance;

    await tx.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: paid,
        balanceDue: nonNegativeBalance,
        status: this.statusFor(paid, invoice.netPayableAmount, invoice.status),
      },
    });
  }

  private statusFor(
    paid: Prisma.Decimal,
    netPayable: Prisma.Decimal,
    current?: FeeInvoiceStatus,
  ): FeeInvoiceStatus {
    if (current === FeeInvoiceStatus.VOIDED_BY_CREDIT_NOTE) return current;
    if (paid.isZero()) return FeeInvoiceStatus.UNPAID;
    if (paid.greaterThanOrEqualTo(netPayable)) return FeeInvoiceStatus.PAID;
    return FeeInvoiceStatus.PARTIALLY_PAID;
  }

  private async findOne(tenantId: string, id: string) {
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { items: true, payments: true, creditNotes: true },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    return invoice;
  }
}
