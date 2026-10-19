import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FeePaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const fiscalYear = await this.prisma.fiscalYear.findFirst({ where: { id: dto.fiscalYearId, tenantId } });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');
    const enrollment = await this.prisma.studentEnrollment.findFirst({ where: { id: dto.enrollmentId, tenantId } });
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (dto.invoiceId) {
      const invoice = await this.prisma.feeInvoice.findFirst({ where: { id: dto.invoiceId, tenantId } });
      if (!invoice) throw new NotFoundException('Fee invoice not found');
    }
    return this.prisma.feePayment.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.feePayment.findMany({ where: { tenantId, deletedAt: null }, include: { invoice: true, enrollment: true, fiscalYear: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.feePayment.findFirst({ where: { id, tenantId, deletedAt: null }, include: { invoice: true, enrollment: true, fiscalYear: true } });
    if (!payment) throw new NotFoundException('Fee payment not found');
    return payment;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.feePayment.update({ where: { id }, data: dto, include: { invoice: true, enrollment: true, fiscalYear: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.feePayment.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const payment = await this.prisma.feePayment.findUnique({ where: { id } });
    if (!payment || payment.tenantId !== tenantId) throw new NotFoundException('Fee payment not found');
    if (!payment.deletedAt) throw new ConflictException('Fee payment is not deleted');
    return this.prisma.feePayment.update({ where: { id }, data: { deletedAt: null } });
  }
}