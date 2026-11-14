import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MaritalStatusForTax, PayrollRunStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { money } from '../../common/utils/money.js';

/**
 * Nepal's statutory payroll rules.
 *
 * - Provident Fund (PF): employee 10%, employer 10%. The employee's PF
 *   contribution is split one third to CIT (Citizenship Investment Trust,
 *   which administers the Employees' Provident Fund) and two thirds to EPF.
 * - Social Security Fund (SSF): employee 10%, employer 10%.
 * - Income tax (TDS): withheld monthly against the annual slab.
 * - Services tax (SST): 1% on the service income; recorded on the slip.
 *
 * The contribution base is the basic salary plus the grade allowance; the
 * dearness allowance is excluded, which is the usual practice.
 */
export const NEPAL_PAYROLL_RULES = {
  /** Employee Provident Fund contribution rate. */
  employeePfRate: 0.1,
  /** Employer Provident Fund contribution rate. */
  employerPfRate: 0.1,
  /** Employee Social Security Fund contribution rate. */
  employeeSsfRate: 0.1,
  /** Employer Social Security Fund contribution rate. */
  employerSsfRate: 0.1,
  /** Share of the employee's PF contribution that belongs to CIT. */
  citShareOfPf: 1 / 3,
  /** Annual income tax slabs, in NPR. */
  taxSlabs: [
    { upTo: 300_000, rate: 0.05 },
    { upTo: 500_000, rate: 0.1 },
    { upTo: 1_200_000, rate: 0.15 },
    { upTo: 2_000_000, rate: 0.2 },
    { upTo: 3_000_000, rate: 0.25 },
    { upTo: Infinity, rate: 0.3 },
  ],
  /** 50% reduction on the tax slab for an unmarried female taxpayer. */
  femaleTaxRelief: 0.5,
  /** Services tax rate applied to the gross. */
  servicesTaxRate: 0.01,
};

export interface SalaryInput {
  basicSalary: number;
  gradeAllowance?: number;
  dearnessAllowance?: number;
  salaryAdvanceDeduction?: number;
}

export interface SalaryComputation {
  grossSalary: Prisma.Decimal;
  employeePfSsfDeduction: Prisma.Decimal;
  employerPfSsfContribution: Prisma.Decimal;
  citDeduction: Prisma.Decimal;
  sstTax1Percent: Prisma.Decimal;
  tdsIncomeTax: Prisma.Decimal;
  netPayable: Prisma.Decimal;
  taxBreakdown: {
    taxableIncome: number;
    annualTax: number;
    monthlyTax: Prisma.Decimal;
    reliefApplied: boolean;
  };
}

