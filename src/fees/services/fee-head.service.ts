import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FeeHeadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    try {
      return await this.prisma.feeHead.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') throw new ConflictException('Fee head already exists');
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.feeHead.findMany({ where: { tenantId, deletedAt: null }, orderBy: { nameEn: 'asc' } });
  }

  async findOne(tenantId: string, id: string) {
    const fh = await this.prisma.feeHead.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!fh) throw new NotFoundException('Fee head not found');
    return fh;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.feeHead.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.feeHead.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const fh = await this.prisma.feeHead.findUnique({ where: { id } });
    if (!fh || fh.tenantId !== tenantId) throw new NotFoundException('Fee head not found');
    if (!fh.deletedAt) throw new ConflictException('Fee head is not deleted');
    return this.prisma.feeHead.update({ where: { id }, data: { deletedAt: null } });
  }
}