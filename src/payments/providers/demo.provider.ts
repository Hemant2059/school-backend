import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  InitiateInput,
  PaymentGatewayProvider,
  ProviderInitiation,
  ProviderVerification,
  VerifyInput,
} from './types.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

/**
 * The demo gateway — the whole payment loop, entirely local.
 *
 * `initiate` returns a hint pointing at this app's demo checkout endpoint;
 * `verify` approves the payment (unless the client asked it to fail), so a
 * school can see receipts, invoice balances and the ledger actually move
 * before any merchant account exists. No external service is involved.
 */
@Injectable()
export class DemoProvider implements PaymentGatewayProvider {
  readonly gateway = 'DEMO' as const;

  constructor(
    private readonly resolved: ResolvedGatewayConfig,
    private readonly config: ConfigService,
  ) {}

  async initiate(input: InitiateInput): Promise<ProviderInitiation> {
    const transactionRef = `DEMO-${randomUUID()}`;
    const base =
      input.callbackBaseUrl ??
      this.config.get<string>('PUBLIC_API_BASE_URL') ??
      'http://localhost:3000';

    return {
      gatewayRef: transactionRef,
      payload: {
        checkoutUrl: `${base}/payments/gateways/demo/checkout?intent=${input.intentId}`,
        transactionRef,
        mock: true,
        hint: 'Call POST /payments/gateways/demo/complete {"intentId":"..."} to simulate the payer finishing payment.',
      },
    };
  }

  async verify(input: VerifyInput): Promise<ProviderVerification> {
    const fail =
      input.raw.query?.['fail'] === 'true' || input.raw.body?.['fail'] === true;
    if (fail) {
      return {
        ok: false,
        gatewayRef: input.intent.gatewayRef ?? '',
        error: 'Demo payment was declined by the payer',
        // authentic so the intent can be marked FAILED (not exploitable)
        payload: {
          provider: 'demo',
          approved: false,
          intentId: input.intent.id,
        },
      };
    }
    return {
      ok: true,
      gatewayRef: input.intent.gatewayRef ?? `DEMO-${randomUUID()}`,
      amount: input.intent.amount,
      payload: { provider: 'demo', approved: true, intentId: input.intent.id },
    };
  }
}
