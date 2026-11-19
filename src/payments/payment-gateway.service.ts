import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service.js';
import { FeeEngineService } from '../fee-billing/services/fee-engine.service.js';
import { buildMeta, resolvePagination } from '../common/utils/pagination.js';
import { EsewaProvider } from './providers/esewa.provider.js';
import { KhaltiProvider } from './providers/khalti.provider.js';
import { ConnectIpsProvider } from './providers/connectips.provider.js';
import { DemoProvider } from './providers/demo.provider.js';
import type {
  GatewayName,
  InitiateInput,
  PaymentGatewayProvider,
  ProviderVerification,
  VerifyInput,
} from './providers/types.js';
import { TenantPaymentGatewayService } from './tenant-payment-gateway.service.js';
import { TenantEntitlementService } from '../billing/services/tenant-entitlement.service.js';
import type { ResolvedGatewayConfig } from './providers/resolved-config.js';
import { FeePaymentMethod } from '../generated/prisma/client.js';

export interface CreatePaymentIntentDto {
  invoiceId: string;
  gateway?: GatewayName;
  /** Client-supplied BS calendar date for the receipt (YYYY-MM-DD). */
  paymentDateBs: string;
}

const METHOD_BY_GATEWAY: Record<GatewayName, FeePaymentMethod> = {
  DEMO: FeePaymentMethod.DEMO,
  ESEWA: FeePaymentMethod.ESEWA,
  KHALTI: FeePaymentMethod.KHALTI,
  CONNECTIPS: FeePaymentMethod.CONNECT_IPS,
};

/**
 * Orchestrates online fee payments: intent creation, gateway selection,
 * callback verification and settlement (receipt creation).
 *
 * A callback is never trusted on its own word — every provider verifies
 * against the gateway (signature and/or server-to-server lookup) before a
 * receipt exists. Amounts are checked against the intent before settling.
 */
