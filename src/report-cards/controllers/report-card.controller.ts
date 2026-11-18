import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportCardService } from '../services/report-card.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

@Controller('tenants/:tenantId/report-cards')
export class ReportCardController {
  constructor(private readonly service: ReportCardService) {}

  /** Generate a PDF marksheet for one student for a specific exam. */
  @Permissions('exams.manage')
  @Get(':enrollmentId')
  async generateReportCard(
    @Param('tenantId') tenantId: string,
    @Param('enrollmentId') enrollmentId: string,
    @Query('examId') examId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.service.generateStudentReportCard(
      tenantId,
      enrollmentId,
      examId,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-card-${enrollmentId}.pdf"`,
    );
    res.end(pdf);
  }

  /** Generate a PDF class marksheet summary for all students in an exam + section. */
  @Permissions('exams.manage')
  @Get('class/:sectionId')
  async generateClassMarksheet(
    @Param('tenantId') tenantId: string,
    @Param('sectionId') sectionId: string,
    @Query('examId') examId: string,
    @Res() res: Response,
  ) {
    const pdf = await this.service.generateClassMarksheet(
      tenantId,
      sectionId,
      examId,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="marksheet-${sectionId}.pdf"`,
    );
    res.end(pdf);
  }
}
