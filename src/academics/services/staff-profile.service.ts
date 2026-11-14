import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';
import { paginatedQuery } from '../../common/utils/paginated-query.js';

@Injectable()
export class StaffProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        select: { id: true },
      });
      if (!user) throw new NotFoundException('User not found');
    }

    // The plan's teacher limit is now enforced.
    const current = await this.prisma.staffProfile.count({
      where: { tenantId, deletedAt: null },
    });
    await this.entitlements.assertWithinLimit(tenantId, 'teachers.limit', current);

    try {
      return await this.prisma.staffProfile.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Employee code already exists');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.search) {
      where.OR = [
        { firstNameEn: { contains: query.search, mode: 'insensitive' } },
        { lastNameEn: { contains: query.search, mode: 'insensitive' } },
        { employeeCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.staffCategory) where.staffCategory = query.staffCategory;
    if (query.employmentType) where.employmentType = query.employmentType;

    return paginatedQuery(
      this.prisma.staffProfile,
      { where, orderBy: { createdAt: 'desc' } },
      query,
    );
  }

  async findOne(tenantId: string, id: string) {
    const staff = await this.prisma.staffProfile.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!staff) throw new NotFoundException('Staff profile not found');
    return staff;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
        select: { id: true },
      });
      if (!user) throw new NotFoundException('User not found');
    }
    return this.prisma.staffProfile.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.staffProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const staff = await this.prisma.staffProfile.findUnique({ where: { id } });
    if (!staff || staff.tenantId !== tenantId) throw new NotFoundException('Staff profile not found');
    if (!staff.deletedAt) throw new ConflictException('Staff profile is not deleted');
    return this.prisma.staffProfile.update({ where: { id }, data: { deletedAt: null } });
  }
}
