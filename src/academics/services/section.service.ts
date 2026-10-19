import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class SectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const gradeLevel = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
    if (!gradeLevel) throw new NotFoundException('Grade level not found');

    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
      if (!ay) throw new NotFoundException('Academic year not found');
    }
    if (dto.classTeacherId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.classTeacherId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }

    try {
      return await this.prisma.section.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Section name already exists for this grade level/year');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId, deletedAt: null };
    if (q.search) where.OR = [{ nameEn: { contains: q.search, mode: 'insensitive' } }, { nameNe: { contains: q.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.section.findMany({
        where,
        include: { gradeLevel: true, academicYear: true, classTeacher: true },
        orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.section.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const section = await this.prisma.section.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { gradeLevel: true, academicYear: true, classTeacher: true },
    });
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.gradeLevelId) {
      const gl = await this.prisma.gradeLevel.findFirst({ where: { id: dto.gradeLevelId, tenantId } });
      if (!gl) throw new NotFoundException('Grade level not found');
    }
    if (dto.academicYearId) {
      const ay = await this.prisma.academicYear.findFirst({ where: { id: dto.academicYearId, tenantId } });
      if (!ay) throw new NotFoundException('Academic year not found');
    }
    if (dto.classTeacherId) {
      const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.classTeacherId, tenantId } });
      if (!staff) throw new NotFoundException('Staff profile not found');
    }
    try {
      return await this.prisma.section.update({ where: { id }, data: dto, include: { gradeLevel: true, academicYear: true, classTeacher: true } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Section name already exists for this grade level/year');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.section.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section || section.tenantId !== tenantId) throw new NotFoundException('Section not found');
    if (!section.deletedAt) throw new ConflictException('Section is not deleted');
    return this.prisma.section.update({ where: { id }, data: { deletedAt: null } });
  }
}