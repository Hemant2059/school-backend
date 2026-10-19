import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FiscalYearService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (dto.isActive) {
      await this.prisma.fiscalYear.updateMany({ where: { tenantId, isActive: true }, data: { isActive: false } });
    }
    return this.prisma.fiscalYear.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.fiscalYear.findMany({ where: { tenantId, deletedAt: null }, orderBy: { startDateAd: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const fy = await this.prisma.fiscalYear.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!fy) throw new NotFoundException('Fiscal year not found');
    return fy;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    if (dto.isActive) {
      await this.prisma.fiscalYear.updateMany({ where: { tenantId, isActive: true, NOT: { id } }, data: { isActive: false } });
    }
    return this.prisma.fiscalYear.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.fiscalYear.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const fy = await this.prisma.fiscalYear.findUnique({ where: { id } });
    if (!fy || fy.tenantId !== tenantId) throw new NotFoundException('Fiscal year not found');
    if (!fy.deletedAt) throw new ConflictException('Fiscal year is not deleted');
    return this.prisma.fiscalYear.update({ where: { id }, data: { deletedAt: null } });
  }
}