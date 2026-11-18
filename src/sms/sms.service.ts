import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SmsProvider, SmsResult } from './sms-provider.js';
import { NoopSmsProvider } from './providers/noop-sms.provider.js';
import { SparrowSmsProvider } from './providers/sparrow-sms.provider.js';

/**
 * Normalises a Nepali mobile number to the 10-digit national format
 * (98XXXXXXXX / 97XXXXXXXX). Accepts +977 980 1234567, 00977…, 0980…
 * etc. Returns null when the number cannot be a Nepali mobile.
 */
export function normalizeNepaliMobile(raw: string): string | null {
  const digits = (raw ?? '').replace(/\D/g, '');
  let national = digits;
  if (national.startsWith('00977')) national = national.slice(5);
  else if (national.startsWith('977') && national.length > 10)
    national = national.slice(3);
  if (national.startsWith('0')) national = national.slice(1);
  if (/^9[678]\d{8}$/.test(national)) return national;
  return null;
}

/**
 * Resolves and wraps the configured SMS provider.
 *
 * SMS_PROVIDER: 'noop' (default) | 'sparrow'
 * SPARROW_SMS_TOKEN, SPARROW_SMS_FROM, SPARROW_SMS_BASE_URL (optional)
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger('SmsService');
  private readonly provider: SmsProvider;

  constructor(config: ConfigService) {
    const providerName = (
      config.get<string>('SMS_PROVIDER') ?? 'noop'
    ).toLowerCase();
    if (providerName === 'sparrow') {
      const token = config.get<string>('SPARROW_SMS_TOKEN');
      const from = config.get<string>('SPARROW_SMS_FROM');
      if (token && from) {
        this.provider = new SparrowSmsProvider({
          token,
          from,
          baseUrl: config.get<string>('SPARROW_SMS_BASE_URL') || undefined,
        });
      } else {
        this.logger.warn(
          'SMS_PROVIDER=sparrow but SPARROW_SMS_TOKEN/SPARROW_SMS_FROM are not set — falling back to noop',
        );
        this.provider = new NoopSmsProvider();
      }
    } else {
      this.provider = new NoopSmsProvider();
    }
  }

  async send(
    to: string,
    message: string,
  ): Promise<SmsResult & { to?: string }> {
    const normalized = normalizeNepaliMobile(to);
    if (!normalized) {
      return {
        ok: false,
        provider: this.provider.name,
        error: `Not a Nepali mobile number: ${to}`,
      };
    }
    const text = (message ?? '').trim();
    if (!text) {
      return {
        ok: false,
        provider: this.provider.name,
        error: 'Message is empty',
      };
    }
    if (text.length > 160 * 4) {
      return {
        ok: false,
        provider: this.provider.name,
        error: 'Message exceeds 4 SMS parts',
      };
    }
    const result = await this.provider.send(normalized, text);
    return { ...result, to: normalized };
  }
}
