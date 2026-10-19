import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class AcademicYearService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (dto.isCurrent) {
      await this.prisma.academicYear.updateMany({ where: { tenantId, isCurrent: true }, data: { isCurrent: false } });
    }

    try {
      return await this.prisma.academicYear.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Academic year name already exists for this tenant');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId, deletedAt: null };
    if (q.isCurrent !== undefined) where.isCurrent = q.isCurrent;
    const [data, total] = await Promise.all([
      this.prisma.academicYear.findMany({ where, orderBy: { bsYear: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.academicYear.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const ay = await this.prisma.academicYear.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!ay) throw new NotFoundException('Academic year not found');
    return ay;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.isCurrent) {
      await this.prisma.academicYear.updateMany({ where: { tenantId, isCurrent: true, NOT: { id } }, data: { isCurrent: false } });
    }
    try {
      return await this.prisma.academicYear.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Academic year name already exists for this tenant');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.academicYear.update({ where: { id }, data: { deletedAt: new Date(), isCurrent: false } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const ay = await this.prisma.academicYear.findUnique({ where: { id } });
    if (!ay || ay.tenantId !== tenantId) throw new NotFoundException('Academic year not found');
    if (!ay.deletedAt) throw new ConflictException('Academic year is not deleted');
    return this.prisma.academicYear.update({ where: { id }, data: { deletedAt: null }, include: {} });
  }
}