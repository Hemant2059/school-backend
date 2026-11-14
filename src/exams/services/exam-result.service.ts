import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { money, toDecimal } from '../../common/utils/money.js';

export interface SubjectResult {
  gradeSubjectId: string;
  subjectId: string;
  subjectName: string;
  theoryMarks: Prisma.Decimal;
  theoryFullMarks: Prisma.Decimal;
  internalMarks: Prisma.Decimal;
  internalFullMarks: Prisma.Decimal;
  totalMarks: Prisma.Decimal;
  fullMarks: Prisma.Decimal;
  percentage: Prisma.Decimal;
  letterGrade: string | null;
  gradePoint: Prisma.Decimal | null;
  creditHours: number;
  absent: boolean;
}

export interface GradingBand {
  minPercentage: Prisma.Decimal;
  maxPercentage: Prisma.Decimal;
  letterGrade: string;
  gradePoint: Prisma.Decimal;
}

export interface ComputedSummary {
  totalMarksObtained: Prisma.Decimal;
  percentage: Prisma.Decimal;
  gpa: Prisma.Decimal | null;
  finalGrade: string | null;
  presentDays: number | null;
  totalAttendanceDays: number | null;
  subjects: SubjectResult[];
}

/**
 * The exam result engine.
 *
 * `StudentExamSummary` used to be a pure CRUD passthrough: `percentage`,
 * `gpa`, `totalMarksObtained`, `finalGrade`, `rankInSection`, `rankInGrade`
 * and the attendance counters were all client-supplied fields written
 * straight to the database. A caller could post `percentage: 999, gpa: 4,
 * rankInSection: 1` for every student.
 *
 * Everything is now derived from the recorded marks and the tenant's grading
 * scale.
 */
