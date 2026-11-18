import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PayrollRemittanceService } from '../services/payroll-remittance.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/payroll-runs')
export class PayrollRemittanceController {
  constructor(private readonly service: PayrollRemittanceService) {}

  /**
   * Downloadable CSV of the SSF/PF/CIT/TDS remittance figures for one
   * payroll run — the file an accountant submits to the SSF fund and the
   * IRD each month.
   */
  @Permissions('hr.read')
  @Get(':id/remittance')
  async remittance(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { filename, csv } = await this.service.remittanceCsv(tenantId, id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(csv);
  }
}
