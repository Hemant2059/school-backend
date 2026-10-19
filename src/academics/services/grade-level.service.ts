import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class GradeLevelService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.streamId) {
      const stream = await this.prisma.stream.findFirst({ where: { id: dto.streamId, tenantId } });
      if (!stream) throw new NotFoundException('Stream not found');
    }
    return this.prisma.gradeLevel.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId, deletedAt: null };
    if (q.search) where.OR = [{ nameEn: { contains: q.search, mode: 'insensitive' } }, { nameNe: { contains: q.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.gradeLevel.findMany({
        where,
        include: { stream: true },
        orderBy: [{ sortOrder: 'asc' }, { nameEn: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.gradeLevel.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const gl = await this.prisma.gradeLevel.findFirst({ where: { id, tenantId, deletedAt: null }, include: { stream: true } });
    if (!gl) throw new NotFoundException('Grade level not found');
    return gl;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.streamId) {
      const stream = await this.prisma.stream.findFirst({ where: { id: dto.streamId, tenantId } });
      if (!stream) throw new NotFoundException('Stream not found');
    }
    return this.prisma.gradeLevel.update({ where: { id }, data: dto, include: { stream: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.gradeLevel.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const gl = await this.prisma.gradeLevel.findUnique({ where: { id } });
    if (!gl || gl.tenantId !== tenantId) throw new NotFoundException('Grade level not found');
    if (!gl.deletedAt) throw new ConflictException('Grade level is not deleted');
    return this.prisma.gradeLevel.update({ where: { id }, data: { deletedAt: null } });
  }
}