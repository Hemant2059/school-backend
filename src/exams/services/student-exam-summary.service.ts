import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { ExamResultService } from './exam-result.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import type { UpdateStudentExamSummaryDto } from '../dto/student-exam-summary.dto.js';

@Injectable()
export class StudentExamSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly results: ExamResultService,
  ) {}

  /**
   * Computes and stores a summary.
   *
   * The client used to be able to post `percentage`, `gpa`, `finalGrade`,
   * `rankInSection`, `rankInGrade` and the attendance counters directly.
   * Those fields are now derived from the recorded marks.
   */
  async create(tenantId: string, _dto: any) {
    if (!_dto.examId || !_dto.enrollmentId) {
      throw new BadRequestException('examId and enrollmentId are required');
    }
    return this.results.persistSummary(tenantId, _dto.examId, _dto.enrollmentId);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId };
    if (query.examId) where.examId = query.examId;
    if (query.enrollmentId) where.enrollmentId = query.enrollmentId;

    const [data, total] = await Promise.all([
      // `StudentExamSummary` relates to an enrolment, not directly to a
      // student — including `student` here was a hard runtime error.
      this.prisma.studentExamSummary.findMany({
        where,
        include: { exam: true, enrollment: { include: { student: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.studentExamSummary.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const s = await this.prisma.studentExamSummary.findFirst({
      where: { id, tenantId },
      include: { exam: true, enrollment: { include: { student: true } } },
    });
    if (!s) throw new NotFoundException('Student exam summary not found');
    return s;
  }

  /**
   * Recomputes a summary. The stored values are always overwritten with the
   * computed ones — they are never edited by hand.
   */
  async update(tenantId: string, id: string, dto: UpdateStudentExamSummaryDto) {
    const summary = await this.prisma.studentExamSummary.findFirst({
      where: { id, tenantId },
    });
    if (!summary) throw new NotFoundException('Student exam summary not found');

    // The class teacher's remark is the only field that may be edited by
    // hand; every computed value is refreshed from the marks.
    if (dto.classTeacherRemarks !== undefined) {
      await this.prisma.studentExamSummary.update({
        where: { id },
        data: { classTeacherRemarks: dto.classTeacherRemarks },
      });
    }

    return this.results.persistSummary(tenantId, summary.examId, summary.enrollmentId);
  }

  async remove(tenantId: string, id: string) {
    const summary = await this.prisma.studentExamSummary.findFirst({
      where: { id, tenantId },
    });
    if (!summary) throw new NotFoundException('Student exam summary not found');
    await this.prisma.studentExamSummary.delete({ where: { id } });
    return { deleted: true };
  }
}
