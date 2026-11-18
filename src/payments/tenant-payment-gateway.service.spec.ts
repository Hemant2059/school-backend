import { BadRequestException, NotFoundException } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TenantPaymentGatewayService } from './tenant-payment-gateway.service.js';
import { decryptSecret, resetMasterKeyCacheForTests } from './crypto.js';

const TEST_KEY = Buffer.alloc(32, 3).toString('base64');

function makePrisma() {
  // In-memory stand-in for the config table, honouring the unique key.
  const stored: any[] = [];
  return {
    __stored: stored,
    tenantPaymentGatewayConfig: {
      findUnique: vi.fn(async ({ where }: any) => {
        const key = where?.tenantId_gateway;
        if (key) {
          return (
            stored.find(
              (r) => r.tenantId === key.tenantId && r.gateway === key.gateway,
            ) ?? null
          );
        }
        return stored.find((r) => r.id === where?.id) ?? null;
      }),
      findMany: vi.fn(async ({ where }: any) =>
        stored.filter((r) => !where?.tenantId || r.tenantId === where.tenantId),
      ),
      upsert: vi.fn(async ({ create, update }: any) => {
        const idx = stored.findIndex(
          (r) => r.tenantId === create.tenantId && r.gateway === create.gateway,
        );
        const row = {
          id: 'cfg-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...create,
          ...(idx >= 0 ? update : {}),
        };
        if (idx >= 0) stored[idx] = row;
        else stored.push(row);
        return row;
      }),
      delete: vi.fn(async ({ where }: any) => {
        const idx = stored.findIndex((r) => r.id === where?.id);
        if (idx >= 0) stored.splice(idx, 1);
        return {};
      }),
    },
  } as any;
}

