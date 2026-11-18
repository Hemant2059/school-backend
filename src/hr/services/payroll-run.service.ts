import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { PayrollEngineService } from './payroll-engine.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import { money, sum } from '../../common/utils/money.js';

@Injectable()
export class PayrollRunService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: PayrollEngineService,
  ) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
    });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');
    return this.prisma.payrollRun.create({
      data: { ...dto, tenantId, status: dto.status ?? 'DRAFT' },
    });
  }

  /**
   * Generates the salary slips of a payroll run from the staff salary
   * components. Every figure is computed by the payroll engine.
   */
  async generate(tenantId: string, dto: { fiscalYearId: string; bsYear: number; bsMonth: number }) {
    return this.engine.generateRun(tenantId, dto);
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.fiscalYearId) where.fiscalYearId = query.fiscalYearId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.payrollRun.findMany({
        where,
        include: { salarySlips: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payrollRun.count({ where }),
    ]);

    // The run totals are derived, not stored in a column that can drift.
    const withTotals = data.map((run) => ({
      ...run,
      totals: {
        gross: money(
          sum(run.salarySlips.map((s) => s.basicSalary.plus(s.gradeAllowance).plus(s.dearnessAllowance))),
        ),
        employeeDeductions: money(sum(run.salarySlips.map((s) => s.employeePfSsfDeduction))),
        employerContribution: money(sum(run.salarySlips.map((s) => s.employerPfSsfContribution))),
        cit: money(sum(run.salarySlips.map((s) => s.citDeduction))),
        tds: money(sum(run.salarySlips.map((s) => s.tdsIncomeTax))),
        net: money(sum(run.salarySlips.map((s) => s.netPayable))),
        employeeCount: run.salarySlips.length,
      },
    }));

    return { data: withTotals, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const run = await this.prisma.payrollRun.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { salarySlips: { include: { staff: true } } },
    });
    if (!run) throw new NotFoundException('Payroll run not found');
    return {
      ...run,
      totals: {
        gross: money(
          sum(run.salarySlips.map((s) => s.basicSalary.plus(s.gradeAllowance).plus(s.dearnessAllowance))),
        ),
        net: money(sum(run.salarySlips.map((s) => s.netPayable))),
        employeeCount: run.salarySlips.length,
      },
    };
  }

  async update(tenantId: string, id: string, dto: any) {
    const run = await this.findOne(tenantId, id);
    // The status of a disbursed run is final.
    if (run.status === 'DISBURSED') {
      throw new ConflictException('A disbursed payroll run can no longer be modified');
    }
    return this.prisma.payrollRun.update({
      where: { id },
      data: { status: dto.status },
      include: { salarySlips: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    const run = await this.findOne(tenantId, id);
    if (run.status === 'DISBURSED') {
      throw new ConflictException('A disbursed payroll run cannot be deleted');
    }
    await this.prisma.payrollRun.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const run = await this.prisma.payrollRun.findUnique({ where: { id } });
    if (!run || run.tenantId !== tenantId) throw new NotFoundException('Payroll run not found');
    if (!run.deletedAt) throw new NotFoundException('Payroll run is not deleted');
    return this.prisma.payrollRun.update({
      where: { id },
      data: { deletedAt: null },
      include: { salarySlips: true },
    });
  }
}
