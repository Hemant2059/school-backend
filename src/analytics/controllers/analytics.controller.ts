import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  /** Student/attendance KPIs (aggregates only — no per-student rows). */
  @Permissions('students.read')
  @Get('students')
  students(@Param('tenantId') tenantId: string) {
    return this.service.studentsOverview(tenantId);
  }

  /** Fee collection KPIs for the whole school. */
  @Permissions('fee_invoices.read')
  @Get('finance')
  finance(@Param('tenantId') tenantId: string) {
    return this.service.financeOverview(tenantId);
  }
}