@Injectable()
export class ExamResultService {
  private readonly logger = new Logger(ExamResultService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Computes the result of one enrolment in one exam.
   */
  async computeForEnrollment(tenantId: string, examId: string, enrollmentId: string): Promise<ComputedSummary> {
    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId, deletedAt: null },
      include: { gradingScale: { include: { items: true } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const enrollment = await this.prisma.studentEnrollment.findFirst({
      where: { id: enrollmentId, tenantId, deletedAt: null },
    });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    const schedules = await this.prisma.examSchedule.findMany({
      where: { tenantId, examId, deletedAt: null },
      include: {
        gradeSubject: { include: { subject: true } },
        marks: { where: { enrollmentId }, take: 1 },
      },
    });

    if (schedules.length === 0) {
      throw new BadRequestException('This exam has no published schedules');
    }

    const bands = (exam.gradingScale?.items ?? []).map<GradingBand>((item) => ({
      minPercentage: toDecimal(item.minPercentage),
      maxPercentage: toDecimal(item.maxPercentage),
      letterGrade: item.letterGrade,
      gradePoint: toDecimal(item.gradePoint),
    }));

    const subjects: SubjectResult[] = schedules.map((schedule) => {
      const mark = schedule.marks[0];
      const gradeSubject = schedule.gradeSubject;

      const theoryFull = toDecimal(
        schedule.theoryFullMarks ?? gradeSubject.theoryFullMarks ?? 0,
      );
      const internalFull = toDecimal(
        schedule.internalFullMarks ?? gradeSubject.internalFullMarks ?? 0,
      );
      const fullMarks = money(theoryFull.plus(internalFull));

      const theoryAbsent = mark?.isTheoryAbsent ?? false;
      const internalAbsent = mark?.isInternalAbsent ?? false;
      const theoryMarks = theoryAbsent
        ? new Prisma.Decimal(0)
        : toDecimal(mark?.theoryMarksObtained ?? 0);
      const internalMarks = internalAbsent
        ? new Prisma.Decimal(0)
        : toDecimal(mark?.internalMarksObtained ?? 0);

      const total = money(theoryMarks.plus(internalMarks));
      const percentage =
        fullMarks.isZero()
          ? new Prisma.Decimal(0)
          : money(total.div(fullMarks).mul(100));

      const band = this.findBand(bands, percentage);

      return {
        gradeSubjectId: gradeSubject.id,
        subjectId: gradeSubject.subjectId,
        subjectName: gradeSubject.subject.nameEn,
        theoryMarks: money(theoryMarks),
        theoryFullMarks: money(theoryFull),
        internalMarks: money(internalMarks),
        internalFullMarks: money(internalFull),
        totalMarks: total,
        fullMarks,
        percentage,
        letterGrade: band?.letterGrade ?? null,
        gradePoint: band?.gradePoint ?? null,
        creditHours: gradeSubject.creditHours ?? 0,
        absent: mark === undefined || (theoryAbsent && internalAbsent),
      };
    });

    const totalMarks = money(subjects.reduce((acc, s) => acc.plus(s.totalMarks), new Prisma.Decimal(0)));
    const totalFullMarks = money(subjects.reduce((acc, s) => acc.plus(s.fullMarks), new Prisma.Decimal(0)));
    const percentage =
      totalFullMarks.isZero()
        ? new Prisma.Decimal(0)
        : money(totalMarks.div(totalFullMarks).mul(100));

    // The GPA is credit-hour weighted, as in Nepal's NEB grading.
    const creditTotal = subjects.reduce((acc, s) => acc + s.creditHours, 0);
    const gradedSubjects = subjects.filter((s) => s.gradePoint !== null && s.creditHours > 0);
    let gpa: Prisma.Decimal | null = null;
    if (gradedSubjects.length > 0 && creditTotal > 0) {
      const weighted = gradedSubjects.reduce(
        (acc, s) => acc.plus(toDecimal(s.gradePoint).mul(s.creditHours)),
        new Prisma.Decimal(0),
      );
      gpa = money(weighted.div(creditTotal));
    }

    const finalBand = this.findBand(bands, percentage);

    const attendance = await this.prisma.studentDailyAttendance.findMany({
      where: { tenantId, enrollmentId, deletedAt: null },
      select: { status: true },
    });

    return {
      totalMarksObtained: totalMarks,
      percentage,
      gpa,
      finalGrade: finalBand?.letterGrade ?? null,
      presentDays: attendance.length
        ? attendance.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length
        : null,
      totalAttendanceDays: attendance.length || null,
      subjects,
    };
  }

  /**
   * Computes and stores the summary for one enrolment.
   */
  async persistSummary(tenantId: string, examId: string, enrollmentId: string) {
    const computed = await this.computeForEnrollment(tenantId, examId, enrollmentId);

    const data = {
      tenantId,
      examId,
      enrollmentId,
      totalMarksObtained: computed.totalMarksObtained,
      percentage: computed.percentage,
      gpa: computed.gpa,
      finalGrade: computed.finalGrade,
      presentDays: computed.presentDays,
      totalAttendanceDays: computed.totalAttendanceDays,
    };

    const summary = await this.prisma.studentExamSummary.upsert({
      where: { examId_enrollmentId: { examId, enrollmentId } },
      create: data,
      update: {
        totalMarksObtained: computed.totalMarksObtained,
        percentage: computed.percentage,
        gpa: computed.gpa,
        finalGrade: computed.finalGrade,
        presentDays: computed.presentDays,
        totalAttendanceDays: computed.totalAttendanceDays,
      },
    });

    return { ...summary, subjects: computed.subjects };
  }

  /**
   * Computes the results for every enrolment that could sit the exam and
   * assigns the section and grade ranks.
   */
  async generateForExam(tenantId: string, examId: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId, deletedAt: null },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.isLocked) {
      throw new ConflictException('This exam is locked; unlock it before regenerating results');
    }

    const schedules = await this.prisma.examSchedule.findMany({
      where: { tenantId, examId, deletedAt: null },
      select: { gradeSubject: { select: { gradeLevelId: true } } },
    });
    const gradeLevelIds = [...new Set(schedules.map((s) => s.gradeSubject.gradeLevelId))];
    if (gradeLevelIds.length === 0) {
      throw new BadRequestException('This exam has no published schedules');
    }

    const enrollments = await this.prisma.studentEnrollment.findMany({
      where: {
        tenantId,
        academicYearId: exam.academicYearId,
        gradeLevelId: { in: gradeLevelIds },
        deletedAt: null,
      },
      select: { id: true, sectionId: true, gradeLevelId: true },
    });

    const computed: Array<{
      enrollmentId: string;
      sectionId: string;
      gradeLevelId: string;
      percentage: Prisma.Decimal;
      totalMarks: Prisma.Decimal;
    }> = [];

    for (const enrollment of enrollments) {
      const summary = await this.computeForEnrollment(tenantId, examId, enrollment.id);
      computed.push({
        enrollmentId: enrollment.id,
        sectionId: enrollment.sectionId,
        gradeLevelId: enrollment.gradeLevelId,
        percentage: summary.percentage,
        totalMarks: summary.totalMarksObtained,
      });
    }

    // Ranks: within the section and within the grade level.
    const sectionRanks = rankWithin(computed, (c) => c.sectionId);
    const gradeRanks = rankWithin(computed, (c) => c.gradeLevelId);

    const results = [];
    for (const enrollment of enrollments) {
      const persisted = await this.persistSummary(tenantId, examId, enrollment.id);
      const updated = await this.prisma.studentExamSummary.update({
        where: { examId_enrollmentId: { examId, enrollmentId: enrollment.id } },
        data: {
          rankInSection: sectionRanks.get(enrollment.id) ?? null,
          rankInGrade: gradeRanks.get(enrollment.id) ?? null,
        },
      });
      results.push({ ...updated, subjects: persisted.subjects });
    }

    this.logger.log(`Generated ${results.length} results for exam ${examId}`);
    return { examId, generated: results.length, results };
  }

