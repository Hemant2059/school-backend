import { ConfigService } from '@nestjs/config';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SmsService, normalizeNepaliMobile } from './sms.service.js';
import { SparrowSmsProvider } from './providers/sparrow-sms.provider.js';

function makeConfig(env: Record<string, string | undefined>): ConfigService {
  return { get: (key: string) => env[key] } as any;
}

describe('normalizeNepaliMobile', () => {
  it('accepts the 10-digit national format', () => {
    expect(normalizeNepaliMobile('9801234567')).toBe('9801234567');
    expect(normalizeNepaliMobile('9701234567')).toBe('9701234567');
  });

  it('strips the +977 / 977 / 00977 prefixes and spaces', () => {
    expect(normalizeNepaliMobile('+977 980 1234567')).toBe('9801234567');
    expect(normalizeNepaliMobile('9779801234567')).toBe('9801234567');
    expect(normalizeNepaliMobile('009779801234567')).toBe('9801234567');
    expect(normalizeNepaliMobile('+977-980-1234567')).toBe('9801234567');
  });

  it('rejects landlines, short numbers and other countries', () => {
    expect(normalizeNepaliMobile('014000000')).toBeNull(); // landline
    expect(normalizeNepaliMobile('98012')).toBeNull(); // too short
    expect(normalizeNepaliMobile('919876543210')).toBeNull(); // India
    expect(normalizeNepaliMobile('')).toBeNull();
  });
});

describe('SmsService', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it('defaults to the noop provider and never sends', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const service = new SmsService(makeConfig({}));
    const result = await service.send('9801234567', 'Test message');
    expect(result.ok).toBe(true);
    expect(result.provider).toBe('noop');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects an invalid destination before hitting any provider', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const service = new SmsService(makeConfig({}));
    const result = await service.send('123', 'Test');
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Nepali mobile/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to noop when sparrow credentials are missing', async () => {
    const service = new SmsService(makeConfig({ SMS_PROVIDER: 'sparrow' }));
    const result = await service.send('9801234567', 'Test');
    expect(result.provider).toBe('noop');
  });

  it('builds the Sparrow URL with encoded parameters', () => {
    const provider = new SparrowSmsProvider({
      token: 'secret-token',
      from: 'SCHOOL',
    });
    const url = provider.buildUrl('9801234567', 'fees due & payable now');
    expect(url).toContain('https://api.sparrowsms.com/v2/sms/?');
    expect(url).toContain('token=secret-token');
    expect(url).toContain('from=SCHOOL');
    expect(url).toContain('to=9801234567');
    expect(url).toContain('text=fees+due+%26+payable+now');
  });

  it('reports ok on a 2xx Sparrow response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          request_id: 'req-123',
          response_code: 200,
          response: 'success',
        }),
      }),
    );
    const service = new SmsService(
      makeConfig({
        SMS_PROVIDER: 'sparrow',
        SPARROW_SMS_TOKEN: 'tok',
        SPARROW_SMS_FROM: 'SCHOOL',
      }),
    );
    const result = await service.send(
      '9801234567',
      'Your ward was present today',
    );
    expect(result.ok).toBe(true);
    expect(result.provider).toBe('sparrow');
    expect(result.providerRef).toBe('req-123');
  });

  it('reports failure when Sparrow rejects the message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response_code: 400, response: 'invalid token' }),
      }),
    );
    const service = new SmsService(
      makeConfig({
        SMS_PROVIDER: 'sparrow',
        SPARROW_SMS_TOKEN: 'tok',
        SPARROW_SMS_FROM: 'SCHOOL',
      }),
    );
    const result = await service.send('9801234567', 'Hello');
    expect(result.ok).toBe(false);
    expect(result.error).toBe('invalid token');
  });

  it('reports failure when the network is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    );
    const service = new SmsService(
      makeConfig({
        SMS_PROVIDER: 'sparrow',
        SPARROW_SMS_TOKEN: 'tok',
        SPARROW_SMS_FROM: 'SCHOOL',
      }),
    );
    const result = await service.send('9801234567', 'Hello');
    expect(result.ok).toBe(false);
    expect(result.error).toContain('ECONNREFUSED');
  });
});
