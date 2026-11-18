import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateKeyPairSync, createVerify } from 'crypto';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { ConnectIpsProvider } from './connectips.provider.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

let workDir: string;
let privateKeyPem: string;
let publicKeyPem: string;

function config(
  overrides: Partial<ResolvedGatewayConfig> = {},
): ResolvedGatewayConfig {
  return {
    gateway: 'CONNECTIPS',
    environment: 'sandbox',
    merchantId: '550',
    appId: 'MER-550-APP-1',
    secretKey: 'password-from-nchl',
    appName: 'Test School',
    privateKeyPem,
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
  id: 'intent-00000001',
  amount: 500,
  gatewayRef: 'intent-00000001',
  paymentDateBs: '2082-08-04',
};

describe('ConnectIpsProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    workDir = mkdtempSync(join(tmpdir(), 'connectips-'));
    const pair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    privateKeyPem = pair.privateKey;
    publicKeyPem = pair.publicKey;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    rmSync(workDir, { recursive: true, force: true });
  });

  it('produces a form payload whose TOKEN verifies with the creditor public key', async () => {
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.initiate({
      intentId: 'intent-00000001',
      amount: 500,
      invoiceNumber: 'INV-00001',
    });

    const fields = result.payload.fields as any;
    expect(fields.MERCHANTID).toBe('550');
    expect(fields.APPID).toBe('MER-550-APP-1');
    expect(fields.TXNCRNCY).toBe('NPR');
    expect(fields.TXNAMT).toBe('50000'); // Rs. 500 → paisa
    expect(fields.TXNID).toBe('intent-00000001');

    // The TOKEN must be a base64 RSA-SHA256 signature of the documented message.
    const message =
      `MERCHANTID=550,APPID=MER-550-APP-1,APPNAME=Test School,` +
      `TXNID=${fields.TXNID},TXNDATE=${fields.TXNDATE},TXNCRNCY=NPR,TXNAMT=${fields.TXNAMT},` +
      `REFERENCEID=intent-00000001,REMARKS=FEE PAYMENT,PARTICULARS=FEE INVOICE INV-00001,TOKEN=TOKEN`;
    const verify = createVerify('sha256');
    verify.update(message);
    verify.end();
    expect(verify.verify(publicKeyPem, fields.TOKEN, 'base64')).toBe(true);
  });

  it('uses DD-MM-YYYY as the transaction date', async () => {
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.initiate({ intentId: 'i', amount: 100 });
    const fields = result.payload.fields as any;
    expect(fields.TXNDATE).toMatch(/^\d{2}-\d{2}-\d{4}$/);
  });

  it('returns a returnUrl pointing at our callback path', async () => {
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.initiate({ intentId: 'i', amount: 100 });
    expect(result.payload.returnUrl).toBe(
      'http://localhost:3000/payments/gateways/connectips',
    );
  });

  it('rejects initiation when the private key is missing', async () => {
    const provider = new ConnectIpsProvider(
      config({ privateKeyPem: undefined }),
      configService(),
    );
    await expect(
      provider.initiate({ intentId: 'i', amount: 100 }),
    ).rejects.toThrow(/not configured/);
  });

  it('validatetxn SUCCESS settles with the amount echoed in paisa', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        merchantId: 550,
        appId: 'MER-550-APP-1',
        referenceId: 'intent-00000001',
        txnAmt: '50000',
        status: 'SUCCESS',
        statusDesc: 'TRANSACTION SUCESSFULL',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.verify({
      intent,
      raw: { query: { TXNID: 'intent-00000001' } },
    });
    expect(result.ok).toBe(true);
    expect(result.amount).toBe(500);

    // Basic auth header carries APPID:password
    const [, init] = fetchMock.mock.calls[0];
    const auth = (init?.headers as Record<string, string>)?.Authorization;
    expect(auth).toBe(
      `Basic ${Buffer.from('MER-550-APP-1:password-from-nchl').toString('base64')}`,
    );

    // validatetxn body
    const body = JSON.parse(String(init?.body));
    expect(body.merchantId).toBe(550);
    expect(body.appId).toBe('MER-550-APP-1');
    expect(body.referenceId).toBe('intent-00000001');
    expect(body.txnAmt).toBe(50000);
    expect(typeof body.token).toBe('string');
  });

  it('validatetxn with a non-SUCCESS status does not settle', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'FAILED',
          statusDesc: 'TRANSACTION FAILED',
        }),
      }),
    );
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.verify({
      intent,
      raw: { query: { TXNID: 'intent-00000001' } },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/FAILED/i);
  });

  it('network failure during validatetxn does not settle', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ETIMEDOUT')));
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.verify({
      intent,
      raw: { query: { TXNID: 'intent-00000001' } },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/validatetxn|validation failed/i);
  });

  it('missing TXNID fails closed', async () => {
    const provider = new ConnectIpsProvider(config(), configService());
    const result = await provider.verify({
      intent: { ...intent, gatewayRef: null as any },
      raw: { query: {} },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/TXNID/);
  });
});
