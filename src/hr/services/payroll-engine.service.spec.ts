import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { MaritalStatusForTax } from '../../generated/prisma/client.js';
import { PayrollEngineService } from './payroll-engine.service.js';

describe('PayrollEngineService', () => {
  const engine = new PayrollEngineService({} as any);

  describe('gross salary', () => {
    it('is the basic salary plus the allowances', () => {
      const result = engine.compute({
        basicSalary: 40_000,
        gradeAllowance: 5_000,
        dearnessAllowance: 3_000,
      });
      expect(result.grossSalary.toFixed(2)).toBe('48000.00');
    });
  });

  describe('provident fund and social security fund', () => {
    it('deducts 10% PF and 10% SSF from the employee', () => {
      const result = engine.compute({ basicSalary: 40_000, gradeAllowance: 5_000 });
      // Base = 45,000; 10% + 10% = 9,000
      expect(result.employeePfSsfDeduction.toFixed(2)).toBe('9000.00');
    });

    it('contributes a matching amount from the employer', () => {
      const result = engine.compute({ basicSalary: 40_000, gradeAllowance: 5_000 });
      expect(result.employerPfSsfContribution.toFixed(2)).toBe('9000.00');
    });

    it('splits one third of the employee PF contribution to CIT', () => {
      const result = engine.compute({ basicSalary: 40_000, gradeAllowance: 5_000 });
      // PF = 4,500; CIT = 1/3 of that
      expect(result.citDeduction.toFixed(2)).toBe('1500.00');
    });

    it('excludes the dearness allowance from the contribution base', () => {
      const result = engine.compute({
        basicSalary: 40_000,
        gradeAllowance: 0,
        dearnessAllowance: 10_000,
      });
      expect(result.employeePfSsfDeduction.toFixed(2)).toBe('8000.00');
    });
  });

  describe('income tax', () => {
    it('applies the annual slab to the projected annual salary', () => {
      const result = engine.compute({ basicSalary: 50_000 });
      // Annual = 600,000.
      //   300,000 @ 5%  = 15,000
      //   200,000 @ 10% = 20,000   (300,001 - 500,000)
      //   100,000 @ 15% = 15,000   (500,001 - 600,000)
      // Total = 50,000 a year, withheld monthly.
      expect(result.taxBreakdown.annualTax).toBe(50_000);
      expect(result.tdsIncomeTax.toFixed(2)).toBe('4166.67');
    });

    it('gives an unmarried female taxpayer the 50% relief', () => {
      const result = engine.compute(
        { basicSalary: 50_000 },
        { gender: 'FEMALE', maritalStatusForTax: MaritalStatusForTax.SINGLE },
      );
      expect(result.taxBreakdown.reliefApplied).toBe(true);
      expect(result.taxBreakdown.annualTax).toBe(25_000);
    });

    it('does not give the relief to a married taxpayer', () => {
      const result = engine.compute(
        { basicSalary: 50_000 },
        { gender: 'FEMALE', maritalStatusForTax: MaritalStatusForTax.MARRIED },
      );
      expect(result.taxBreakdown.reliefApplied).toBe(false);
    });
  });

  describe('net pay', () => {
    it('is the gross less the deductions', () => {
      const result = engine.compute({ basicSalary: 50_000 });
      const expected =
        Number(result.grossSalary.toFixed(2)) -
        Number(result.employeePfSsfDeduction.toFixed(2)) -
        Number(result.sstTax1Percent.toFixed(2)) -
        Number(result.tdsIncomeTax.toFixed(2));
      expect(result.netPayable.toFixed(2)).toBe(expected.toFixed(2));
    });

    it('rejects a negative salary', () => {
      expect(() => engine.compute({ basicSalary: -1 })).toThrow(BadRequestException);
    });

    it('rejects a salary advance larger than the gross', () => {
      expect(() =>
        engine.compute({ basicSalary: 10_000, salaryAdvanceDeduction: 20_000 }),
      ).toThrow(/deductions exceed the gross/);
    });
  });
});
