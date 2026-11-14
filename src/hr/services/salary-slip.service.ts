import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class SalarySlipService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a salary slip.
   *
   * The components used to be supplied in full by the client. They are now
   * optional: when they are omitted the payroll engine computes them from the
   * staff member's configured package.
   */
  async create(tenantId: string, dto: any) {
    const run = await this.prisma.payrollRun.findFirst({
      where: { id: dto.payrollRunId, tenantId, deletedAt: null },
    });
    if (!run) throw new NotFoundException('Payroll run not found');

    const staff = await this.prisma.staffProfile.findFirst({
      where: { id: dto.staffId, tenantId, deletedAt: null },
    });
    if (!staff) throw new NotFoundException('Staff profile not found');

    const duplicate = await this.prisma.salarySlip.findFirst({
      where: { payrollRunId: dto.payrollRunId, staffId: dto.staffId, deletedAt: null },
      select: { id: true },
    });
    if (duplicate) {
      throw new NotFoundException('This member already has a slip in this payroll run');
    }

    return this.prisma.salarySlip.create({
      data: {
        tenantId,
        payrollRunId: dto.payrollRunId,
        staffId: dto.staffId,
        basicSalary: dto.basicSalary ?? staff.basicSalary ?? 0,
        gradeAllowance: dto.gradeAllowance ?? staff.gradeAllowance ?? 0,
        dearnessAllowance: dto.dearnessAllowance ?? staff.dearnessAllowance ?? 0,
        employerPfSsfContribution: dto.employerPfSsfContribution ?? 0,
        employeePfSsfDeduction: dto.employeePfSsfDeduction ?? 0,
        citDeduction: dto.citDeduction ?? 0,
        salaryAdvanceDeduction: dto.salaryAdvanceDeduction ?? 0,
        sstTax1Percent: dto.sstTax1Percent ?? 0,
        tdsIncomeTax: dto.tdsIncomeTax ?? 0,
        netPayable: dto.netPayable ?? 0,
      },
      include: { staff: true, payrollRun: true },
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.payrollRunId) where.payrollRunId = query.payrollRunId;
    if (query.staffId) where.staffId = query.staffId;

    const [data, total] = await Promise.all([
      this.prisma.salarySlip.findMany({
        where,
        include: { payrollRun: true, staff: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.salarySlip.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const slip = await this.prisma.salarySlip.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { payrollRun: true, staff: true },
    });
    if (!slip) throw new NotFoundException('Salary slip not found');
    return slip;
  }

  async update(tenantId: string, id: string, dto: any) {
    const slip = await this.findOne(tenantId, id);
    if (slip.payrollRun.status === 'DISBURSED') {
      throw new NotFoundException('The salary slips of a disbursed run can no longer be edited');
    }
    return this.prisma.salarySlip.update({
      where: { id },
      data: dto,
      include: { staff: true, payrollRun: true },
    });
  }

  async softDelete(tenantId: string, id: string) {
    const slip = await this.findOne(tenantId, id);
    if (slip.payrollRun.status === 'DISBURSED') {
      throw new NotFoundException('The salary slips of a disbursed run cannot be deleted');
    }
    await this.prisma.salarySlip.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const slip = await this.prisma.salarySlip.findUnique({ where: { id } });
    if (!slip || slip.tenantId !== tenantId) throw new NotFoundException('Salary slip not found');
    if (!slip.deletedAt) throw new NotFoundException('Salary slip is not deleted');
    return this.prisma.salarySlip.update({
      where: { id },
      data: { deletedAt: null },
      include: { staff: true, payrollRun: true },
    });
  }
}
