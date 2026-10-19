import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any, createdByPlatformUserId: string) {
    if (dto.organizationId) {
      const org = await this.prisma.organization.findFirst({ where: { id: dto.organizationId, deletedAt: null } });
      if (!org) throw new NotFoundException('Organization not found');
    }
    try {
      return await this.prisma.tenant.create({ data: { ...dto, createdByPlatformUserId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Subdomain or IEMIS code already exists');
      }
      throw e;
    }
  }

  async findAll(q: any) {
    const where: Prisma.TenantWhereInput = {};
    if (!q.includeDeleted) where.deletedAt = null;
    if (q.organizationId) where.organizationId = q.organizationId;
    if (q.schoolType) where.schoolType = q.schoolType;
    if (q.status) where.status = q.status;
    if (q.search) {
      where.OR = [
        { nameEn: { contains: q.search, mode: 'insensitive' } },
        { nameNe: { contains: q.search, mode: 'insensitive' } },
        { subdomain: { contains: q.search, mode: 'insensitive' } },
        { iemisCode: { contains: q.search, mode: 'insensitive' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        include: { organization: true },
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      this.prisma.tenant.count({ where }),
    ]);
    return { data, meta: { total, page: q.page, limit: q.limit, totalPages: Math.ceil(total / q.limit) || 1 } };
  }

  async findOne(id: string, includeDeleted = false) {
    const tenant = await this.prisma.tenant.findFirst({
      where: includeDeleted ? { id } : { id, deletedAt: null },
      include: { organization: true },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findBySubdomain(subdomain: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { subdomain, deletedAt: null },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return {
      id: tenant.id,
      nameEn: tenant.nameEn,
      nameNe: tenant.nameNe,
      subdomain: tenant.subdomain,
      status: tenant.status,
    };
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    if (dto.organizationId) {
      const org = await this.prisma.organization.findFirst({ where: { id: dto.organizationId, deletedAt: null } });
      if (!org) throw new NotFoundException('Organization not found');
    }
    try {
      return await this.prisma.tenant.update({ where: { id }, data: dto, include: { organization: true } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Subdomain or IEMIS code already exists');
      }
      throw e;
    }
  }

  async softDelete(id: string) {
    await this.findOne(id);
    await this.prisma.tenant.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
    return { deleted: true };
  }

  async hardDelete(id: string) {
    await this.findOne(id);
    await this.prisma.tenant.delete({ where: { id } });
    return { deleted: true, permanent: true };
  }

  async restore(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (!tenant.deletedAt) throw new ConflictException('Tenant is not deleted');
    return this.prisma.tenant.update({ where: { id }, data: { deletedAt: null, status: 'ACTIVE' }, include: { organization: true } });
  }
}