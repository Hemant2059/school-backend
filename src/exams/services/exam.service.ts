import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId, deletedAt: null },
    });
    if (!ay) throw new NotFoundException('Academic year not found');
    if (dto.gradingScaleId) {
      const gs = await this.prisma.gradingScale.findFirst({
        where: { id: dto.gradingScaleId, tenantId, deletedAt: null },
      });
      if (!gs) throw new NotFoundException('Grading scale not found');
    }
    // An exam starts unpublished and unlocked. The flags used to be accepted
    // from the client, so an exam could be created already "published".
    return this.prisma.exam.create({
      data: { ...dto, tenantId, isPublished: false, isLocked: false },
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.academicYearId) where.academicYearId = query.academicYearId;
    if (query.examType) where.examType = query.examType;
    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }];
    }

    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({
        where,
        include: { academicYear: true, gradingScale: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.exam.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { academicYear: true, gradingScale: true, schedules: true },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async update(tenantId: string, id: string, dto: any) {
    const exam = await this.findOne(tenantId, id);
    if (exam.isLocked) {
      throw new ConflictException('This exam is locked and can no longer be edited');
    }
    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({
        where: { id: dto.academicYearId, tenantId, deletedAt: null },
      });
      if (!ay) throw new NotFoundException('Academic year not found');
    }
    if (dto.gradingScaleId) {
      const gs = await this.prisma.gradingScale.findFirst({
        where: { id: dto.gradingScaleId, tenantId, deletedAt: null },
      });
      if (!gs) throw new NotFoundException('Grading scale not found');
    }
    return this.prisma.exam.update({
      where: { id },
      data: dto,
      include: { academicYear: true, gradingScale: true },
    });
  }

  /**
   * Publishes an exam so that marks can be recorded against it.
   */
  async publish(tenantId: string, id: string) {
    const exam = await this.findOne(tenantId, id);
    if (exam.isPublished) throw new ConflictException('This exam is already published');
    const scheduleCount = await this.prisma.examSchedule.count({
      where: { tenantId, examId: id, deletedAt: null },
    });
    if (scheduleCount === 0) {
      throw new ConflictException('An exam must have at least one schedule before it can be published');
    }
    return this.prisma.exam.update({ where: { id }, data: { isPublished: true } });
  }

  /**
   * Locks an exam, freezing its marks, schedules and results.
   */
  async lock(tenantId: string, id: string) {
    const exam = await this.findOne(tenantId, id);
    if (exam.isLocked) throw new ConflictException('This exam is already locked');
    return this.prisma.exam.update({ where: { id }, data: { isLocked: true } });
  }

  async unlock(tenantId: string, id: string) {
    const exam = await this.findOne(tenantId, id);
    if (!exam.isLocked) throw new ConflictException('This exam is not locked');
    return this.prisma.exam.update({ where: { id }, data: { isLocked: false } });
  }

  async softDelete(tenantId: string, id: string) {
    const exam = await this.findOne(tenantId, id);
    if (exam.isLocked) {
      throw new ConflictException('Unlock the exam before deleting it');
    }
    await this.prisma.exam.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam || exam.tenantId !== tenantId) throw new NotFoundException('Exam not found');
    if (!exam.deletedAt) throw new ConflictException('Exam is not deleted');
    return this.prisma.exam.update({ where: { id }, data: { deletedAt: null } });
  }
}
