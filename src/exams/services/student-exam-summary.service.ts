import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StudentExamSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const exam = await this.prisma.exam.findFirst({ where: { id: dto.examId, tenantId } });
    if (!exam) throw new NotFoundException('Exam not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return this.prisma.studentExamSummary.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.studentExamSummary.findMany({ where: { tenantId }, include: { exam: true, student: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const s = await this.prisma.studentExamSummary.findFirst({ where: { id, tenantId }, include: { exam: true, student: true } });
    if (!s) throw new NotFoundException('Student exam summary not found');
    return s;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.studentExamSummary.update({ where: { id }, data: dto, include: { exam: true, student: true } });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentExamSummary.delete({ where: { id } });
    return { deleted: true };
  }
}