  /**
   * Recomputes the letter grade and grade point of a mark from the grading
   * scale, so they can never be forged by the client.
   */
  async applyGradingScale(
    tenantId: string,
    examScheduleId: string,
    enrollmentId: string,
  ): Promise<{ letterGrade: string | null; gradePoint: Prisma.Decimal | null }> {
    const schedule = await this.prisma.examSchedule.findFirst({
      where: { id: examScheduleId, tenantId, deletedAt: null },
      include: { exam: { include: { gradingScale: { include: { items: true } } } } },
    });
    if (!schedule) throw new NotFoundException('Exam schedule not found');

    const bands = (schedule.exam.gradingScale?.items ?? []).map<GradingBand>((item) => ({
      minPercentage: toDecimal(item.minPercentage),
      maxPercentage: toDecimal(item.maxPercentage),
      letterGrade: item.letterGrade,
      gradePoint: toDecimal(item.gradePoint),
    }));

    const mark = await this.prisma.examMark.findUnique({
      where: { examScheduleId_enrollmentId: { examScheduleId, enrollmentId } },
    });
    if (!mark) throw new NotFoundException('Exam mark not found');

    const theoryFull = toDecimal(schedule.theoryFullMarks ?? 0);
    const internalFull = toDecimal(schedule.internalFullMarks ?? 0);
    const full = money(theoryFull.plus(internalFull));
    const total = money(toDecimal(mark.theoryMarksObtained ?? 0).plus(toDecimal(mark.internalMarksObtained ?? 0)));
    const percentage = full.isZero() ? new Prisma.Decimal(0) : money(total.div(full).mul(100));

    const band = this.findBand(bands, percentage);
    return { letterGrade: band?.letterGrade ?? null, gradePoint: band?.gradePoint ?? null };
  }

  private findBand(bands: GradingBand[], percentage: Prisma.Decimal): GradingBand | null {
    for (const band of bands) {
      if (percentage.greaterThanOrEqualTo(band.minPercentage) && percentage.lessThanOrEqualTo(band.maxPercentage)) {
        return band;
      }
    }
    // Fall back to the nearest band below the score so a result is still
    // graded when the scale has gaps.
    const below = bands
      .filter((b) => percentage.greaterThanOrEqualTo(b.minPercentage))
      .sort((a, b) => b.minPercentage.comparedTo(a.minPercentage))[0];
    return below ?? null;
  }
}

/**
 * Assigns a dense rank to each entry, grouping by `key`.
 * Ties share the same rank; the next distinct value continues from it.
 */
function rankWithin<T>(
  entries: T[],
  key: (entry: T) => string,
): Map<string, number> {
  const groups = new Map<string, T[]>();
  for (const entry of entries) {
    const groupKey = key(entry);
    const list = groups.get(groupKey) ?? [];
    list.push(entry);
    groups.set(groupKey, list);
  }

  const ranks = new Map<string, number>();
  for (const list of groups.values()) {
    const sorted = [...list].sort((a, b) =>
      (b as any).percentage.comparedTo((a as any).percentage),
    );
    let rank = 0;
    let previous: Prisma.Decimal | null = null;
    sorted.forEach((entry, index) => {
      const percentage = (entry as any).percentage as Prisma.Decimal;
      if (previous === null || !percentage.equals(previous)) {
        rank = index + 1;
        previous = percentage;
      }
      ranks.set((entry as any).enrollmentId, rank);
    });
  }
  return ranks;
}
