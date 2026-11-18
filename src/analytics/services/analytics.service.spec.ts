import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService } from './analytics.service.js';

function makePrisma(overrides: any = {}) {
  return {
    student: { count: vi.fn(async () => 42) },
    studentEnrollment: { count: vi.fn(async () => 42) },
    studentDailyAttendance: {
      groupBy: vi.fn(async () => [
        { status: 'PRESENT', _count: { _all: 80 } },
        { status: 'LATE', _count: { _all: 4 } },
        { status: 'ABSENT', _count: { _all: 10 } },
      ]),
    },
    studentExamSummary: {
      aggregate: vi.fn(async () => ({ _avg: { gpa: 3.25 } })),
    },
    feeInvoice: {
      aggregate: vi.fn(async () => ({
        _count: { _all: 100 },
        _sum: {
          netPayableAmount: { toString: () => '500000' },
          paidAmount: { toString: () => '375000' },
          balanceDue: { toString: () => '125000' },
        },
      })),
      count: vi.fn(async () => 30),
    },
    ...overrides,
  } as any;
}

describe('AnalyticsService', () => {
  let prisma: any;
  let service: AnalyticsService;

  beforeEach(() => {
    prisma = makePrisma();
    // Decimal-like values: the service calls Number() on them, so plain
    // numbers work too when given directly.
    prisma.feeInvoice.aggregate.mockResolvedValue({
      _count: { _all: 100 },
      _sum: {
        netPayableAmount: '500000',
        paidAmount: '375000',
        balanceDue: '125000',
      },
    });
    service = new AnalyticsService(prisma);
  });

  describe('studentsOverview', () => {
    it('computes the attendance percentage from PRESENT + LATE marks', async () => {
      const result = await service.studentsOverview('t1');
      expect(result.totalStudents).toBe(42);
      expect(result.attendanceLast30Days.totalMarked).toBe(94);
      expect(result.attendanceLast30Days.present).toBe(84);
      expect(result.attendanceLast30Days.percentage).toBeCloseTo(89.36, 2);
      expect(result.averageGpa).toBe(3.25);
    });

    it('returns null attendance percentage when nothing is marked yet', async () => {
      prisma.studentDailyAttendance.groupBy.mockResolvedValue([]);
      const result = await service.studentsOverview('t1');
      expect(result.attendanceLast30Days.percentage).toBeNull();
    });

    it('returns null GPA when there are no exam summaries', async () => {
      prisma.studentExamSummary.aggregate.mockResolvedValue({
        _avg: { gpa: null },
      });
      const result = await service.studentsOverview('t1');
      expect(result.averageGpa).toBeNull();
    });
  });

  describe('financeOverview', () => {
    it('computes the collection rate from the aggregate sums', async () => {
      const result = await service.financeOverview('t1');
      expect(result.totalInvoices).toBe(100);
      expect(result.netPayable).toBe(500000);
      expect(result.collected).toBe(375000);
      expect(result.balanceDue).toBe(125000);
      expect(result.collectionRate).toBe(75);
    });

    it('returns null collection rate when there is nothing invoiced', async () => {
      prisma.feeInvoice.aggregate.mockResolvedValue({
        _count: { _all: 0 },
        _sum: { netPayableAmount: null, paidAmount: null, balanceDue: null },
      });
      const result = await service.financeOverview('t1');
      expect(result.collectionRate).toBeNull();
      expect(result.netPayable).toBe(0);
    });
  });
});
