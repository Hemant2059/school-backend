import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ParentGuard } from '../guards/parent.guard.js';
import { ParentService } from '../services/parent.service.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';
import { PaymentGatewayService } from '../../payments/payment-gateway.service.js';
import { ReportCardService } from '../../report-cards/services/report-card.service.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { OnlinePaymentGateway } from '../../generated/prisma/client.js';

class InitiateChildPaymentDto {
  @IsUUID() invoiceId!: string;
  @IsOptional() @IsEnum(OnlinePaymentGateway) gateway?: OnlinePaymentGateway;
  /** Client-supplied BS calendar date for the receipt (YYYY-MM-DD). */
  @IsString() @MinLength(4) @MaxLength(10) paymentDateBs!: string;
}

/**
 * The parent portal.
 *
 * Everything here is scoped to the children of the calling guardian. There
 * is no way to enumerate other students in the school, read another
 * child's invoices, or reach another child's fees — the guardian link is
 * the only key.
 */
@Controller('tenants/:tenantId/parent')
@UseGuards(ParentGuard)
export class ParentController {
  constructor(
    private readonly service: ParentService,
    private readonly entitlements: TenantEntitlementService,
    private readonly payments: PaymentGatewayService,
    private readonly reportCards: ReportCardService,
  ) {}

  /** The parent's children with basic school information. */
  @Get('children')
  async myChildren(
    @Param('tenantId') tenantId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    return this.service.myChildren(tenantId, req.parentGuardianId);
  }

  /** One child's detail with the current enrollment. */
  @Get('children/:studentId')
  async myChild(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    const student = await this.service.myChild(
      tenantId,
      req.parentGuardianId,
      studentId,
    );
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  /** Attendance summary for the parent's child (last 30 days). */
  @Get('children/:studentId/attendance')
  async attendance(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    return this.service.attendanceSummary(tenantId, req.parentGuardianId, studentId);
  }

  /** The child's published exam results, newest first. */
  @Get('children/:studentId/exams')
  async exams(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    const results = await this.service.myChildExamResults(
      tenantId,
      req.parentGuardianId,
      studentId,
    );
    if (!results) throw new NotFoundException('Student not found');
    return results;
  }

  /** The child's fee invoices across all enrolments, newest first. */
  @Get('children/:studentId/fee-invoices')
  async feeInvoices(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Req() req: Request & { parentGuardianId: string },
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    const invoices = await this.service.myChildFeeInvoices(
      tenantId,
      req.parentGuardianId,
      studentId,
    );
    if (!invoices) throw new NotFoundException('Student not found');
    return invoices;
  }

  /**
   * Download the marksheet PDF for a PUBLISHED exam. Defaults to the
   * latest published exam when no examId is given.
   */
  @Get('children/:studentId/report-card')
  async reportCard(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Query('examId') examId: string | undefined,
    @Req() req: Request & { parentGuardianId: string },
    @Res() res: Response,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    const enrollment = await this.service.myChildCurrentEnrollment(
      tenantId,
      req.parentGuardianId,
      studentId,
    );
    if (!enrollment) throw new NotFoundException('Student not found');

    const pdf = await this.reportCards.generateStudentReportCard(
      tenantId,
      enrollment.id,
      examId,
      true, // publishedOnly — parents never see draft results
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report-card-${studentId}.pdf"`,
    );
    res.end(pdf);
  }

  /**
   * Initiate an online fee payment for the parent's own child. The
   * guardian link is verified — a parent can never pay (or see) another
   * child's invoice.
   */
  @Post('children/:studentId/payment-intents')
  async initiatePayment(
    @Param('tenantId') tenantId: string,
    @Param('studentId') studentId: string,
    @Body() dto: InitiateChildPaymentDto,
    @Req() req: Request & { parentGuardianId: string },
    @CurrentUser('id') userId: string,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'parent.portal');
    return this.payments.initiateAsGuardian(
      tenantId,
      {
        invoiceId: dto.invoiceId,
        gateway: dto.gateway,
        paymentDateBs: dto.paymentDateBs,
      },
      req.parentGuardianId,
      studentId,
      userId,
    );
  }
}