@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly engine: FeeEngineService,
    private readonly config: ConfigService,
    private readonly tenantGateways: TenantPaymentGatewayService,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  private providerFor(resolved: ResolvedGatewayConfig): PaymentGatewayProvider {
    switch (resolved.gateway) {
      case 'DEMO':
        return new DemoProvider(resolved, this.config);
      case 'ESEWA':
        return new EsewaProvider(resolved, this.config);
      case 'KHALTI':
        return new KhaltiProvider(resolved, this.config);
      case 'CONNECTIPS':
        return new ConnectIpsProvider(resolved, this.config);
    }
  }

  /** Effective config for a school — tenant row wins over platform .env. */
  private effective(
    tenantId: string,
    gateway: GatewayName,
  ): Promise<ResolvedGatewayConfig | null> {
    return this.tenantGateways.resolveForTenant(tenantId, gateway);
  }

  /** Public, tenant-agnostic view of env-based availability (never secrets). */
  listGateways() {
    return this.tenantGateways.envStatus();
  }

  private defaultGateway(): GatewayName {
    const raw = (
      this.config.get<string>('PAYMENT_GATEWAY') ?? 'demo'
    ).toUpperCase();
    if (['DEMO', 'ESEWA', 'KHALTI', 'CONNECTIPS'].includes(raw))
      return raw as GatewayName;
    this.logger.warn(
      `PAYMENT_GATEWAY="${raw}" is not a known gateway — falling back to DEMO`,
    );
    return 'DEMO';
  }

  async initiate(
    tenantId: string,
    dto: CreatePaymentIntentDto,
    createdByUserId?: string,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'online.payments');

    const gateway = (
      dto.gateway ?? this.defaultGateway()
    ).toUpperCase() as GatewayName;
    if (!['DEMO', 'ESEWA', 'KHALTI', 'CONNECTIPS'].includes(gateway)) {
      throw new BadRequestException('Unknown payment gateway');
    }

    // Resolve the effective gateway configuration BEFORE creating anything —
    // a school without credentials gets a clear 400, not a dangling intent.
    const resolved = await this.effective(tenantId, gateway);
    if (!resolved) {
      throw new BadRequestException(
        `The ${gateway} payment gateway is not configured for this school — set it up under Payment Gateways first`,
      );
    }

    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: dto.invoiceId, tenantId, deletedAt: null },
      include: {
        enrollment: {
          select: {
            student: { select: { firstNameEn: true, lastNameEn: true } },
          },
        },
      },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    if (invoice.status === 'PAID' || Number(invoice.balanceDue) <= 0) {
      throw new ConflictException('This invoice is already fully paid');
    }

    const amount = Number(Number(invoice.balanceDue).toFixed(2));
    const paymentDateBs = (dto.paymentDateBs ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDateBs)) {
      throw new BadRequestException(
        'paymentDateBs must be YYYY-MM-DD (supplied by the client)',
      );
    }

    const intent = await this.prisma.paymentIntent.create({
      data: {
        tenantId,
        invoiceId: invoice.id,
        fiscalYearId: invoice.fiscalYearId,
        enrollmentId: invoice.enrollmentId,
        gateway,
        amount,
        paymentDateBs,
        createdByUserId: createdByUserId ?? null,
      },
    });

    const provider = this.providerFor(resolved);
    const initiationInput: InitiateInput = {
      intentId: intent.id,
      amount,
      invoiceNumber: invoice.invoiceNumber,
      payer: {
        name: invoice.enrollment?.student
          ? `${invoice.enrollment.student.firstNameEn} ${invoice.enrollment.student.lastNameEn}`
          : undefined,
      },
    };

    let initiation;
    try {
      initiation = await provider.initiate(initiationInput);
    } catch (error) {
      // Do not leave a dangling PENDING intent pointing at an unavailable gateway.
      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: { status: 'FAILED' },
      });
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(message);
    }

    await this.prisma.paymentIntent.update({
      where: { id: intent.id },
      data: {
        gatewayRef: initiation.gatewayRef,
        initiationPayload: initiation.payload as any,
      },
    });

    return {
      intentId: intent.id,
      gateway,
      amount,
      paymentDateBs,
      invoiceId: invoice.id,
      ...initiation.payload,
    };
  }

  /**
   * Parent-scoped initiation: the invoice must belong to a student linked
   * to this guardian. This is the only gateway path a parent can reach —
   * they never see invoices for other children, and never initiate for
   * another child either.
   */
  async initiateAsGuardian(
    tenantId: string,
    dto: CreatePaymentIntentDto,
    guardianId: string,
    studentId: string,
    createdByUserId?: string,
  ) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'online.payments');

    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: dto.invoiceId, tenantId, deletedAt: null },
      include: { enrollment: { select: { studentId: true } } },
    });
    if (!invoice) throw new NotFoundException('Fee invoice not found');
    if (invoice.enrollment.studentId !== studentId) {
      throw new ForbiddenException('That invoice does not belong to this child');
    }

    const link = await this.prisma.studentGuardian.findFirst({
      where: { guardianId, studentId },
      select: { id: true },
    });
    if (!link) {
      throw new ForbiddenException('This student is not linked to your account');
    }

    return this.initiate(tenantId, dto, createdByUserId);
  }

  async listIntents(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId };
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.gateway) where.gateway = query.gateway;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.paymentIntent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          invoiceId: true,
          gateway: true,
          status: true,
          amount: true,
          gatewayRef: true,
          createdAt: true,
          completedAt: true,
        },
      }),
      this.prisma.paymentIntent.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async getIntent(tenantId: string, intentId: string) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id: intentId, tenantId },
    });
    if (!intent) throw new NotFoundException('Payment intent not found');
    const invoice = await this.prisma.feeInvoice.findFirst({
      where: { id: intent.invoiceId, tenantId },
      select: { invoiceNumber: true, balanceDue: true, status: true },
    });
    return { intent, invoice };
  }

  /** Resolve the gateway reference a raw callback is about, without trusting it. */
  private refGuess(
    gateway: GatewayName,
    raw: VerifyInput['raw'],
  ): string | null {
    if (gateway === 'ESEWA') {
      const data = raw.query?.['data'];
      if (!data) return null;
      try {
        const decoded = JSON.parse(
          Buffer.from(data, 'base64').toString('utf8'),
        );
        return decoded?.transaction_uuid
          ? String(decoded.transaction_uuid)
          : null;
      } catch {
        return null;
      }
    }
    if (gateway === 'KHALTI') return raw.query?.['pidx']?.toString() ?? null;
    if (gateway === 'CONNECTIPS')
      return raw.query?.['TXNID']?.toString() ?? null;
    if (gateway === 'DEMO') {
      const v = raw.query?.['intent'] ?? raw.body?.['intentId'];
      return typeof v === 'string' && v ? v : null;
    }
    return null;
  }

  /** Shared settlement path for every gateway callback. */
  private async settle(
    gateway: GatewayName,
    intent: {
      id: string;
      tenantId: string;
      amount: unknown;
      gatewayRef: string | null;
      paymentDateBs: string;
      invoiceId: string;
      enrollmentId: string;
      fiscalYearId: string;
      status: string;
    },
    verification: ProviderVerification,
  ) {
    const amount = Number(Number(intent.amount).toFixed(2));

    if (!verification.ok) {
      // Signature/lookup failed or the gateway reports a non-success state.
      // Mark FAILED only when the data was authentic and for this transaction
      // (an attacker must not be able to fail arbitrary intents).
      const authentic = verification.payload !== undefined;
      if (authentic) {
        await this.prisma.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: 'FAILED',
            callbackPayload: verification.payload as any,
          },
        });
      }
      return {
        settled: false,
        alreadyRecorded: false,
        receipt: null,
        error: verification.error,
      };
    }

    if (
      verification.amount !== undefined &&
      Number(verification.amount.toFixed(2)) !== amount
    ) {
      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: 'FAILED',
          callbackPayload: { ...verification.payload, mismatch: true } as any,
        },
      });
      return {
        settled: false,
        alreadyRecorded: false,
        receipt: null,
        error: `Amount mismatch — intent ${amount.toFixed(2)}, gateway reported ${verification.amount.toFixed(2)}`,
      };
    }

    if (intent.status === 'COMPLETED') {
      return {
        settled: true,
        alreadyRecorded: true,
        receipt: null,
        error: undefined,
      };
    }

    // Record the receipt through the fee engine — the same code path as a
    // cash payment, so invoice balances, receipt numbers and audit all line up.
    try {
      const receipt = await this.engine.recordPayment(intent.tenantId, {
        fiscalYearId: intent.fiscalYearId,
        enrollmentId: intent.enrollmentId,
        invoiceId: intent.invoiceId,
        paymentDateAd: new Date(),
        paymentDateBs: intent.paymentDateBs,
        amountPaid: amount,
        paymentMethod: METHOD_BY_GATEWAY[gateway],
        gatewayTransactionId: verification.gatewayRef,
        gatewayResponsePayload: verification.payload,
      });
      await this.prisma.paymentIntent.update({
        where: { id: intent.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          callbackPayload: verification.payload as any,
        },
      });
      return {
        settled: true,
        alreadyRecorded: false,
        receipt,
        error: undefined,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        // Gateway retried a callback we already recorded — settle gracefully.
        await this.prisma.paymentIntent.update({
          where: { id: intent.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            callbackPayload: verification.payload as any,
          },
        });
        return {
          settled: true,
          alreadyRecorded: true,
          receipt: null,
          error: undefined,
        };
      }
      // Leave the intent PENDING so the gateway can retry the callback.
      throw error;
    }
  }

  /** Public callback entry point for every gateway. */
  async handleCallback(gateway: GatewayName, raw: VerifyInput['raw']) {
    const ref = this.refGuess(gateway, raw);
    if (!ref) {
      return {
        settled: false,
        alreadyRecorded: false,
        error: 'Missing transaction reference',
      };
    }
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { gatewayRef: ref },
    });
    if (!intent) {
      // Unknown reference — do not touch anything.
      return {
        settled: false,
        alreadyRecorded: false,
        error: 'Unknown transaction reference',
      };
    }

    const resolved = await this.effective(intent.tenantId, intent.gateway);
    if (!resolved) {
      // Credentials were removed/disabled after initiation — leave the
      // intent PENDING so an admin can reconcile or re-enable.
      return {
        settled: false,
        alreadyRecorded: false,
        error: 'Payment gateway is not configured for this school anymore',
      };
    }

    const provider = this.providerFor(resolved);
    const verification = await provider.verify({
      intent: {
        id: intent.id,
        amount: Number(intent.amount),
        gatewayRef: intent.gatewayRef,
        paymentDateBs: intent.paymentDateBs,
      },
      raw,
    });
    return this.settle(gateway, intent, verification);
  }

  /** Demo checkout completion — the demo gateway's "payer finished" signal. */
  async completeDemo(intentId: string, fail: boolean) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id: intentId, gateway: 'DEMO' },
    });
    if (!intent) throw new NotFoundException('Payment intent not found');

    const resolved = await this.effective(intent.tenantId, 'DEMO');
    if (!resolved) {
      throw new BadRequestException(
        'Demo payments are disabled for this school',
      );
    }

    const provider = this.providerFor(resolved);
    const verification = await provider.verify({
      intent: {
        id: intent.id,
        amount: Number(intent.amount),
        gatewayRef: intent.gatewayRef,
        paymentDateBs: intent.paymentDateBs,
      },
      raw: { query: { fail: String(fail) }, body: { fail } },
    });
    return this.settle('DEMO', intent, verification);
  }
}
