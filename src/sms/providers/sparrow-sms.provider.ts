import { Injectable, Logger } from '@nestjs/common';
import type { SmsProvider, SmsResult } from '../sms-provider.js';

export interface SparrowSmsConfig {
  token: string;
  from: string;
  /** Base URL, overridable for testing and for Apigee-style proxies. */
  baseUrl?: string;
}

/**
 * Sparrow SMS (sparrowsms.com) — one of the widely used bulk SMS
 * gateways in Nepal.
 *
 * Endpoint: GET/POST {baseUrl}?token=…&from=…&to=…&text=…
 * Response: JSON with a `response_code` (200 = accepted) and `request_id`.
 */
@Injectable()
export class SparrowSmsProvider implements SmsProvider {
  readonly name = 'sparrow';
  private readonly logger = new Logger('SparrowSmsProvider');

  constructor(private readonly config: SparrowSmsConfig) {}

  buildUrl(to: string, message: string): string {
    const base = this.config.baseUrl ?? 'https://api.sparrowsms.com/v2/sms/';
    const params = new URLSearchParams({
      token: this.config.token,
      from: this.config.from,
      to,
      text: message,
    });
    return `${base}?${params.toString()}`;
  }

  async send(to: string, message: string): Promise<SmsResult> {
    const url = this.buildUrl(to, message);
    let response: Response;
    try {
      response = await fetch(url, { method: 'POST' });
    } catch (error) {
      this.logger.error(`Sparrow SMS request failed: ${String(error)}`);
      return { ok: false, provider: this.name, error: String(error) };
    }

    let body: any = {};
    try {
      body = await response.json();
    } catch {
      // Some gateways answer with plain text; keep it in the error if any.
    }

    const code = body?.response_code ?? body?.responseCode;
    const accepted =
      response.ok && (code === 200 || code === '200' || code === undefined);
    if (!accepted) {
      const messageOut =
        body?.response ?? body?.message ?? `HTTP ${response.status}`;
      this.logger.warn(`Sparrow SMS rejected message to ${to}: ${messageOut}`);
      return { ok: false, provider: this.name, error: String(messageOut) };
    }
    return {
      ok: true,
      provider: this.name,
      providerRef: body?.request_id ? String(body.request_id) : undefined,
    };
  }
}
