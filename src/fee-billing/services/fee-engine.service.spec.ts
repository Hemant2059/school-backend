import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeeEngineService } from './fee-engine.service.js';

function makePrisma() {
  const tx = {
    feeInvoice: { create: vi.fn(), update: vi.fn(), findUnique: vi.fn() },
    feeInvoiceItem: { create: vi.fn(), delete: vi.fn() },
    feePayment: { create: vi.fn(), update: vi.fn() },
    creditNote: {
      create: vi.fn(),
      aggregate: vi.fn(async () => ({ _sum: { amount: null } })),
    },
    libraryBook: { update: vi.fn() },
  };
  return {
    $transaction: vi.fn((fn: any) => (typeof fn === 'function' ? fn(tx) : fn)),
    studentEnrollment: { findFirst: vi.fn() },
    fiscalYear: { findFirst: vi.fn() },
    academicYear: { findFirst: vi.fn() },
    classFeeStructure: { findMany: vi.fn() },
    studentScholarship: { findMany: vi.fn() },
    feeInvoice: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    feePayment: { findFirst: vi.fn(), findUnique: vi.fn() },
    creditNote: { findFirst: vi.fn(), create: vi.fn() },
    documentSequence: { upsert: vi.fn() },
    __tx: tx,
  } as any;
}

describe('FeeEngineService', () => {
  let prisma: any;
  let engine: FeeEngineService;

  beforeEach(() => {
    prisma = makePrisma();
    engine = new FeeEngineService(prisma, {
      next: vi.fn().mockResolvedValue('INV-00001'),
    } as any);
  });

  describe('generateInvoice', () => {
    beforeEach(() => {
      prisma.studentEnrollment.findFirst.mockResolvedValue({
        id: 'e1',
        gradeLevelId: 'g1',
        academicYearId: 'a1',
        student: { id: 's1' },
      });
      prisma.fiscalYear.findFirst.mockResolvedValue({ id: 'f1' });
      prisma.academicYear.findFirst.mockResolvedValue({ id: 'a1' });
      prisma.feeInvoice.findMany.mockResolvedValue([]);
      prisma.classFeeStructure.findMany.mockResolvedValue([
        {
          id: 'cs1',
          feeHeadId: 'fh1',
          amount: new Prisma.Decimal('1000.00'),
          applicableBsMonths: [],
          feeHead: {
            id: 'fh1',
            nameEn: 'Tuition',
            nameNe: 'शिक्षण',
            frequency: 'ANNUAL',
          },
        },
      ]);
      prisma.studentScholarship.findMany.mockResolvedValue([]);
    });

    it('rejects an enrolment from a different academic year', async () => {
      prisma.studentEnrollment.findFirst.mockResolvedValue({
        id: 'e1',
        gradeLevelId: 'g1',
        academicYearId: 'other',
      });
      await expect(
        engine.generateInvoice('t1', {
          fiscalYearId: 'f1',
          academicYearId: 'a1',
          enrollmentId: 'e1',
          issueDateAd: new Date(),
          issueDateBs: '2081-01-01',
          dueDateBs: '2081-02-01',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects when no fee structure is configured', async () => {
      prisma.classFeeStructure.findMany.mockResolvedValue([]);
      await expect(
        engine.generateInvoice('t1', {
          fiscalYearId: 'f1',
          academicYearId: 'a1',
          enrollmentId: 'e1',
          issueDateAd: new Date(),
          issueDateBs: '2081-01-01',
          dueDateBs: '2081-02-01',
        }),
      ).rejects.toThrow(/No fee structure/);
    });
  });

  describe('recordPayment', () => {
    it('rejects a payment larger than the outstanding balance', async () => {
      prisma.fiscalYear.findFirst.mockResolvedValue({ id: 'f1' });
      prisma.studentEnrollment.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.feeInvoice.findFirst.mockResolvedValue({
        id: 'inv1',
        balanceDue: new Prisma.Decimal('500.00'),
      });

      await expect(
        engine.recordPayment('t1', {
          fiscalYearId: 'f1',
          enrollmentId: 'e1',
          invoiceId: 'inv1',
          paymentDateAd: new Date(),
          paymentDateBs: '2081-01-01',
          amountPaid: 1000,
          paymentMethod: 'CASH',
        }),
      ).rejects.toThrow(/exceeds the outstanding balance/);
    });

    it('a payment after a credit note settles the balance including the credit', async () => {
      prisma.fiscalYear.findFirst.mockResolvedValue({ id: 'f1' });
      prisma.studentEnrollment.findFirst.mockResolvedValue({ id: 'e1' });
      // Validation reads balanceDue (8000 = 10000 net − 2000 credit note).
      prisma.feeInvoice.findFirst.mockResolvedValue({
        id: 'inv1',
        balanceDue: new Prisma.Decimal('8000.00'),
      });
      prisma.__tx.feeInvoice.findUnique.mockResolvedValue({
        id: 'inv1',
        paidAmount: new Prisma.Decimal('0'),
        netPayableAmount: new Prisma.Decimal('10000.00'),
        balanceDue: new Prisma.Decimal('8000.00'),
        status: 'PARTIALLY_PAID',
      });
      prisma.__tx.creditNote.aggregate.mockResolvedValue({
        _sum: { amount: new Prisma.Decimal('2000.00') },
      });
      prisma.__tx.feePayment.create.mockResolvedValue({ id: 'p1' });

      await engine.recordPayment('t1', {
        fiscalYearId: 'f1',
        enrollmentId: 'e1',
        invoiceId: 'inv1',
        paymentDateAd: new Date(),
        paymentDateBs: '2081-01-01',
        amountPaid: 8000,
        paymentMethod: 'CASH',
      });

      expect(prisma.__tx.feeInvoice.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            balanceDue: new Prisma.Decimal('0'),
            status: 'PAID',
          }),
        }),
      );
    });

    it('rejects a replayed gateway transaction', async () => {
      prisma.fiscalYear.findFirst.mockResolvedValue({ id: 'f1' });
      prisma.studentEnrollment.findFirst.mockResolvedValue({ id: 'e1' });
      prisma.feePayment.findFirst.mockResolvedValue({
        id: 'p1',
        receiptNumber: 'RCP-00001',
      });

      await expect(
        engine.recordPayment('t1', {
          fiscalYearId: 'f1',
          enrollmentId: 'e1',
          paymentDateAd: new Date(),
          paymentDateBs: '2081-01-01',
          amountPaid: 100,
          paymentMethod: 'ESEWA',
          gatewayTransactionId: 'TX-1',
        }),
      ).rejects.toThrow(/already recorded/);
    });
  });

  describe('applyCreditNote', () => {
    it('rejects a credit note larger than the balance', async () => {
      prisma.feeInvoice.findFirst.mockResolvedValue({
        id: 'inv1',
        balanceDue: new Prisma.Decimal('100.00'),
      });
      await expect(
        engine.applyCreditNote('t1', {
          invoiceId: 'inv1',
          creditNoteNumber: 'CN-1',
          reason: 'correction',
          amount: 500,
        }),
      ).rejects.toThrow(/exceeds the outstanding balance/);
    });

    it('rejects a non-positive credit note', async () => {
      prisma.feeInvoice.findFirst.mockResolvedValue({
        id: 'inv1',
        balanceDue: new Prisma.Decimal('100.00'),
      });
      await expect(
        engine.applyCreditNote('t1', {
          invoiceId: 'inv1',
          creditNoteNumber: 'CN-1',
          reason: 'correction',
          amount: 0,
        }),
      ).rejects.toThrow(/must be positive/);
    });
  });
});
