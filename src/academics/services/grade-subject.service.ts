import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class GradeSubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const gradeLevel = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
    if (!gradeLevel) throw new NotFoundException('Grade level not found');
    const subject = await this.prisma.subject.findFirst({ where: { id: dto.subjectId, tenantId } });
    if (!subject) throw new NotFoundException('Subject not found');

    try {
      return await this.prisma.gradeSubject.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Grade subject already exists');
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.gradeSubject.findMany({
      where: { tenantId, deletedAt: null },
      include: { gradeLevel: true, subject: true },
      orderBy: [{ sortOrder: 'asc' }],
    });
  }

  async findOne(tenantId: string, id: string) {
    const gs = await this.prisma.gradeSubject.findFirst({ where: { id, tenantId, deletedAt: null }, include: { gradeLevel: true, subject: true } });
    if (!gs) throw new NotFoundException('Grade subject not found');
    return gs;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.gradeLevelId) {
      const gl = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
      if (!gl) throw new NotFoundException('Grade level not found');
    }
    if (dto.subjectId) {
      const sub = await this.prisma.subject.findFirst({ where: { id: dto.subjectId, tenantId } });
      if (!sub) throw new NotFoundException('Subject not found');
    }
    try {
      return await this.prisma.gradeSubject.update({ where: { id }, data: dto, include: { gradeLevel: true, subject: true } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Grade subject already exists');
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.gradeSubject.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const gs = await this.prisma.gradeSubject.findUnique({ where: { id } });
    if (!gs || gs.tenantId !== tenantId) throw new NotFoundException('Grade subject not found');
    if (!gs.deletedAt) throw new ConflictException('Grade subject is not deleted');
    return this.prisma.gradeSubject.update({ where: { id }, data: { deletedAt: null } });
  }
}