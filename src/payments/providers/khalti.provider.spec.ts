import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KhaltiProvider } from './khalti.provider.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

function config(
  overrides: Partial<ResolvedGatewayConfig> = {},
): ResolvedGatewayConfig {
  return {
    gateway: 'KHALTI',
    environment: 'sandbox',
    secretKey: 'test_secret_key_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    ...overrides,
  };
}

function configService(): any {
  return {
    get: (key: string) =>
      key === 'PUBLIC_API_BASE_URL' ? 'http://localhost:3000' : undefined,
  };
}

const intent = {
  id: 'intent-1',
  amount: 93500,
  gatewayRef: 'pidx-abc123',
  paymentDateBs: '2082-08-04',
};

describe('KhaltiProvider', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  describe('initiate', () => {
    it('posts to the sandbox API with the Key authorization header and paisa amount', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          pidx: 'pidx-abc123',
          payment_url: 'https://test-pay.khalti.com/?pidx=pidx-abc123',
          expires_in: 1800,
        }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.initiate({
        intentId: 'intent-1',
        amount: 93500,
        invoiceNumber: 'INV-00001',
      });

      expect(result.gatewayRef).toBe('pidx-abc123');
      expect(result.payload.paymentUrl).toContain('test-pay.khalti.com');

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('https://dev.khalti.com/api/v2/epayment/initiate/');
      expect(init?.headers).toBeInstanceOf(Headers);
      const headers = init?.headers as Headers;
      expect(headers.get('Authorization')).toMatch(/^Key test_secret_key_/);
      expect(headers.get('Content-Type')).toBe('application/json');

      const body = JSON.parse(String(init?.body));
      expect(body.amount).toBe(9350000); // Rs 93,500 → paisa
      expect(body.purchase_order_id).toBe('intent-1');
      expect(body.return_url).toBe(
        'http://localhost:3000/payments/gateways/khalti',
      );
    });

    it('uses the production endpoint in production mode', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          pidx: 'p',
          payment_url: 'https://pay.khalti.com/?pidx=p',
        }),
      });
      vi.stubGlobal('fetch', fetchMock);
      const provider = new KhaltiProvider(
        config({ environment: 'production' }),
        configService(),
      );
      await provider.initiate({ intentId: 'i', amount: 100 });
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://khalti.com/api/v2/epayment/initiate/',
      );
    });

    it('rejects amounts below Rs. 10', async () => {
      const provider = new KhaltiProvider(config(), configService());
      await expect(
        provider.initiate({ intentId: 'i', amount: 5 }),
      ).rejects.toThrow(/at least Rs. 10/);
    });

    it('throws when the secret key is missing', async () => {
      const provider = new KhaltiProvider(
        config({ secretKey: undefined }),
        configService(),
      );
      await expect(
        provider.initiate({ intentId: 'i', amount: 100 }),
      ).rejects.toThrow(/not configured/);
    });
  });

  describe('verify', () => {
    it('confirms a Completed lookup and converts paisa to NPR', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            pidx: 'pidx-abc123',
            total_amount: 9350000,
            status: 'Completed',
            transaction_id: 'TX1',
          }),
        }),
      );
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { pidx: 'pidx-abc123', status: 'Completed' } },
      });
      expect(result.ok).toBe(true);
      expect(result.amount).toBe(93500);
    });

    it('rejects a Pending lookup', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            pidx: 'pidx-abc123',
            total_amount: 9350000,
            status: 'Pending',
          }),
        }),
      );
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { pidx: 'pidx-abc123' } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/Pending/);
    });

    it('rejects an Expired lookup', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            pidx: 'pidx-abc123',
            total_amount: 0,
            status: 'Expired',
          }),
        }),
      );
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { pidx: 'pidx-abc123' } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/Expired/);
    });

    it('rejects when the lookup API itself fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 401,
          json: async () => ({ detail: 'Invalid token.' }),
        }),
      );
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { pidx: 'pidx-abc123' } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/Invalid token|lookup failed/i);
    });

    it('rejects when the lookup API is unreachable', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
      );
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({
        intent,
        raw: { query: { pidx: 'pidx-abc123' } },
      });
      expect(result.ok).toBe(false);
      expect(result.error).toMatch(/lookup failed/i);
    });

    it('uses the intent gatewayRef when pidx is absent from the callback', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          pidx: 'pidx-abc123',
          total_amount: 9350000,
          status: 'Completed',
        }),
      });
      vi.stubGlobal('fetch', fetchMock);
      const provider = new KhaltiProvider(config(), configService());
      const result = await provider.verify({ intent, raw: { query: {} } });
      expect(result.ok).toBe(true);
      expect(fetchMock.mock.calls[0][1]?.body).toContain('pidx-abc123');
    });
  });
});
