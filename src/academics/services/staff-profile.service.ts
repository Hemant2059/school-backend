import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class StaffProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
    }
    return this.prisma.staffProfile.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string, q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = { tenantId, deletedAt: null };
    if (q.search) where.OR = [{ firstNameEn: { contains: q.search, mode: 'insensitive' } }, { lastNameEn: { contains: q.search, mode: 'insensitive' } }, { employeeCode: { contains: q.search, mode: 'insensitive' } }];
    const [data, total] = await Promise.all([
      this.prisma.staffProfile.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.staffProfile.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(tenantId: string, id: string) {
    const staff = await this.prisma.staffProfile.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!staff) throw new NotFoundException('Staff profile not found');
    return staff;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
    }
    return this.prisma.staffProfile.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.staffProfile.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const staff = await this.prisma.staffProfile.findUnique({ where: { id } });
    if (!staff || staff.tenantId !== tenantId) throw new NotFoundException('Staff profile not found');
    if (!staff.deletedAt) throw new ConflictException('Staff profile is not deleted');
    return this.prisma.staffProfile.update({ where: { id }, data: { deletedAt: null } });
  }
}