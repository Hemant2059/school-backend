import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class ExamScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const exam = await this.prisma.exam.findFirst({ where: { id: dto.examId, tenantId } });
    if (!exam) throw new NotFoundException('Exam not found');
    const gs = await this.prisma.gradeSubject.findFirst({ where: { id: dto.gradeSubjectId, tenantId } });
    if (!gs) throw new NotFoundException('Grade subject not found');
    return this.prisma.examSchedule.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.examSchedule.findMany({ where: { tenantId, deletedAt: null }, include: { exam: true, gradeSubject: { include: { subject: true, gradeLevel: true } } }, orderBy: { examDateAd: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const es = await this.prisma.examSchedule.findFirst({ where: { id, tenantId, deletedAt: null }, include: { exam: true, gradeSubject: { include: { subject: true, gradeLevel: true } }, marks: true } });
    if (!es) throw new NotFoundException('Exam schedule not found');
    return es;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.examSchedule.update({ where: { id }, data: dto, include: { exam: true, gradeSubject: { include: { subject: true, gradeLevel: true } } } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.examSchedule.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }
}