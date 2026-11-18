import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

/**
 * The student portal. Every query is scoped to the calling student's own
 * records — there is no way to read another student's data.
 */
@Injectable()
export class StudentPortalService {
  constructor(private readonly prisma: PrismaService) {}

  /** The student's own profile. */
  async myProfile(tenantId: string, studentId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, tenantId, deletedAt: null },
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
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            rollNo: true,
            enrollmentStatus: true,
            academicYear: { select: { name: true, bsYear: true } },
            gradeLevel: { select: { nameEn: true, nameNe: true } },
            section: { select: { nameEn: true, nameNe: true } },
          },
        },
      },
    });
    return student;
  }

  /** Own exam summaries for published exams. */
  async myExams(tenantId: string, studentId: string) {
    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { tenantId, studentId, deletedAt: null },
      select: { id: true },
    });
    return this.prisma.studentExamSummary.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollments.map((e) => e.id) },
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

  /** Own attendance summary for the last 30 days. */
  async myAttendance(tenantId: string, studentId: string) {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { tenantId, studentId, deletedAt: null },
      select: { id: true },
    });

    const rows = await this.prisma.studentDailyAttendance.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollments.map((e) => e.id) },
        deletedAt: null,
        dateAd: { gte: since },
      },
      select: { status: true, dateAd: true },
      orderBy: { dateAd: 'desc' },
    });

    const present = rows.filter(
      (r) => r.status === 'PRESENT' || r.status === 'LATE',
    ).length;
    return {
      totalDays: rows.length,
      presentDays: present,
      percentage:
        rows.length === 0
          ? null
          : Math.round((present / rows.length) * 10000) / 100,
      recent: rows.slice(0, 10),
    };
  }
}
