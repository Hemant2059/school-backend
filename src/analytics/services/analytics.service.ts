import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

const PRESENTISH: Array<'PRESENT' | 'LATE' | 'ON_LEAVE'> = [
  'PRESENT',
  'LATE',
  'ON_LEAVE',
];

/**
 * Aggregate numbers for school dashboards. Everything here is a sum or a
 * count — no per-student or per-family rows are exposed.
 */
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Attendance/student KPIs for the last 30 days. */
  async studentsOverview(tenantId: string) {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [
      totalStudents,
      totalEnrollments,
      newAdmissions,
      attendanceRows,
      gpaAgg,
    ] = await Promise.all([
      this.prisma.student.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.studentEnrollment.count({
        where: { tenantId, deletedAt: null },
      }),
      this.prisma.student.count({
        where: { tenantId, deletedAt: null, createdAt: { gte: since } },
      }),
      this.prisma.studentDailyAttendance.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null, dateAd: { gte: since } },
        _count: { _all: true },
      }),
      this.prisma.studentExamSummary.aggregate({
        where: { tenantId },
        _avg: { gpa: true },
      }),
    ]);

    const byStatus = new Map<string, number>();
    let totalMarked = 0;
    for (const row of attendanceRows) {
      byStatus.set(row.status, row._count._all);
      totalMarked += row._count._all;
    }
    const presentish = PRESENTISH.reduce(
      (sum, s) => sum + (byStatus.get(s) ?? 0),
      0,
    );
    const attendancePercentage =
      totalMarked === 0
        ? null
        : Math.round((presentish / totalMarked) * 10000) / 100;

    return {
      totalStudents,
      totalEnrollments,
      newAdmissionsLast30Days: newAdmissions,
      attendanceLast30Days: {
        totalMarked,
        present: presentish,
        byStatus: Object.fromEntries(byStatus),
        percentage: attendancePercentage,
      },
      averageGpa: gpaAgg._avg.gpa ? Number(gpaAgg._avg.gpa) : null,
    };
  }

  /** Fee collection KPIs over every non-deleted invoice. */
  async financeOverview(tenantId: string) {
    const [invoiceAgg, unpaidCount] = await Promise.all([
      this.prisma.feeInvoice.aggregate({
        where: { tenantId, deletedAt: null },
        _count: { _all: true },
        _sum: { netPayableAmount: true, paidAmount: true, balanceDue: true },
      }),
      this.prisma.feeInvoice.count({
        where: {
          tenantId,
          deletedAt: null,
          status: { in: ['UNPAID', 'PARTIALLY_PAID'] },
        },
      }),
    ]);

    const netPayable = Number(invoiceAgg._sum.netPayableAmount ?? 0);
    const collected = Number(invoiceAgg._sum.paidAmount ?? 0);
    const balanceDue = Number(invoiceAgg._sum.balanceDue ?? 0);
    const collectionRate =
      netPayable === 0
        ? null
        : Math.round((collected / netPayable) * 10000) / 100;

    return {
      totalInvoices: invoiceAgg._count._all,
      unpaidOrPartial: unpaidCount,
      netPayable,
      collected,
      balanceDue,
      collectionRate,
    };
  }
}
