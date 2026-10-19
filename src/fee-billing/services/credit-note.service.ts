import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class CreditNoteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const invoice = await this.prisma.feeInvoice.findFirst({ where: { id: dto.invoiceId, tenantId } });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    return this.prisma.creditNote.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.creditNote.findMany({ where: { tenantId }, include: { invoice: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const cn = await this.prisma.creditNote.findFirst({ where: { id, tenantId }, include: { invoice: true } });
    if (!cn) throw new NotFoundException('Credit note not found');
    return cn;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.creditNote.update({ where: { id }, data: dto, include: { invoice: true } });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.creditNote.delete({ where: { id } });
    return { deleted: true };
  }
}