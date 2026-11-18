import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import type {
  InitiateInput,
  PaymentGatewayProvider,
  ProviderInitiation,
  ProviderVerification,
  VerifyInput,
} from './types.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

/** Public sandbox credentials published by eSewa — safe defaults for sandbox. */
const SANDBOX = {
  formUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  statusUrl: 'https://rc-epay.esewa.com.np/api/epay/transaction/status/',
  productCode: 'EPAYTEST',
  secretKey: '8gBm/:&EnhH.1/q',
} as const;
const PRODUCTION = {
  formUrl: 'https://epay.esewa.com.np/api/epay/main/v2/form',
  statusUrl: 'https://epay.esewa.com.np/api/epay/transaction/status/',
} as const;

/**
 * eSewa ePay v2 (form-post flow).
 *
 * Initiation produces a signed form the browser POSTs to eSewa; on return,
 * eSewa sends `?data=<base64-url-json>` to the success/failure URLs. The
 * payload is verified with HMAC-SHA256 against the school's eSewa secret
 * before any receipt is recorded.
 */
@Injectable()
export class EsewaProvider implements PaymentGatewayProvider {
  readonly gateway = 'ESEWA' as const;
  private readonly logger = new Logger(EsewaProvider.name);

  constructor(
    private readonly resolved: ResolvedGatewayConfig,
    private readonly config: ConfigService,
  ) {}

  private env() {
    const prod = this.resolved.environment === 'production';
    return {
      formUrl: prod ? PRODUCTION.formUrl : SANDBOX.formUrl,
      statusUrl: prod ? PRODUCTION.statusUrl : SANDBOX.statusUrl,
      productCode:
        this.resolved.merchantId || (prod ? '' : SANDBOX.productCode),
      secretKey: this.resolved.secretKey || (prod ? '' : SANDBOX.secretKey),
    };
  }

  private signature(fields: {
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
  }): string {
    const message = `total_amount=${fields.total_amount},transaction_uuid=${fields.transaction_uuid},product_code=${fields.product_code}`;
    return createHmac('sha256', this.env().secretKey)
      .update(message)
      .digest('base64');
  }

  async initiate(input: InitiateInput): Promise<ProviderInitiation> {
    const env = this.env();
    if (!env.productCode || !env.secretKey) {
      throw new Error(
        'eSewa merchant credentials are not configured for this school',
      );
    }

    const totalAmount = input.amount.toFixed(2);
    const transactionUuid = input.intentId;
    const signature = this.signature({
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: env.productCode,
    });

    const base =
      input.callbackBaseUrl ??
      this.config.get<string>('PUBLIC_API_BASE_URL') ??
      'http://localhost:3000';

    return {
      gatewayRef: transactionUuid,
      payload: {
        formUrl: this.resolved.baseUrl ?? env.formUrl,
        method: 'POST',
        fields: {
          amount: totalAmount,
          tax_amount: '0',
          product_service_charge: '0',
          product_delivery_charge: '0',
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          product_code: env.productCode,
          success_url: `${base}/payments/gateways/esewa?status=success`,
          failure_url: `${base}/payments/gateways/esewa?status=failure`,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature,
        },
      },
    };
  }

  async verify(input: VerifyInput): Promise<ProviderVerification> {
    const rawData = input.raw.query?.['data'];
    if (!rawData) {
      return {
        ok: false,
        gatewayRef: input.intent.gatewayRef ?? '',
        error: 'Missing eSewa callback data',
      };
    }

    let decoded: any;
    try {
      decoded = JSON.parse(Buffer.from(rawData, 'base64').toString('utf8'));
    } catch {
      return {
        ok: false,
        gatewayRef: input.intent.gatewayRef ?? '',
        error: 'Malformed eSewa callback payload',
      };
    }

    const gatewayRef = String(decoded?.transaction_uuid ?? '');
    const totalAmountRaw = String(decoded?.total_amount ?? '').replace(
      /,/g,
      '',
    );
    const totalAmount = Number(totalAmountRaw);

    const expected = this.signature({
      total_amount: totalAmountRaw,
      transaction_uuid: gatewayRef,
      product_code: String(decoded?.product_code ?? ''),
    });
    const provided = Buffer.from(String(decoded?.signature ?? ''), 'utf8');
    const expectedBuf = Buffer.from(expected, 'utf8');
    const signatureOk =
      provided.length === expectedBuf.length &&
      timingSafeEqual(provided, expectedBuf);
    if (!signatureOk) {
      this.logger.warn(
        `eSewa callback with invalid signature for ${gatewayRef}`,
      );
      return {
        ok: false,
        gatewayRef,
        error: 'Invalid eSewa signature',
        payload: decoded,
      };
    }

    const statusText = String(decoded?.status ?? '').toUpperCase();
    if (statusText !== 'COMPLETE') {
      return {
        ok: false,
        gatewayRef,
        amount: Number.isFinite(totalAmount) ? totalAmount : undefined,
        error: `eSewa reports payment status "${decoded?.status ?? 'unknown'}"`,
        payload: decoded,
      };
    }

    // Server-to-server status check when reachable — belt and braces on
    // top of the signature (which is itself authoritative).
    return this.verifyWithStatusApi(
      {
        gatewayRef,
        amount: totalAmount,
        transactionCode: String(decoded?.transaction_code ?? ''),
      },
      decoded,
    );
  }

  private async verifyWithStatusApi(
    ctx: { gatewayRef: string; amount: number; transactionCode: string },
    payload: any,
  ): Promise<ProviderVerification> {
    const env = this.env();
    try {
      const url = `${env.statusUrl}?product_code=${encodeURIComponent(
        String(payload?.product_code ?? ''),
      )}&total_amount=${encodeURIComponent(ctx.amount.toFixed(2))}&transaction_uuid=${encodeURIComponent(ctx.gatewayRef)}`;
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const body: any = await response.json().catch(() => null);
        const status = String(body?.status ?? '').toUpperCase();
        if (status && status !== 'COMPLETE') {
          return {
            ok: false,
            gatewayRef: ctx.gatewayRef,
            amount: ctx.amount,
            error: `eSewa status API reports "${body?.status}"`,
            payload: { ...payload, statusApi: body },
          };
        }
        return {
          ok: true,
          gatewayRef: ctx.gatewayRef,
          amount: ctx.amount,
          payload: { ...payload, statusApi: body },
        };
      }
      this.logger.warn(
        `eSewa status API returned HTTP ${response.status} — accepting signed callback`,
      );
      return {
        ok: true,
        gatewayRef: ctx.gatewayRef,
        amount: ctx.amount,
        payload,
      };
    } catch (error) {
      this.logger.warn(
        `eSewa status API unreachable — accepting signed callback: ${String(error)}`,
      );
      return {
        ok: true,
        gatewayRef: ctx.gatewayRef,
        amount: ctx.amount,
        payload,
      };
    }
  }
}
