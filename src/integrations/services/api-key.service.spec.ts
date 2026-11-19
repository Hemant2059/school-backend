import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiKeyService } from './api-key.service.js';

function makePrisma() {
  const stored: any[] = [];
  return {
    __stored: stored,
    apiKey: {
      create: vi.fn(async ({ data }: any) => {
        const row = { id: `key-${stored.length + 1}`, createdAt: new Date(), updatedAt: new Date(), ...data };
        stored.push(row);
        return row;
      }),
      findMany: vi.fn(async ({ where, select }: any) => {
        let rows = stored;
        if (where?.tenantId) rows = rows.filter((r) => r.tenantId === where.tenantId);
        if (where?.prefix) rows = rows.filter((r) => r.prefix === where.prefix);
        if (select) {
          return rows.map((r) => {
            const out: any = {};
            for (const key of Object.keys(select)) if (select[key]) out[key] = r[key];
            return out;
          });
        }
        return rows;
      }),
      findFirst: vi.fn(async ({ where }: any) => {
        return stored.find((r) => r.id === where?.id && (!where.tenantId || r.tenantId === where.tenantId)) ?? null;
      }),
      update: vi.fn(async ({ where, data }: any) => {
        const idx = stored.findIndex((r) => r.id === where.id);
        if (idx >= 0) stored[idx] = { ...stored[idx], ...data };
        return stored[idx];
      }),
    },
    subscription: {
      findFirst: vi.fn(async () => ({ status: 'ACTIVE', endDate: new Date(Date.now() + 365 * 86400000) })),
    },
  } as any;
}

describe('ApiKeyService', () => {
  let prisma: any;
  let service: ApiKeyService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new ApiKeyService(prisma);
  });

  it('creates a key, returns the raw secret once, and never lists it', async () => {
    const created = await service.create('t1', { name: 'Zapier' });
    expect(created.key).toMatch(/^sk_[A-Za-z0-9_-]{32,}$/);
    expect(created.prefix).toBe(created.key.slice(0, 12));

    const listed = await service.list('t1');
    expect(listed).toHaveLength(1);
    expect(JSON.stringify(listed)).not.toContain(created.key);
    expect(listed[0].prefix).toBe(created.prefix);
  });

  it('authenticates a raw key and returns a read-only tenant principal', async () => {
    const created = await service.create('t1', { name: 'CI' });
    const principal = await service.authenticate(created.key);
    expect(principal).not.toBeNull();
    expect(principal!.type).toBe('tenant');
    expect(principal!.tenantId).toBe('t1');
    expect(principal!.apiKeyId).toBe('key-1');
    // Read-only: management surfaces are not granted.
    expect(principal!.permissions).toContain('students.read');
    expect(principal!.permissions).toContain('fee_invoices.read');
    expect(principal!.permissions.some((p: string) => p.endsWith('.manage') || p.endsWith('.manage_all'))).toBe(false);
    expect(principal!.permissions).not.toContain('integrations.manage');
    expect(principal!.permissions).not.toContain('integrations.read');
    expect(principal!.permissions).not.toContain('roles.read');
    expect(principal!.permissions).not.toContain('permissions.read');
    expect(principal!.permissions).not.toContain('tenant_users.read');
    expect(principal!.permissions).not.toContain('hr.read');
    expect(principal!.permissions).not.toContain('staff.read');
    expect(principal!.permissions).not.toContain('teachers.read');
    expect(principal!.permissions).not.toContain('addresses.read');
    expect(principal!.permissions).not.toContain('payment_gateways.read');
  });

  it('rejects an unknown key and a revoked key', async () => {
    expect(await service.authenticate('sk_unknownkey000000000000000000000000000000')).toBeNull();

    const created = await service.create('t1', { name: 'temp' });
    await service.revoke('t1', 'key-1');
    expect(await service.authenticate(created.key)).toBeNull();
  });

  it('rejects a key that has expired', async () => {
    const created = await service.create('t1', { name: 'short-lived', expiresInDays: -1 });
    expect(await service.authenticate(created.key)).toBeNull();
  });

  it('revoke is idempotent and scoped to the tenant', async () => {
    const created = await service.create('t1', { name: 'scoped' });
    const result = await service.revoke('t1', 'key-1');
    expect(result.revoked).toBe(true);
    // Revoking another tenant's key must not work.
    await expect(service.revoke('other-tenant', 'key-1')).rejects.toBeInstanceOf(NotFoundException);
    void created;
  });

  it('rejects a malformed key without touching the database', async () => {
    expect(await service.authenticate('')).toBeNull();
    expect(await service.authenticate('not-a-key')).toBeNull();
    expect(await service.authenticate('sk_short')).toBeNull();
    expect(prisma.apiKey.findMany).not.toHaveBeenCalled();
  });
});
