import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSign, createPrivateKey } from 'crypto';
import type {
  InitiateInput,
  PaymentGatewayProvider,
  ProviderInitiation,
  ProviderVerification,
  VerifyInput,
} from './types.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

/**
 * ConnectIPS (Nepal Clearing House Ltd) e-payment gateway.
 *
 * Flow: a signed form POST redirects the payer to the ConnectIPS login
 * page; on completion the payer lands back on the registered return URL
 * with `TXNID` appended. The authoritative check is the `validatetxn`
 * REST API, signed the same way, with HTTP Basic auth (App ID / password).
 *
 * Credentials come from NCHL support after merchant enrollment. The
 * creditor .pfx must be provided as PEM content (see the payments README
 * section) — it is stored encrypted like every other secret.
 */
@Injectable()
export class ConnectIpsProvider implements PaymentGatewayProvider {
  readonly gateway = 'CONNECTIPS' as const;
  private readonly logger = new Logger(ConnectIpsProvider.name);

  constructor(
    private readonly resolved: ResolvedGatewayConfig,
    private readonly config: ConfigService,
  ) {}

  private env() {
    return {
      baseUrl:
        this.resolved.baseUrl ??
        this.config.get<string>('CONNECTIPS_BASE_URL') ??
        'https://uatcupgapi01.connectips.com',
      merchantId: this.resolved.merchantId ?? '',
      appId: this.resolved.appId ?? '',
      appPassword: this.resolved.secretKey ?? '',
      appName: this.resolved.appName ?? 'School',
      privateKeyPem: this.resolved.privateKeyPem ?? '',
    };
  }

  private sign(message: string): string {
    const { privateKeyPem } = this.env();
    const key = createPrivateKey(privateKeyPem);
    const sign = createSign('sha256');
    sign.update(message);
    sign.end();
    return sign.sign(key, 'base64');
  }

  private txnDate(): string {
    // NCHL expects DD-MM-YYYY.
    const now = new Date();
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${now.getUTCFullYear()}`;
  }

  async initiate(input: InitiateInput): Promise<ProviderInitiation> {
    const env = this.env();
    if (
      !env.merchantId ||
      !env.appId ||
      !env.appPassword ||
      !env.privateKeyPem
    ) {
      throw new Error(
        'ConnectIPS merchant credentials are not configured for this school',
      );
    }

    const amountPaisa = Math.round(input.amount * 100);
    const txnId = input.intentId.slice(0, 20);
    const txnDate = this.txnDate();
    // PARTICULARS must be byte-identical to the value in the form —
    // NCHL recomputes the signed message from the posted fields.
    const particulars = `FEE INVOICE ${input.invoiceNumber ?? ''}`
      .trim()
      .slice(0, 100);
    const message =
      `MERCHANTID=${env.merchantId},APPID=${env.appId},APPNAME=${env.appName},` +
      `TXNID=${txnId},TXNDATE=${txnDate},TXNCRNCY=NPR,TXNAMT=${amountPaisa},` +
      `REFERENCEID=${input.intentId},REMARKS=FEE PAYMENT,PARTICULARS=${particulars},TOKEN=TOKEN`;

    const token = this.sign(message);
    const base =
      input.callbackBaseUrl ??
      this.config.get<string>('PUBLIC_API_BASE_URL') ??
      'http://localhost:3000';

    return {
      gatewayRef: txnId,
      payload: {
        formUrl: `${env.baseUrl}/connectipswebgw/loginpage`,
        method: 'POST',
        fields: {
          MERCHANTID: env.merchantId,
          APPID: env.appId,
          APPNAME: env.appName,
          TXNID: txnId,
          TXNDATE: txnDate,
          TXNCRNCY: 'NPR',
          TXNAMT: String(amountPaisa),
          REFERENCEID: input.intentId,
          REMARKS: 'FEE PAYMENT',
          PARTICULARS: particulars,
          TOKEN: token,
        },
        returnUrl: `${base}/payments/gateways/connectips`,
      },
    };
  }

  async verify(input: VerifyInput): Promise<ProviderVerification> {
    const env = this.env();
    if (
      !env.merchantId ||
      !env.appId ||
      !env.appPassword ||
      !env.privateKeyPem
    ) {
      return {
        ok: false,
        gatewayRef: input.intent.gatewayRef ?? '',
        error: 'ConnectIPS is not configured',
      };
    }

    const txnId = input.raw.query?.['TXNID'] ?? input.intent.gatewayRef ?? '';
    if (!txnId) {
      return { ok: false, gatewayRef: '', error: 'Missing ConnectIPS TXNID' };
    }

    const amountPaisa = Math.round(input.intent.amount * 100);
    const message = `MERCHANTID=${env.merchantId},APPID=${env.appId},REFERENCEID=${txnId},TXNAMT=${amountPaisa}`;
    const token = this.sign(message);

    let response: Response;
    try {
      response = await fetch(
        `${env.baseUrl}/connectipswebws/api/creditor/validatetxn`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${env.appId}:${env.appPassword}`).toString('base64')}`,
          },
          body: JSON.stringify({
            merchantId: Number(env.merchantId),
            appId: env.appId,
            referenceId: txnId,
            txnAmt: amountPaisa,
            token,
          }),
        },
      );
    } catch (error) {
      const messageOut = error instanceof Error ? error.message : String(error);
      this.logger.warn(`ConnectIPS validatetxn failed: ${messageOut}`);
      return {
        ok: false,
        gatewayRef: txnId,
        error: `ConnectIPS validation failed: ${messageOut}`,
      };
    }

    const body: any = await response.json().catch(() => ({}));
    const succeeded = String(body?.status ?? '').toUpperCase() === 'SUCCESS';
    return {
      ok: succeeded,
      gatewayRef: txnId,
      amount: input.intent.amount,
      error: succeeded
        ? undefined
        : `ConnectIPS reports "${body?.status ?? 'unknown'}" — ${body?.statusDesc ?? ''}`.trim(),
      payload: body,
    };
  }
}
