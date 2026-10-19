import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class SalarySlipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const run = await this.prisma.payrollRun.findFirst({ where: { id: dto.payrollRunId, tenantId } });
    if (!run) throw new NotFoundException('Payroll run not found');
    const staff = await this.prisma.staffProfile.findFirst({ where: { id: dto.staffId, tenantId } });
    if (!staff) throw new NotFoundException('Staff profile not found');
    return this.prisma.salarySlip.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.salarySlip.findMany({ where: { tenantId, deletedAt: null }, include: { payrollRun: true, staff: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const slip = await this.prisma.salarySlip.findFirst({ where: { id, tenantId, deletedAt: null }, include: { payrollRun: true, staff: true } });
    if (!slip) throw new NotFoundException('Salary slip not found');
    return slip;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.salarySlip.update({ where: { id }, data: dto, include: { payrollRun: true, staff: true } });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.salarySlip.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const slip = await this.prisma.salarySlip.findUnique({ where: { id } });
    if (!slip || slip.tenantId !== tenantId) throw new NotFoundException('Salary slip not found');
    if (!slip.deletedAt) throw new ConflictException('Salary slip is not deleted');
    return this.prisma.salarySlip.update({ where: { id }, data: { deletedAt: null } });
  }
}