import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
    }
    return this.prisma.guardian.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.guardian.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const guardian = await this.prisma.guardian.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!guardian) throw new NotFoundException('Guardian not found');
    return guardian;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.userId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
    }
    return this.prisma.guardian.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.guardian.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const guardian = await this.prisma.guardian.findUnique({ where: { id } });
    if (!guardian || guardian.tenantId !== tenantId) throw new NotFoundException('Guardian not found');
    if (!guardian.deletedAt) throw new ConflictException('Guardian is not deleted');
    return this.prisma.guardian.update({ where: { id }, data: { deletedAt: null } });
  }
}