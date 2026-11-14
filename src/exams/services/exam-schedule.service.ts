import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { paginatedQuery } from '../../common/utils/paginated-query.js';

@Injectable()
export class ExamScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a schedule for one subject of an exam.
   *
   * The full marks and the credit hours are inherited from the grade
   * subject's curriculum entry when they are not stated explicitly. Without
   * this a schedule could be created with no marks at all, and then nothing
   * could validate a mark against it.
   */
  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const exam = await this.prisma.exam.findFirst({
      where: { id: dto.examId, tenantId, deletedAt: null },
    });
    if (!exam) throw new NotFoundException('Exam not found');

    const gs = await this.prisma.gradeSubject.findFirst({
      where: { id: dto.gradeSubjectId, tenantId, deletedAt: null },
    });
    if (!gs) throw new NotFoundException('Grade subject not found');

    return this.prisma.examSchedule.create({
      data: {
        ...dto,
        tenantId,
        theoryFullMarks: dto.theoryFullMarks ?? gs.theoryFullMarks,
        theoryPassMarks: dto.theoryPassMarks ?? gs.theoryPassMarks,
        internalFullMarks: dto.internalFullMarks ?? gs.internalFullMarks,
        internalPassMarks: dto.internalPassMarks ?? gs.internalPassMarks,
        creditHours: dto.creditHours ?? gs.creditHours,
        theoryCreditHours: gs.theoryCreditHours,
        internalCreditHours: gs.internalCreditHours,
      },
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    return paginatedQuery(
      this.prisma.examSchedule,
      {
        where: { tenantId, deletedAt: null },
        include: {
          exam: true,
          gradeSubject: { include: { subject: true, gradeLevel: true } },
        },
        orderBy: { examDateAd: 'asc' },
      },
      query,
    );
  }

  async findOne(tenantId: string, id: string) {
    const es = await this.prisma.examSchedule.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        exam: true,
        gradeSubject: { include: { subject: true, gradeLevel: true } },
        marks: true,
      },
    });
    if (!es) throw new NotFoundException('Exam schedule not found');
    return es;
  }

  async update(tenantId: string, id: string, dto: any) {
    const schedule = await this.findOne(tenantId, id);
    if (schedule.exam.isLocked) {
      throw new NotFoundException('This exam is locked and can no longer be edited');
    }
    return this.prisma.examSchedule.update({
      where: { id },
      data: dto,
      include: {
        exam: true,
        gradeSubject: { include: { subject: true, gradeLevel: true } },
      },
    });
  }

  async softDelete(tenantId: string, id: string) {
    const schedule = await this.findOne(tenantId, id);
    if (schedule.exam.isLocked) {
      throw new NotFoundException('This exam is locked and can no longer be edited');
    }
    await this.prisma.examSchedule.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const schedule = await this.prisma.examSchedule.findUnique({ where: { id } });
    if (!schedule || schedule.tenantId !== tenantId) {
      throw new NotFoundException('Exam schedule not found');
    }
    if (!schedule.deletedAt) throw new NotFoundException('Exam schedule is not deleted');
    return this.prisma.examSchedule.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
