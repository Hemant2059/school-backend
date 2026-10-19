import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const student = await this.prisma.student.findFirst({ where: { id: dto.studentId, tenantId } });
    if (!student) throw new NotFoundException('Student not found');
    const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
    if (!ay) throw new NotFoundException('Academic year not found');
    const gl = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
    if (!gl) throw new NotFoundException('Grade level not found');
    const section = await this.prisma.section.findFirst({ where: { id: dto.sectionId, tenantId } });
    if (!section) throw new NotFoundException('Section not found');

    try {
      return await this.prisma.studentEnrollment.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Enrollment already exists for this student and academic year');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.studentEnrollment.findMany({
      where: { tenantId, deletedAt: null },
      include: { student: true, academicYear: true, gradeLevel: true, section: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const enr = await this.prisma.studentEnrollment.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { student: true, academicYear: true, gradeLevel: true, section: true },
    });
    if (!enr) throw new NotFoundException('Enrollment not found');
    return enr;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
      if (!ay) throw new NotFoundException('Academic year not found');
    }
    if (dto.gradeLevelId) {
      const gl = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
      if (!gl) throw new NotFoundException('Grade level not found');
    }
    if (dto.sectionId) {
      const sec = await this.prisma.section.findFirst({ where: { id: dto.sectionId, tenantId } });
      if (!sec) throw new NotFoundException('Section not found');
    }
    try {
      return await this.prisma.studentEnrollment.update({ where: { id }, data: dto, include: { student: true, academicYear: true, gradeLevel: true, section: true } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Enrollment already exists for this student and academic year');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.studentEnrollment.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const enr = await this.prisma.studentEnrollment.findUnique({ where: { id } });
    if (!enr || enr.tenantId !== tenantId) throw new NotFoundException('Enrollment not found');
    if (!enr.deletedAt) throw new ConflictException('Enrollment is not deleted');
    return this.prisma.studentEnrollment.update({ where: { id }, data: { deletedAt: null } });
  }
}