import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FeeInvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    try {
      return await this.prisma.feeInvoice.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Invoice number already exists for this fiscal year');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.feeInvoice.findMany({ where: { tenantId, deletedAt: null }, include: { items: true, payments: true, creditNotes: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const inv = await this.prisma.feeInvoice.findFirst({ where: { id, tenantId, deletedAt: null }, include: { items: true, payments: true, creditNotes: true } });
    if (!inv) throw new NotFoundException('Fee invoice not found');
    return inv;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.feeInvoice.update({ where: { id }, data: dto, include: { items: true, payments: true, creditNotes: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.feeInvoice.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const inv = await this.prisma.feeInvoice.findUnique({ where: { id } });
    if (!inv || inv.tenantId !== tenantId) throw new NotFoundException('Fee invoice not found');
    if (!inv.deletedAt) throw new ConflictException('Fee invoice is not deleted');
    return this.prisma.feeInvoice.update({ where: { id }, data: { deletedAt: null } });
  }
}