describe('TenantPaymentGatewayService', () => {
  let prisma: any;
  let service: TenantPaymentGatewayService;

  beforeEach(() => {
    process.env.PAYMENT_CONFIG_MASTER_KEY = TEST_KEY;
    resetMasterKeyCacheForTests();
    prisma = makePrisma();
    service = new TenantPaymentGatewayService(prisma);
  });
  afterEach(() => {
    delete process.env.PAYMENT_CONFIG_MASTER_KEY;
    resetMasterKeyCacheForTests();
  });

  describe('upsert', () => {
    it('stores secrets encrypted and never returns them in clear', async () => {
      const result = await service.upsert('t1', 'ESEWA', {
        environment: 'sandbox',
        isEnabled: true,
        merchantId: 'SCHOOL1974',
        secretKey: 'school-secret-key-1974abcd',
      });

      const create =
        prisma.tenantPaymentGatewayConfig.upsert.mock.calls[0][0].create;
      expect(create.merchantIdEncrypted).toBeTruthy();
      expect(create.secretKeyEncrypted).toBeTruthy();
      expect(create.merchantIdEncrypted).not.toContain('SCHOOL1974');
      expect(create.secretKeyEncrypted).not.toContain('school-secret');
      // Round-trips through the crypto layer
      expect(decryptSecret(create.secretKeyEncrypted)).toBe(
        'school-secret-key-1974abcd',
      );
      expect(decryptSecret(create.merchantIdEncrypted)).toBe('SCHOOL1974');

      // Masked response only
      expect(JSON.stringify(result)).not.toContain(
        'school-secret-key-1974abcd',
      );
      expect((result as any).masked.secretKey).toBe('••••abcd');
      expect((result as any).masked.merchantId).toBe('••••1974');
    });

    it('refuses to enable an incomplete gateway', async () => {
      await expect(
        service.upsert('t1', 'KHALTI', {
          environment: 'sandbox',
          isEnabled: true,
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.tenantPaymentGatewayConfig.upsert).not.toHaveBeenCalled();
    });

    it('enables a gateway when its credentials are complete', async () => {
      const result = await service.upsert('t1', 'KHALTI', {
        environment: 'sandbox',
        isEnabled: true,
        secretKey: 'live_secret_key_12345678901234567890123456789012',
      });
      expect((result as any).configured).toBe(true);
    });

    it('keeps unspecified fields when updating (merge semantics)', async () => {
      // Prime the store with an existing row.
      const { encryptSecret } = await import('./crypto.js');
      prisma.__stored.push({
        id: 'cfg-1',
        tenantId: 't1',
        gateway: 'ESEWA',
        environment: 'sandbox',
        isEnabled: true,
        merchantIdEncrypted: encryptSecret('STORED_CODE'),
        appIdEncrypted: null,
        secretKeyEncrypted: encryptSecret('STORED_SECRET'),
        privateKeyPemEncrypted: null,
        appName: null,
        baseUrl: null,
        configuredByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.upsert('t1', 'ESEWA', { environment: 'production' });
      const update =
        prisma.tenantPaymentGatewayConfig.upsert.mock.calls[0][0].update;
      expect(update.environment).toBe('production');
      // untouched secrets are re-encrypted but resolve to the same plaintext
      expect(decryptSecret(update.merchantIdEncrypted)).toBe('STORED_CODE');
      expect(decryptSecret(update.secretKeyEncrypted)).toBe('STORED_SECRET');
    });
  });

  describe('list', () => {
    it('shows DEMO as configured and real gateways as unconfigured when nothing is stored', async () => {
      const { gateways } = await service.list('t1');
      const byName = Object.fromEntries(gateways.map((g: any) => [g.name, g]));
      expect(byName.DEMO.configured).toBe(true);
      expect(byName.ESEWA.configured).toBe(false);
      expect(byName.KHALTI.configured).toBe(false);
      expect(byName.CONNECTIPS.configured).toBe(false);
      expect(byName.ESEWA.source).toBe('none');
    });
  });

  describe('resolveForTenant', () => {
    it('returns the decrypted tenant config when present and enabled', async () => {
      const { encryptSecret } = await import('./crypto.js');
      prisma.tenantPaymentGatewayConfig.findUnique.mockResolvedValue({
        id: 'cfg-1',
        tenantId: 't1',
        gateway: 'ESEWA',
        environment: 'production',
        isEnabled: true,
        merchantIdEncrypted: encryptSecret('LIVECODE'),
        appIdEncrypted: null,
        secretKeyEncrypted: encryptSecret('LIVESECRET'),
        privateKeyPemEncrypted: null,
        appName: null,
        baseUrl: null,
        configuredByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const resolved = await service.resolveForTenant('t1', 'ESEWA');
      expect(resolved?.merchantId).toBe('LIVECODE');
      expect(resolved?.secretKey).toBe('LIVESECRET');
      expect(resolved?.environment).toBe('production');
    });

    it('returns null when the tenant disabled the gateway (no env fallback)', async () => {
      prisma.tenantPaymentGatewayConfig.findUnique.mockResolvedValue({
        id: 'cfg-1',
        tenantId: 't1',
        gateway: 'ESEWA',
        environment: 'sandbox',
        isEnabled: false,
        merchantIdEncrypted: null,
        appIdEncrypted: null,
        secretKeyEncrypted: null,
        privateKeyPemEncrypted: null,
        appName: null,
        baseUrl: null,
        configuredByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(await service.resolveForTenant('t1', 'ESEWA')).toBeNull();
    });

    it('returns DEMO sandbox config when no tenant row exists (DEMO works out of the box)', async () => {
      const resolved = await service.resolveForTenant('t1', 'DEMO');
      expect(resolved?.gateway).toBe('DEMO');
      expect(resolved?.environment).toBe('sandbox');
    });

    it('returns null for real gateways with no tenant row', async () => {
      expect(await service.resolveForTenant('t1', 'ESEWA')).toBeNull();
      expect(await service.resolveForTenant('t1', 'KHALTI')).toBeNull();
      expect(await service.resolveForTenant('t1', 'CONNECTIPS')).toBeNull();
    });
  });

  describe('remove', () => {
    it('deletes the tenant config row', async () => {
      prisma.tenantPaymentGatewayConfig.findUnique.mockResolvedValue({
        id: 'cfg-1',
      });
      const result = await service.remove('t1', 'ESEWA');
      expect(result.deleted).toBe(true);
      expect(prisma.tenantPaymentGatewayConfig.delete).toHaveBeenCalledWith({
        where: { id: 'cfg-1' },
      });
    });

    it('404s when nothing is configured', async () => {
      prisma.tenantPaymentGatewayConfig.findUnique.mockResolvedValue(null);
      await expect(service.remove('t1', 'ESEWA')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects an unknown gateway name', async () => {
      await expect(
        service.remove('t1', 'PAYPAL' as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
