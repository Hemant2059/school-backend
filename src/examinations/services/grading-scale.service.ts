import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class GradingScaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.gradingScale.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.gradingScale.findMany({ where: { tenantId, deletedAt: null }, include: { items: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const gs = await this.prisma.gradingScale.findFirst({ where: { id, tenantId, deletedAt: null }, include: { items: true } });
    if (!gs) throw new NotFoundException('Grading scale not found');
    return gs;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.gradingScale.update({ where: { id }, data: dto, include: { items: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.gradingScale.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const gs = await this.prisma.gradingScale.findUnique({ where: { id } });
    if (!gs || gs.tenantId !== tenantId) throw new NotFoundException('Grading scale not found');
    if (!gs.deletedAt) throw new ConflictException('Grading scale is not deleted');
    return this.prisma.gradingScale.update({ where: { id }, data: { deletedAt: null } });
  }

  // Items
  async createItem(gradingScaleId: string, dto: any) {
    const gs = await this.prisma.gradingScale.findUnique({ where: { id: gradingScaleId } });
    if (!gs) throw new NotFoundException('Grading scale not found');
    return this.prisma.gradingScaleItem.create({ data: { ...dto, gradingScaleId } });
  }

  async updateItem(id: string, dto: any) {
    const item = await this.prisma.gradingScaleItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Grading scale item not found');
    return this.prisma.gradingScaleItem.update({ where: { id }, data: dto });
  }

  async removeItem(id: string) {
    const item = await this.prisma.gradingScaleItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Grading scale item not found');
    await this.prisma.gradingScaleItem.delete({ where: { id } });
    return { deleted: true };
  }
}