import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

/**
 * The parent portal.
 *
 * Every query in this service is scoped to the children of one guardian.
 * A parent can never see another parent's child, or every child in the
 * school.
 */
@Injectable()
export class ParentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The guardian's children — the students linked to the caller's guardian
   * record via StudentGuardian.
   */
  async myChildren(tenantId: string, guardianId: string) {
    const links = await this.prisma.studentGuardian.findMany({
      where: { guardianId },
      include: {
        student: {
          select: {
            id: true,
            admissionNo: true,
            iemisStudentId: true,
            symbolNo: true,
            firstNameEn: true,
            firstNameNe: true,
            middleNameEn: true,
            middleNameNe: true,
            lastNameEn: true,
            lastNameNe: true,
            dobAd: true,
            dobBs: true,
            gender: true,
            photoUrl: true,
          },
        },
      },
    });
    return links.map((l) => l.student);
  }

  /** The parent's relationship to one child, or 404. */
  async myChild(tenantId: string, guardianId: string, studentId: string) {
    const link = await this.prisma.studentGuardian.findFirst({
      where: { guardianId, student: { id: studentId, deletedAt: null, tenantId } },
      include: {
        student: {
          select: {
            id: true,
            admissionNo: true,
            iemisStudentId: true,
            symbolNo: true,
            firstNameEn: true,
            firstNameNe: true,
            middleNameEn: true,
            middleNameNe: true,
            lastNameEn: true,
            lastNameNe: true,
            dobAd: true,
            dobBs: true,
            gender: true,
            motherTongue: true,
            photoUrl: true,
            studentEnrollments: {
              where: { deletedAt: null },
              select: {
                id: true,
                rollNo: true,
                enrollmentStatus: true,
                academicYear: { select: { id: true, name: true } },
                gradeLevel: { select: { id: true, nameEn: true, nameNe: true } },
                section: { select: { id: true, nameEn: true, nameNe: true } },
              },
              take: 1,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
    return link?.student ?? null;
  }

  /**
   * The parent's child's fee invoices across every enrolment (historical
   * and current). Never another child's data.
   */
  async myChildFeeInvoices(tenantId: string, guardianId: string, studentId: string) {
    const student = await this.myChild(tenantId, guardianId, studentId);
    if (!student) return null;

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { tenantId, studentId, deletedAt: null },
      select: { id: true },
    });
    const enrollmentIds = enrollments.map((e) => e.id);
    if (enrollmentIds.length === 0) return [];

    const invoices = await this.prisma.feeInvoice.findMany({
      where: { tenantId, enrollmentId: { in: enrollmentIds }, deletedAt: null },
      select: {
        id: true,
        invoiceNumber: true,
        issueDateAd: true,
        issueDateBs: true,
        dueDateBs: true,
        netPayableAmount: true,
        paidAmount: true,
        balanceDue: true,
        status: true,
        enrollment: {
          select: {
            academicYear: { select: { name: true } },
            gradeLevel: { select: { nameEn: true, nameNe: true } },
            section: { select: { nameEn: true, nameNe: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return invoices;
  }

  /**
   * The parent's child's published exam results, newest first. Draft
   * results are never leaked to parents.
   */
  async myChildExamResults(tenantId: string, guardianId: string, studentId: string) {
    const student = await this.myChild(tenantId, guardianId, studentId);
    if (!student) return null;

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { tenantId, studentId, deletedAt: null },
      select: { id: true },
    });
    const enrollmentIds = enrollments.map((e) => e.id);
    if (enrollmentIds.length === 0) return [];

    return this.prisma.studentExamSummary.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollmentIds },
        exam: { isPublished: true, deletedAt: null },
      },
      select: {
        id: true,
        totalMarksObtained: true,
        percentage: true,
        gpa: true,
        finalGrade: true,
        rankInSection: true,
        rankInGrade: true,
        totalAttendanceDays: true,
        presentDays: true,
        classTeacherRemarks: true,
        exam: {
          select: {
            name: true,
            examType: true,
            academicYear: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** The current (latest) enrolment of the parent's child, or null. */
  async myChildCurrentEnrollment(tenantId: string, guardianId: string, studentId: string) {
    const student = await this.myChild(tenantId, guardianId, studentId);
    if (!student) return null;
    return this.prisma.studentEnrollment.findFirst({
      where: { tenantId, studentId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });
  }

  /** Attendance summary for the parent's child. */
  async attendanceSummary(tenantId: string, guardianId: string, studentId: string) {
    await this.myChild(tenantId, guardianId, studentId);
    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { studentId, deletedAt: null },
      select: { id: true },
    });
    const rows = await this.prisma.studentDailyAttendance.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollments.map((e) => e.id) },
        deletedAt: null,
      },
      select: { status: true, dateAd: true, dateBs: true },
      orderBy: { dateAd: 'desc' },
      take: 30,
    });
    const present = rows.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
    return {
      totalDays: rows.length,
      presentDays: present,
      attendancePercentage:
        rows.length === 0 ? null : Math.round((present / rows.length) * 10000) / 100,
      recent: rows.slice(0, 10),
    };
  }
}
