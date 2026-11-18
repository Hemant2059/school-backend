import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHmac } from 'crypto';
import { EsewaProvider } from './esewa.provider.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

function config(
  overrides: Partial<ResolvedGatewayConfig> = {},
): ResolvedGatewayConfig {
  return {
    gateway: 'ESEWA',
    environment: 'sandbox',
    merchantId: 'EPAYTEST',
    secretKey: '8gBm/:&EnhH.1/q',
    ...overrides,
  };
}

function configService(): any {
  return {
    get: (key: string) =>
      key === 'PUBLIC_API_BASE_URL' ? 'http://localhost:3000' : undefined,
  };
}

function esewaData(fields: Record<string, string>, secret = '8gBm/:&EnhH.1/q') {
  const signed = `total_amount=${fields.total_amount},transaction_uuid=${fields.transaction_uuid},product_code=${fields.product_code}`;
  const signature = createHmac('sha256', secret)
    .update(signed)
    .digest('base64');
  const payload = {
    ...fields,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

describe('EsewaProvider', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  describe('initiate', () => {
    it('produces a signed form payload with the tenant merchant code', async () => {
      const provider = new EsewaProvider(
        config({ merchantId: 'SCHOOL1974', secretKey: 'tenant-secret-abcd' }),
        configService(),
      );
      const result = await provider.initiate({
        intentId: 'intent-1',
        amount: 93500,
        invoiceNumber: 'INV-00001',
      });

      expect(result.gatewayRef).toBe('intent-1');
      expect(result.payload.formUrl).toBe(
        'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      );
      const fields = result.payload.fields as any;
      expect(fields.product_code).toBe('SCHOOL1974');
      expect(fields.total_amount).toBe('93500.00');
      expect(fields.transaction_uuid).toBe('intent-1');

      // signature must be HMAC-SHA256(tenant secret) of the exact message
      const msg = `total_amount=${fields.total_amount},transaction_uuid=${fields.transaction_uuid},product_code=${fields.product_code}`;
      const expected = createHmac('sha256', 'tenant-secret-abcd')
        .update(msg)
        .digest('base64');
      expect(fields.signature).toBe(expected);
    });

    it('uses the production form URL in production mode', async () => {
      const provider = new EsewaProvider(
        config({
          environment: 'production',
          merchantId: 'MERCHANT123',
          secretKey: 'prod-secret',
        }),
        configService(),
      );
      const result = await provider.initiate({ intentId: 'i', amount: 100 });
      expect(result.payload.formUrl).toBe(
        'https://epay.esewa.com.np/api/epay/main/v2/form',
      );
    });

    it('throws when production credentials are missing', async () => {
      const provider = new EsewaProvider(
        config({
          environment: 'production',
          merchantId: undefined,
          secretKey: undefined,
        }),
        configService(),
      );
      await expect(
        provider.initiate({ intentId: 'i', amount: 100 }),
      ).rejects.toThrow(/not configured/);
    });
  });

  describe('verify', () => {
    const intent = {
      id: 'intent-1',
      amount: 93500,
      gatewayRef: 'intent-1',
      paymentDateBs: '2082-08-04',
    };

    it('accepts a correctly signed callback when the status API confirms', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            status: 'COMPLETE',
            transaction_uuid: 'intent-1',
          }),
        }),
      );
      const provider = new EsewaProvider(config(), configService());
      const data = esewaData({
        transaction_uuid: 'intent-1',
        total_amount: '93500.00',
        product_code: 'EPAYTEST',
        transaction_code: 'TX1',
        status: 'COMPLETE',
      });
      const result = await provider.verify({
        intent,
        raw: { query: { data } },
      });
      expect(result.ok).toBe(true);
      expect(result.amount).toBe(93500);
    });

    it('rejects a callback with an invalid signature', async () => {
      const provider = new EsewaProvider(config(), configService());
      const good = esewaData({
        transaction_uuid: 'intent-1',
        total_amount: '93500.00',
        product_code: 'EPAYTEST',
        status: 'COMPLETE',
      });
      // Flip a character in the signature
      const decoded = JSON.parse(Buffer.from(good, 'base64').toString('utf8'));
      decoded.signature = 'AAAA' + decoded.signature.slice(4);
      const data = Buffer.from(JSON.stringify(decoded)).toString('base64');
      const result = await provider.verify({
        intent,
        raw: { query: { data } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/signature/i);
    });

    it('rejects when eSewa reports a non-COMPLETE status even with a valid signature', async () => {
      const provider = new EsewaProvider(config(), configService());
      const data = esewaData({
        transaction_uuid: 'intent-1',
        total_amount: '93500.00',
        product_code: 'EPAYTEST',
        status: 'PENDING',
      });
      const result = await provider.verify({
        intent,
        raw: { query: { data } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/PENDING/);
    });

    it('rejects when the status API says the transaction is unknown', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ status: 'NOT_FOUND' }),
        }),
      );
      const provider = new EsewaProvider(config(), configService());
      const data = esewaData({
        transaction_uuid: 'intent-1',
        total_amount: '93500.00',
        product_code: 'EPAYTEST',
        status: 'COMPLETE',
      });
      const result = await provider.verify({
        intent,
        raw: { query: { data } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/NOT_FOUND/);
    });

    it('still accepts a correctly signed callback when the status API is unreachable', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
      );
      const provider = new EsewaProvider(config(), configService());
      const data = esewaData({
        transaction_uuid: 'intent-1',
        total_amount: '93500.00',
        product_code: 'EPAYTEST',
        status: 'COMPLETE',
      });
      const result = await provider.verify({
        intent,
        raw: { query: { data } },
      });
      expect(result.ok).toBe(true);
    });

    it('rejects malformed callback data', async () => {
      const provider = new EsewaProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { data: 'not-base64-json!!!' } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/Malformed/);
    });

    it('rejects when the data parameter is missing entirely', async () => {
      const provider = new EsewaProvider(config(), configService());
      const result = await provider.verify({ intent, raw: { query: {} } });
      expect(result.ok).toBe(false);
    });
  });
});
