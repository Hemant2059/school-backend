import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
    if (!ay) throw new NotFoundException('Academic year not found');
    if (dto.gradingScaleId) {
      const gs = await this.prisma.gradingScale.findFirst({ where: { id: dto.gradingScaleId, tenantId } });
      if (!gs) throw new NotFoundException('Grading scale not found');
    }
    return this.prisma.exam.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.exam.findMany({ where: { tenantId, deletedAt: null }, include: { academicYear: true, gradingScale: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const exam = await this.prisma.exam.findFirst({ where: { id, tenantId, deletedAt: null }, include: { academicYear: true, gradingScale: true, schedules: true } });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
      if (!ay) throw new NotFoundException('Academic year not found');
    }
    if (dto.gradingScaleId) {
      const gs = await this.prisma.gradingScale.findFirst({ where: { id: dto.gradingScaleId, tenantId } });
      if (!gs) throw new NotFoundException('Grading scale not found');
    }
    return this.prisma.exam.update({ where: { id }, data: dto, include: { academicYear: true, gradingScale: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
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