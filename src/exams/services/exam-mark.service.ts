import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { ExamResultService } from './exam-result.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import { toDecimal } from '../../common/utils/money.js';

@Injectable()
export class ExamMarkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly results: ExamResultService,
  ) {}

  /**
   * Records a mark.
   *
   * Previously the only checks were that the schedule and the enrolment
   * existed. Marks could be negative, could exceed the full marks, could be
   * recorded for a student in a different class or year, and could be
   * recorded against a locked or unpublished exam. The letter grade and
   * grade point were accepted from the client, so `finalSubjectGp: 4.0` for
   * 12% was a valid request.
   */
  async create(tenantId: string, dto: any) {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: dto.examScheduleId, tenantId, deletedAt: null },
      include: { exam: true, gradeSubject: true },
    });
    if (!schedule) throw new NotFoundException('Exam schedule not found');

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: dto.enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (schedule.exam.isLocked) {
      throw new ConflictException('This exam is locked; marks cannot be recorded');
    }
    if (!schedule.exam.isPublished) {
      throw new ConflictException('This exam is not published; marks cannot be recorded');
    }
    if (enrollment.gradeLevelId !== schedule.gradeSubject.gradeLevelId) {
      throw new BadRequestException(
        'The student is not enrolled in the class this schedule belongs to',
      );
    }
    if (enrollment.academicYearId !== schedule.exam.academicYearId) {
      throw new BadRequestException(
        'The student is not enrolled in the academic year this exam belongs to',
      );
    }

    this.assertMarksWithinBounds(schedule, dto);

    const existing = await this.prisma.examMark.findUnique({
      where: {
        examScheduleId_enrollmentId: {
          examScheduleId: dto.examScheduleId,
          enrollmentId: dto.enrollmentId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('Marks already entered for this student/schedule');
    }

    const mark = await this.prisma.examMark.create({
      data: {
        tenantId,
        examScheduleId: dto.examScheduleId,
        enrollmentId: dto.enrollmentId,
        theoryMarksObtained: dto.theoryMarksObtained ?? null,
        isTheoryAbsent: dto.isTheoryAbsent ?? false,
        internalMarksObtained: dto.internalMarksObtained ?? null,
        isInternalAbsent: dto.isInternalAbsent ?? false,
        internalBreakdown: dto.internalBreakdown as Prisma.InputJsonValue | undefined,
        enteredByUserId: dto.enteredByUserId ?? null,
      },
    });

    return this.withComputedGrades(mark.id);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Prisma.ExamMarkWhereInput = { tenantId };
    if (query.examScheduleId) where.examScheduleId = query.examScheduleId;
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;

    const [data, total] = await Promise.all([
      this.prisma.examMark.findMany({
        where,
        include: { examSchedule: true, enrollment: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.examMark.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const mark = await this.prisma.examMark.findFirst({ where: { id, tenantId } });
    if (!mark) throw new NotFoundException('Exam mark not found');
    return mark;
  }

  async update(tenantId: string, id: string, dto: any) {
    const mark = await this.findOne(tenantId, id);
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: mark.examScheduleId, tenantId, deletedAt: null },
      include: { exam: true, gradeSubject: true },
    });
    if (!schedule) throw new NotFoundException('Exam schedule not found');
    if (schedule.exam.isLocked) {
      throw new ConflictException('This exam is locked; marks cannot be changed');
    }

    const merged = {
      theoryMarksObtained: dto.theoryMarksObtained ?? mark.theoryMarksObtained,
      isTheoryAbsent: dto.isTheoryAbsent ?? mark.isTheoryAbsent,
      internalMarksObtained: dto.internalMarksObtained ?? mark.internalMarksObtained,
      isInternalAbsent: dto.isInternalAbsent ?? mark.isInternalAbsent,
    };
    this.assertMarksWithinBounds(schedule, merged);

    await this.prisma.examMark.update({
      where: { id },
      data: {
        theoryMarksObtained: dto.theoryMarksObtained,
        isTheoryAbsent: dto.isTheoryAbsent,
        internalMarksObtained: dto.internalMarksObtained,
        isInternalAbsent: dto.isInternalAbsent,
        internalBreakdown: dto.internalBreakdown as Prisma.InputJsonValue | undefined,
      },
    });

    return this.withComputedGrades(id);
  }

  /**
   * A mark is removed rather than soft-deleted so the audit trail of an
   * entered mark is unambiguous; the `AuditLog` records who did it.
   */
  async remove(tenantId: string, id: string) {
    const mark = await this.findOne(tenantId, id);
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: mark.examScheduleId, tenantId, deletedAt: null },
      include: { exam: true },
    });
    if (schedule?.exam.isLocked) {
      throw new ConflictException('This exam is locked; marks cannot be removed');
    }
    await this.prisma.examMark.delete({ where: { id } });
    return { deleted: true };
  }

  /**
   * Validates that the marks are within the bounds of the schedule and that
   * "absent" and "scored" are not both true.
   */
  private assertMarksWithinBounds(
    schedule: { theoryFullMarks: Prisma.Decimal | null; internalFullMarks: Prisma.Decimal | null; gradeSubject: { theoryFullMarks: Prisma.Decimal | null; internalFullMarks: Prisma.Decimal | null } },
    marks: {
      theoryMarksObtained?: number | Prisma.Decimal | null;
      isTheoryAbsent?: boolean;
      internalMarksObtained?: number | Prisma.Decimal | null;
      isInternalAbsent?: boolean;
    },
  ): void {
    const theoryFull = toDecimal(
      schedule.theoryFullMarks ?? schedule.gradeSubject.theoryFullMarks ?? 0,
    );
    const internalFull = toDecimal(
      schedule.internalFullMarks ?? schedule.gradeSubject.internalFullMarks ?? 0,
    );

    if (marks.theoryMarksObtained !== undefined && marks.theoryMarksObtained !== null) {
      const value = toDecimal(marks.theoryMarksObtained);
      if (value.isNegative()) {
        throw new BadRequestException('Theory marks cannot be negative');
      }
      if (!theoryFull.isZero() && value.greaterThan(theoryFull)) {
        throw new BadRequestException(
          `Theory marks (${value.toFixed(2)}) cannot exceed the full marks (${theoryFull.toFixed(2)})`,
        );
      }
    }
    if (marks.internalMarksObtained !== undefined && marks.internalMarksObtained !== null) {
      const value = toDecimal(marks.internalMarksObtained);
      if (value.isNegative()) {
        throw new BadRequestException('Internal marks cannot be negative');
      }
      if (!internalFull.isZero() && value.greaterThan(internalFull)) {
        throw new BadRequestException(
          `Internal marks (${value.toFixed(2)}) cannot exceed the full marks (${internalFull.toFixed(2)})`,
        );
      }
    }
    if (marks.isTheoryAbsent && marks.theoryMarksObtained !== undefined && marks.theoryMarksObtained !== null) {
      throw new BadRequestException(
        'A student cannot be both absent and hold theory marks',
      );
    }
    if (marks.isInternalAbsent && marks.internalMarksObtained !== undefined && marks.internalMarksObtained !== null) {
      throw new BadRequestException(
        'A student cannot be both absent and hold internal marks',
      );
    }
  }

  /** Derives the letter grades and grade points from the grading scale. */
  private async withComputedGrades(id: string) {
    const mark = await this.prisma.examMark.findUnique({ where: { id } });
    if (!mark) throw new NotFoundException('Exam mark not found');

    const computed = await this.results.applyGradingScale(
      mark.tenantId,
      mark.examScheduleId,
      mark.enrollmentId,
    );

    return this.prisma.examMark.update({
      where: { id },
      data: {
        theoryGrade: computed.letterGrade,
        theoryGp: computed.gradePoint,
        internalGrade: computed.letterGrade,
        internalGp: computed.gradePoint,
        finalSubjectGrade: computed.letterGrade,
        finalSubjectGp: computed.gradePoint,
      },
      include: { examSchedule: true, enrollment: true },
    });
  }
}
