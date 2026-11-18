import { describe, expect, it } from 'vitest';
import { DemoProvider } from './demo.provider.js';
import type { ResolvedGatewayConfig } from './resolved-config.js';

const config: ResolvedGatewayConfig = {
  gateway: 'DEMO',
  environment: 'sandbox',
};
const intent = {
  id: 'intent-1',
  amount: 93500,
  gatewayRef: 'DEMO-ref-1',
  paymentDateBs: '2082-08-04',
};
const configService: any = { get: () => 'http://localhost:3000' };

describe('DemoProvider', () => {
  it('returns a DEMO-prefixed transaction ref and a checkout hint', async () => {
    const provider = new DemoProvider(config, configService);
    const result = await provider.initiate({
      intentId: 'intent-1',
      amount: 93500,
    });
    expect(result.gatewayRef).toMatch(/^DEMO-/);
    expect(result.payload.transactionRef).toBe(result.gatewayRef);
    expect(result.payload.mock).toBe(true);
    expect(String(result.payload.checkoutUrl)).toContain(
      '/payments/gateways/demo/checkout',
    );
    expect(String(result.payload.checkoutUrl)).toContain('intent=intent-1');
  });

  it('verify approves by default and echoes the intent amount', async () => {
    const provider = new DemoProvider(config, configService);
    const result = await provider.verify({ intent, raw: { query: {} } });
    expect(result.ok).toBe(true);
    expect(result.amount).toBe(93500);
  });

  it('verify fails when asked to decline the payment (and marks it authentic)', async () => {
    const provider = new DemoProvider(config, configService);
    const result = await provider.verify({
      intent,
      raw: { query: { fail: 'true' } },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/declined/i);
    expect(result.payload).toBeDefined(); // authentic → intent may be marked FAILED
  });

  it('verify fails identically via the JSON body flag', async () => {
    const provider = new DemoProvider(config, configService);
    const result = await provider.verify({
      intent,
      raw: { body: { fail: true } },
    });
    expect(result.ok).toBe(false);
  });
});
