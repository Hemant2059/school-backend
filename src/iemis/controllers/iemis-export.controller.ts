import { Controller, Get, Header, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IemisExportService } from '../services/iemis-export.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/iemis')
export class IemisExportController {
  constructor(private readonly service: IemisExportService) {}

  /**
   * Downloadable CSV of the school's student register for IEMIS upload.
   * Excludes soft-deleted records.
   */
  @Permissions('academic_years.read')
  @Get('students')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="students.csv"')
  async studentsCsv(@Param('tenantId') tenantId: string, @Res() res: Response) {
    const csv = await this.service.studentsCsv(tenantId);
    res.send(csv);
  }

  /** Student register in IEMIS JSON shape for direct API submission. */
  @Permissions('academic_years.read')
  @Get('students.json')
  studentsJson(@Param('tenantId') tenantId: string) {
    return this.service.studentsJson(tenantId);
  }

  /** Staff/teacher register for IEMIS upload. */
  @Permissions('staff.read')
  @Get('staff')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="staff.csv"')
  async staffCsv(@Param('tenantId') tenantId: string, @Res() res: Response) {
    const csv = await this.service.staffCsv(tenantId);
    res.send(csv);
  }

  /** Teacher/staff register in IEMIS JSON shape. */
  @Permissions('staff.read')
  @Get('staff.json')
  staffJson(@Param('tenantId') tenantId: string) {
    return this.service.staffJson(tenantId);
  }

  /** Exam results for an academic year in IEMIS-compatible shape. */
  @Permissions('exams.read')
  @Get('results')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="results.csv"')
  async resultsCsv(
    @Param('tenantId') tenantId: string,
    @Query('academicYearId') academicYearId: string,
    @Res() res: Response,
  ) {
    const csv = await this.service.resultsCsv(tenantId, academicYearId);
    res.send(csv);
  }

  /** Scholarship register for IEMIS upload. */
  @Permissions('scholarships.read')
  @Get('scholarships')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="scholarships.csv"')
  async scholarshipsCsv(
    @Param('tenantId') tenantId: string,
    @Res() res: Response,
  ) {
    const csv = await this.service.scholarshipsCsv(tenantId);
    res.send(csv);
  }
}
