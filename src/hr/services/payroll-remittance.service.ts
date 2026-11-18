import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { toCsv } from '../../common/utils/csv-writer.js';

/**
 * SSF / PF / CIT / TDS remittance statement for one payroll run.
 *
 * Monthly employer remittances are filed with the SSF and the IRD from
 * exactly these figures; this endpoint produces the CSV in the shape an
 * accountant submits (employee PAN, employer PF/SSF, employee deduction,
 * CIT, SST 1%, TDS, net payable), plus a totals row.
 */
@Injectable()
export class PayrollRemittanceService {
  constructor(private readonly prisma: PrismaService) {}

  async remittanceCsv(tenantId: string, payrollRunId: string) {
    const run = await this.prisma.payrollRun.findFirst({
      where: { id: payrollRunId, tenantId, deletedAt: null },
      select: { id: true, bsYear: true, bsMonth: true, status: true },
    });
    if (!run) throw new NotFoundException('Payroll run not found');

    const slips = await this.prisma.salarySlip.findMany({
      where: { tenantId, payrollRunId, deletedAt: null },
      include: {
        staff: {
          select: {
            employeeCode: true,
            firstNameEn: true,
            middleNameEn: true,
            lastNameEn: true,
            panNumber: true,
          },
        },
      },
      orderBy: { staff: { employeeCode: 'asc' } },
    });

    const money = (value: { toString(): string } | number | null | undefined) =>
      Number(value ?? 0).toFixed(2);

    const rows = slips.map((slip) => ({
      employeeCode: slip.staff.employeeCode ?? '',
      employeeName: [
        slip.staff.firstNameEn,
        slip.staff.middleNameEn,
        slip.staff.lastNameEn,
      ]
        .filter(Boolean)
        .join(' '),
      panNumber: slip.staff.panNumber ?? '',
      employerPfSsf: money(slip.employerPfSsfContribution),
      employeePfSsf: money(slip.employeePfSsfDeduction),
      cit: money(slip.citDeduction),
      sst: money(slip.sstTax1Percent),
      tds: money(slip.tdsIncomeTax),
      netPayable: money(slip.netPayable),
    }));

    const total = (key: keyof (typeof rows)[number]) =>
      rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0).toFixed(2);

    if (rows.length > 0) {
      rows.push({
        employeeCode: 'TOTAL',
        employeeName: `${rows.length} employees`,
        panNumber: '',
        employerPfSsf: total('employerPfSsf'),
        employeePfSsf: total('employeePfSsf'),
        cit: total('cit'),
        sst: total('sst'),
        tds: total('tds'),
        netPayable: total('netPayable'),
      });
    }

    const csv = toCsv(
      [
        'employeeCode',
        'employeeName',
        'panNumber',
        'employerPfSsf',
        'employeePfSsf',
        'cit',
        'sst',
        'tds',
        'netPayable',
      ],
      rows,
    );

    return {
      filename: `payroll-remittance-${run.bsYear}-${String(run.bsMonth).padStart(2, '0')}.csv`,
      csv,
      headcount: slips.length,
    };
  }
}
