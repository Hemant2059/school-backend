import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class PayrollRunService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const fy = await this.prisma.fiscalYear.findFirst({ where: { id: dto.fiscalYearId, tenantId } });
    if (!fy) throw new NotFoundException('Fiscal year not found');
    try {
      return await this.prisma.payrollRun.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Payroll run already exists for this period');
      }
      throw e;
    }
  }

  async findAll(tenantId: string) {
    return this.prisma.payrollRun.findMany({ where: { tenantId, deletedAt: null }, include: { fiscalYear: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const pr = await this.prisma.payrollRun.findFirst({ where: { id, tenantId, deletedAt: null }, include: { fiscalYear: true, salarySlips: true } });
    if (!pr) throw new NotFoundException('Payroll run not found');
    return pr;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.payrollRun.update({ where: { id }, data: dto, include: { fiscalYear: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.payrollRun.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const pr = await this.prisma.payrollRun.findUnique({ where: { id } });
    if (!pr || pr.tenantId !== tenantId) throw new NotFoundException('Payroll run not found');
    if (!pr.deletedAt) throw new ConflictException('Payroll run is not deleted');
    return this.prisma.payrollRun.update({ where: { id }, data: { deletedAt: null } });
  }
}