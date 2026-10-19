import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StreamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    try {
      return await this.prisma.stream.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Stream code already exists');
      throw e;
    }
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId, deletedAt: null };
    if (q.search) where.OR = [{ code: { contains: q.search, mode: 'insensitive' } }, { nameEn: { contains: q.search, mode: 'insensitive' } }, { nameNe: { contains: q.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.stream.findMany({ where, orderBy: { code: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.stream.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const s = await this.prisma.stream.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!s) throw new NotFoundException('Stream not found');
    return s;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.stream.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Stream code already exists');
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.stream.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const stream = await this.prisma.stream.findUnique({ where: { id } });
    if (!stream || stream.tenantId !== tenantId) throw new NotFoundException('Stream not found');
    if (!stream.deletedAt) throw new ConflictException('Stream is not deleted');
    return this.prisma.stream.update({ where: { id }, data: { deletedAt: null } });
  }
}