@Injectable()
export class PayrollEngineService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Computes a salary slip from its components.
   *
   * The gross, the statutory deductions and the net were previously all
   * client-supplied, so a slip could claim a net of 999,999 against a basic
   * of 50,000, or deductions larger than the salary.
   */
  compute(
    input: SalaryInput,
    options: { gender?: string; maritalStatusForTax?: MaritalStatusForTax | null } = {},
  ): SalaryComputation {
    const basic = money(input.basicSalary);
    const grade = money(input.gradeAllowance ?? 0);
    const dearness = money(input.dearnessAllowance ?? 0);
    const advance = money(input.salaryAdvanceDeduction ?? 0);

    if (basic.isNegative()) {
      throw new BadRequestException('The basic salary cannot be negative');
    }
    if (advance.isNegative()) {
      throw new BadRequestException('A salary advance deduction cannot be negative');
    }

    const gross = money(basic.plus(grade).plus(dearness));

    // Provident Fund and Social Security Fund are computed on the basic
    // salary plus the grade allowance.
    const contributionBase = money(basic.plus(grade));

    const employeePf = money(contributionBase.times(NEPAL_PAYROLL_RULES.employeePfRate));
    const employeeSsf = money(contributionBase.times(NEPAL_PAYROLL_RULES.employeeSsfRate));
    const employerPf = money(contributionBase.times(NEPAL_PAYROLL_RULES.employerPfRate));
    const employerSsf = money(contributionBase.times(NEPAL_PAYROLL_RULES.employerSsfRate));

    // The employee's total statutory deduction.
    const employeePfSsf = money(employeePf.plus(employeeSsf));
    // The employer's matching contribution.
    const employerPfSsf = money(employerPf.plus(employerSsf));
    // CIT is a *component* of the employee's PF contribution, not an extra
    // deduction. It is reported so it can be remitted to the trust.
    const cit = money(employeePf.times(NEPAL_PAYROLL_RULES.citShareOfPf));

    const sst = money(gross.times(NEPAL_PAYROLL_RULES.servicesTaxRate));

    const taxBreakdown = this.computeIncomeTax(gross, options);
    const monthlyTax = taxBreakdown.monthlyTax;

    const net = money(
      gross.minus(employeePfSsf).minus(advance).minus(sst).minus(monthlyTax),
    );

    if (net.isNegative()) {
      throw new BadRequestException(
        `The deductions exceed the gross salary: the net would be ${net.toFixed(2)}`,
      );
    }

    return {
      grossSalary: gross,
      employeePfSsfDeduction: employeePfSsf,
      employerPfSsfContribution: employerPfSsf,
      citDeduction: cit,
      sstTax1Percent: sst,
      tdsIncomeTax: monthlyTax,
      netPayable: net,
      taxBreakdown,
    };
  }

  /**
   * Computes the monthly income tax withholding for an annual salary.
   */
  computeIncomeTax(
    monthlyGross: Prisma.Decimal,
    options: { gender?: string; maritalStatusForTax?: MaritalStatusForTax | null } = {},
  ): { taxableIncome: number; annualTax: number; monthlyTax: Prisma.Decimal; reliefApplied: boolean } {
    const annualGross = Number(monthlyGross.times(12).toFixed(2));
    const reliefApplied =
      options.maritalStatusForTax === MaritalStatusForTax.SINGLE &&
      (options.gender ?? '').toUpperCase() === 'FEMALE';

    const annualTax = this.slabsTax(annualGross) * (reliefApplied ? 1 - NEPAL_PAYROLL_RULES.femaleTaxRelief : 1);
    const monthlyTax = money(annualTax / 12);

    return {
      taxableIncome: annualGross,
      annualTax: Number(annualTax.toFixed(2)),
      monthlyTax,
      reliefApplied,
    };
  }

  /** Progressive annual income tax on a salary. */
  private slabsTax(annualIncome: number): number {
    let remaining = annualIncome;
    let previousCeiling = 0;
    let tax = 0;

    for (const slab of NEPAL_PAYROLL_RULES.taxSlabs) {
      if (remaining <= 0) break;
      const band = slab.upTo - previousCeiling;
      const taxableInBand = Math.min(remaining, band);
      tax += taxableInBand * slab.rate;
      remaining -= taxableInBand;
      previousCeiling = slab.upTo;
    }

    return tax;
  }

  /**
   * Generates the salary slips of a payroll run for every active member of
   * staff.
   *
   * Each slip is computed by the engine, so the ledger of salaries is
   * derived rather than typed in.
   */
  async generateRun(
    tenantId: string,
    dto: { fiscalYearId: string; bsYear: number; bsMonth: number },
  ) {
    const fiscalYear = await this.prisma.fiscalYear.findFirst({
      where: { id: dto.fiscalYearId, tenantId, deletedAt: null },
    });
    if (!fiscalYear) throw new NotFoundException('Fiscal year not found');

    const existing = await this.prisma.payrollRun.findFirst({
      where: {
        tenantId,
        fiscalYearId: dto.fiscalYearId,
        bsYear: dto.bsYear,
        bsMonth: dto.bsMonth,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException(
        'A payroll run already exists for this fiscal year and month',
      );
    }

    const staff = await this.prisma.staffProfile.findMany({
      where: { tenantId, deletedAt: null },
    });
    if (staff.length === 0) {
      throw new BadRequestException('This school has no active staff to pay');
    }

    const run = await this.prisma.payrollRun.create({
      data: {
        tenantId,
        fiscalYearId: dto.fiscalYearId,
        bsYear: dto.bsYear,
        bsMonth: dto.bsMonth,
        status: PayrollRunStatus.DRAFT,
      },
    });

    const slips = [];
    const skipped: string[] = [];
    for (const member of staff) {
      const basic = Number(member.basicSalary ?? 0);
      if (basic <= 0) {
        // Staff without a configured package are reported rather than paid
        // a made-up amount.
        skipped.push(member.employeeCode ?? member.id);
        continue;
      }

      const computed = this.compute(
        {
          basicSalary: basic,
          gradeAllowance: Number(member.gradeAllowance ?? 0),
          dearnessAllowance: Number(member.dearnessAllowance ?? 0),
        },
        { gender: member.gender ?? undefined, maritalStatusForTax: member.maritalStatusForTax },
      );

      slips.push(
        await this.prisma.salarySlip.create({
          data: {
            tenantId,
            payrollRunId: run.id,
            staffId: member.id,
            basicSalary: money(basic),
            gradeAllowance: money(member.gradeAllowance ?? 0),
            dearnessAllowance: money(member.dearnessAllowance ?? 0),
            employerPfSsfContribution: computed.employerPfSsfContribution,
            employeePfSsfDeduction: computed.employeePfSsfDeduction,
            citDeduction: computed.citDeduction,
            salaryAdvanceDeduction: money(0),
            sstTax1Percent: computed.sstTax1Percent,
            tdsIncomeTax: computed.tdsIncomeTax,
            netPayable: computed.netPayable,
          },
        }),
      );
    }

    return {
      ...run,
      salarySlips: slips,
      generated: slips.length,
      skipped,
    };
  }
}
