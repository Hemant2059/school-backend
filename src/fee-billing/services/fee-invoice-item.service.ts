import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FeeInvoiceItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const invoice = await this.prisma.feeInvoice.findFirst({ where: { id: dto.invoiceId, tenantId } });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    const feeHead = await this.prisma.feeHead.findFirst({ where: { id: dto.feeHeadId, tenantId } });
    if (!feeHead) throw new NotFoundException('Fee head not found');
    return this.prisma.feeInvoiceItem.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.feeInvoiceItem.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const item = await this.prisma.feeInvoiceItem.findFirst({ where: { id, tenantId } });
    if (!item) throw new NotFoundException('Fee invoice item not found');
    return item;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.feeInvoiceItem.update({ where: { id }, data: dto });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.feeInvoiceItem.delete({ where: { id } });
    return { deleted: true };
  }
}