import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, createdByPlatformUserId: string) {
    try {
      return await this.prisma.organization.create({
        data: { ...dto, createdByPlatformUserId },
        include: { createdBy: true, resellerPartner: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('PAN/VAT number already exists');
      }
      throw e;
    }
  }

  async findAll(q: any) {
    const where: Prisma.OrganizationWhereInput = {};
    if (!q.includeDeleted) where.deletedAt = null;
    if (q.createdByPlatformUserId) where.createdByPlatformUserId = q.createdByPlatformUserId;
    if (q.resellerPartnerId) where.resellerPartnerId = q.resellerPartnerId;
    if (q.search) {
      where.OR = [
        { nameEn: { contains: q.search, mode: 'insensitive' } },
        { nameNe: { contains: q.search, mode: 'insensitive' } },
        { panVatNumber: { contains: q.search, mode: 'insensitive' } },
        { provinceNe: { contains: q.search, mode: 'insensitive' } },
        { districtNe: { contains: q.search, mode: 'insensitive' } },
        { municipalityNe: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        include: { createdBy: true, resellerPartner: true },
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.organization.count({ where }),
    ]);
    return { data, meta: { total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) || 1 } };
  }

  async findOne(id: string, includeDeleted = false) {
    const org = await this.prisma.organization.findFirst({
      where: includeDeleted ? { id } : { id, deletedAt: null },
      include: { createdBy: true, resellerPartner: true },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    try {
      return await this.prisma.organization.update({
        where: { id },
        data: dto,
        include: { createdBy: true, resellerPartner: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('PAN/VAT number already exists');
      }
      throw e;
    }
  }

  async softDelete(id: string) {
    await this.findOne(id);
    await this.prisma.organization.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async hardDelete(id: string) {
    await this.findOne(id, true);
    await this.prisma.organization.delete({ where: { id } });
    return { deleted: true, permanent: true };
  }

  async restore(id: string) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.deletedAt) throw new ConflictException('Organization is not deleted');
    return this.prisma.organization.update({ where: { id }, data: { deletedAt: null }, include: { createdBy: true, resellerPartner: true } });
  }
}