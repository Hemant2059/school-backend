import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    try {
      return await this.prisma.feature.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Feature code already exists');
      }
      throw e;
    }
  }

  async findAll(q: any) {
    const where: Prisma.FeatureWhereInput = {};
    if (q.search) {
      where.OR = [
        { code: { contains: q.search, mode: 'insensitive' } },
        { name: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    if (q.category) where.category = q.category;
    if (q.isActive !== undefined) where.isActive = q.isActive;
    const [data, total] = await Promise.all([
      this.prisma.feature.findMany({
        where,
        orderBy: { code: 'asc' },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.feature.count({ where }),
    ]);
    return { data, meta: { total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) || 1 } };
  }

  async findOne(idOrCode: string) {
    const feature = await this.prisma.feature.findFirst({
      where: { OR: [{ id: idOrCode }, { code: idOrCode }] },
    });
    if (!feature) throw new NotFoundException('Feature not found');
    return feature;
  }

  async update(idOrCode: string, dto: any) {
    const feature = await this.findOne(idOrCode);
    try {
      return await this.prisma.feature.update({ where: { id: feature.id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Feature code already exists');
      }
      throw e;
    }
  }

  async remove(idOrCode: string) {
    const feature = await this.findOne(idOrCode);
    const inUse = await this.prisma.planFeature.count({ where: { featureId: feature.id } });
    if (inUse > 0) throw new ConflictException('Feature is in use by plans');
    await this.prisma.feature.delete({ where: { id: feature.id } });
    return { deleted: true };
  }
}