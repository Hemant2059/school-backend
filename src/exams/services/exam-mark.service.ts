import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class ExamMarkService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const schedule = await this.prisma.examSchedule.findFirst({ where: { id: dto.examScheduleId, tenantId } });
    if (!schedule) throw new NotFoundException('Exam schedule not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    try {
      return await this.prisma.examMark.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Marks already entered for this student/schedule');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.examMark.findMany({ where: { tenantId }, include: { examSchedule: true, enrollment: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const mark = await this.prisma.examMark.findFirst({ where: { id, tenantId } });
    if (!mark) throw new NotFoundException('Exam mark not found');
    return mark;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.examMark.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.examMark.delete({ where: { id } });
    return { deleted: true };
  }
}