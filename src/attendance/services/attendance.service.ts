import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import type {
  BulkAttendanceDto,
  MarkAttendanceDto,
  QueryAttendanceDto,
  UpdateAttendanceDto,
} from '../dto/attendance.dto.js';

/**
 * Daily student attendance.
 *
 * The model, the permissions and the aggregation used by the exam result
 * engine all existed, but nothing could write the rows — so the attendance
 * figures in a student's report card were always empty.
 */
@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records the attendance of one student for one day.
   *
   * The section is derived from the enrolment rather than taken from the
   * request, and a student can only have one record per day.
   */
  async mark(tenantId: string, dto: MarkAttendanceDto, markedByUserId?: string) {
    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const existing = await this.prisma.studentDailyAttendance.findFirst({
      where: {
        tenantId,
        enrollmentId: dto.enrollmentId,
        dateAd: dto.dateAd,
      },
    });
    if (existing) {
      throw new ConflictException(
        'The attendance for this student on this date has already been recorded',
      );
    }

    return this.prisma.studentDailyAttendance.create({
      data: {
        tenantId,
        enrollmentId: dto.enrollmentId,
        sectionId: enrollment.sectionId,
        dateAd: dto.dateAd,
        dateBs: dto.dateBs,
        status: dto.status,
        checkInTime: dto.checkInTime,
        checkOutTime: dto.checkOutTime,
        source: dto.source,
        markedByUserId: markedByUserId ?? null,
      },
      include: { enrollment: { include: { student: true } } },
    });
  }

  /**
   * Marks a whole section at once.
   *
   * Students with no entry are recorded as absent rather than silently
   * omitted, so a day's register is always complete.
   */
  async markBulk(tenantId: string, dto: BulkAttendanceDto, markedByUserId?: string) {
    const section = await this.prisma.section.findFirst({
      where: { id: dto.sectionId, tenantId, deletedAt: null },
    });
    if (!section) throw new NotFoundException('Section not found');

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: { tenantId, sectionId: dto.sectionId, deletedAt: null },
      select: { id: true },
    });
    if (enrollments.length === 0) {
      throw new BadRequestException('This section has no enrolled students');
    }

    const sectionStudentIds = new Set(enrollments.map((e) => e.id));
    for (const entry of dto.entries) {
      if (!sectionStudentIds.has(entry.enrollmentId)) {
        throw new BadRequestException(
          'One of the entries is for a student who is not enrolled in this section',
        );
      }
    }

    const alreadyMarked = await this.prisma.studentDailyAttendance.findMany({
      where: {
        tenantId,
        sectionId: dto.sectionId,
        dateAd: dto.dateAd,
      },
      select: { enrollmentId: true },
    });
    if (alreadyMarked.length > 0) {
      throw new ConflictException(
        'The attendance for this section on this date has already been recorded',
      );
    }

    const byEnrollment = new Map(dto.entries.map((e) => [e.enrollmentId, e]));

    const rows = enrollments.map((enrollment) => {
      const entry = byEnrollment.get(enrollment.id);
      return {
        tenantId,
        enrollmentId: enrollment.id,
        sectionId: dto.sectionId,
        dateAd: dto.dateAd,
        dateBs: dto.dateBs,
        status: entry?.status ?? AttendanceStatus.ABSENT,
        checkInTime: entry?.checkInTime ?? null,
        checkOutTime: entry?.checkOutTime ?? null,
        source: dto.source ?? 'bulk',
        markedByUserId: markedByUserId ?? null,
      };
    });

    await this.prisma.studentDailyAttendance.createMany({ data: rows });

    return {
      sectionId: dto.sectionId,
      dateAd: dto.dateAd,
      recorded: rows.length,
      present: rows.filter((r) => r.status === AttendanceStatus.PRESENT).length,
      absent: rows.filter((r) => r.status === AttendanceStatus.ABSENT).length,
      late: rows.filter((r) => r.status === AttendanceStatus.LATE).length,
      onLeave: rows.filter((r) => r.status === AttendanceStatus.ON_LEAVE).length,
    };
  }

  async findAll(tenantId: string, query: QueryAttendanceDto) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;
    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.dateAd = {
        ...(query.from ? { gte: query.from } : {}),
        ...(query.to ? { lte: query.to } : {}),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.studentDailyAttendance.findMany({
        where,
        include: { enrollment: { include: { student: true } } },
        orderBy: [{ dateAd: 'desc' }, { enrollmentId: 'asc' }],
        skip,
        take,
      }),
      this.prisma.studentDailyAttendance.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const record = await this.prisma.studentDailyAttendance.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { enrollment: { include: { student: true } } },
    });
    if (!record) throw new NotFoundException('Attendance record not found');
    return record;
  }

  async update(tenantId: string, id: string, dto: UpdateAttendanceDto) {
    await this.findOne(tenantId, id);
    return this.prisma.studentDailyAttendance.update({
      where: { id },
      data: dto,
      include: { enrollment: { include: { student: true } } },
    });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentDailyAttendance.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const record = await this.prisma.studentDailyAttendance.findUnique({ where: { id } });
    if (!record || record.tenantId !== tenantId) {
      throw new NotFoundException('Attendance record not found');
    }
    if (!record.deletedAt) throw new NotFoundException('Attendance record is not deleted');
    return this.prisma.studentDailyAttendance.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  /**
   * The attendance summary of one student over a period. This is what the
   * report card and the exam result engine use.
   */
  async summary(tenantId: string, enrollmentId: string, from?: Date, to?: Date) {
    const records = await this.prisma.studentDailyAttendance.findMany({
      where: {
        tenantId,
        enrollmentId,
        deletedAt: null,
        ...(from || to
          ? {
              dateAd: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      select: { status: true },
    });

    const total = records.length;
    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const late = records.filter((r) => r.status === AttendanceStatus.LATE).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const onLeave = records.filter((r) => r.status === AttendanceStatus.ON_LEAVE).length;

    return {
      totalAttendanceDays: total,
      presentDays: present + late,
      absentDays: absent,
      onLeaveDays: onLeave,
      attendancePercentage:
        total === 0 ? null : Math.round(((present + late) / total) * 10000) / 100,
    };
  }
}
