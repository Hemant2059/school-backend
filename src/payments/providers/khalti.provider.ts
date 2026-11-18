import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  InitiateInput,
  PaymentGatewayProvider,
  ProviderInitiation,
  ProviderVerification,
  VerifyInput,
} from './types.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

const SANDBOX = 'https://dev.khalti.com/api/v2/';
const PRODUCTION = 'https://khalti.com/api/v2/';

/**
 * Khalti KPG-2 (Web Checkout).
 *
 * Initiation POSTs to the Khalti API and returns a `payment_url`; on
 * return, Khalti appends query parameters, but the only authoritative
 * signal is the lookup API — called server-to-server before a receipt is
 * recorded.
 */
@Injectable()
export class KhaltiProvider implements PaymentGatewayProvider {
  readonly gateway = 'KHALTI' as const;
  private readonly logger = new Logger(KhaltiProvider.name);

  constructor(
    private readonly resolved: ResolvedGatewayConfig,
    private readonly config: ConfigService,
  ) {}

  private env() {
    const prod = this.resolved.environment === 'production';
    return {
      baseUrl: this.resolved.baseUrl ?? (prod ? PRODUCTION : SANDBOX),
      secretKey: this.resolved.secretKey ?? '',
    };
  }

  private request<T>(path: string, init: RequestInit): Promise<T> {
    const { baseUrl, secretKey } = this.env();
    return (async () => {
      const headers = new Headers(init.headers);
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Key ${secretKey}`);
      const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers,
      });
      const body = (await response.json().catch(() => ({}))) as T;
      if (!response.ok) {
        const detail =
          (body as any)?.detail ??
          (body as any)?.message ??
          `HTTP ${response.status}`;
        const error = new Error(String(detail)) as any;
        error.status = response.status;
        error.body = body;
        throw error;
      }
      return body;
    })();
  }

  async initiate(input: InitiateInput): Promise<ProviderInitiation> {
    const { secretKey } = this.env();
    if (!secretKey) {
      throw new Error(
        'Khalti merchant credentials are not configured for this school',
      );
    }

    const amountPaisa = Math.round(input.amount * 100);
    if (amountPaisa < 1000) {
      throw new Error('Amount must be at least Rs. 10.00 for Khalti');
    }

    const base =
      input.callbackBaseUrl ??
      this.config.get<string>('PUBLIC_API_BASE_URL') ??
      'http://localhost:3000';

    const body = await this.request<{
      pidx: string;
      payment_url: string;
      expires_at?: string;
      expires_in?: number;
    }>('epayment/initiate/', {
      method: 'POST',
      body: JSON.stringify({
        return_url: `${base}/payments/gateways/khalti`,
        website_url: base,
        amount: amountPaisa,
        purchase_order_id: input.intentId,
        purchase_order_name: `Fee invoice ${input.invoiceNumber ?? input.intentId}`,
        ...(input.payer?.name
          ? {
              customer_info: {
                name: input.payer.name,
                email: input.payer.email ?? undefined,
                phone: input.payer.phone ?? undefined,
              },
            }
          : {}),
      }),
    });

    return {
      gatewayRef: body.pidx,
      payload: {
        paymentUrl: body.payment_url,
        pidx: body.pidx,
        expiresAt: body.expires_at,
        expiresInSeconds: body.expires_in,
      },
    };
  }

  async verify(input: VerifyInput): Promise<ProviderVerification> {
    const { secretKey } = this.env();
    if (!secretKey) {
      return {
        ok: false,
        gatewayRef: input.intent.gatewayRef ?? '',
        error: 'Khalti is not configured',
      };
    }

    const pidx = input.raw.query?.['pidx'] ?? input.intent.gatewayRef;
    if (!pidx) {
      return { ok: false, gatewayRef: '', error: 'Missing Khalti pidx' };
    }

    let lookup: {
      pidx: string;
      total_amount?: number;
      status?: string;
      transaction_id?: string | null;
    };
    try {
      lookup = await this.request('epayment/lookup/', {
        method: 'POST',
        body: JSON.stringify({ pidx }),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Khalti lookup failed for ${pidx}: ${message}`);
      return {
        ok: false,
        gatewayRef: pidx,
        error: `Khalti lookup failed: ${message}`,
      };
    }

    const amount =
      typeof lookup.total_amount === 'number'
        ? lookup.total_amount / 100
        : undefined;
    const completed = lookup.status === 'Completed';
    return {
      ok: completed,
      gatewayRef: pidx,
      amount,
      error: completed
        ? undefined
        : `Khalti reports payment status "${lookup.status ?? 'unknown'}"`,
      payload: lookup as Record<string, unknown>,
    };
  }
}
