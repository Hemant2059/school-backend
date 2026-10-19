import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StudentGuardianService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, tenantId } });
    if (!student) throw new NotFoundException('Student not found');
    const guardian = await this.prisma.guardian.findFirst({ where: { id: dto.guardianId, tenantId } });
    if (!guardian) throw new NotFoundException('Guardian not found');

    const existing = await this.prisma.studentGuardian.findUnique({ where: { studentId_guardianId: { studentId: dto.studentId, guardianId: dto.guardianId } } });
    if (existing) throw new ConflictException('Guardian already linked to student');

    return this.prisma.studentGuardian.create({ data: dto, include: { student: true, guardian: true } });
  }

  async findAll(tenantId: string) {
    return this.prisma.studentGuardian.findMany({
      where: { student: { tenantId } },
      include: { student: true, guardian: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const sg = await this.prisma.studentGuardian.findFirst({ where: { id, student: { tenantId } }, include: { student: true, guardian: true } });
    if (!sg) throw new NotFoundException('Student guardian not found');
    return sg;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.studentGuardian.update({ where: { id }, data: dto, include: { student: true, guardian: true } });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentGuardian.delete({ where: { id } });
    return { deleted: true };
  }
}