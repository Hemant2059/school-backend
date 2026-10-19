import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlatformRolesService } from './platform-roles.service.js';
import { Prisma } from '../../generated/prisma/client.js';

function makePrisma() {
  return {
    platformRole: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    platformPermission: { findMany: vi.fn() },
    platformRolePermission: { deleteMany: vi.fn(), createMany: vi.fn() },
    $transaction: vi.fn((ops: any[]) => Promise.all(ops)),
  } as any;
}

describe('PlatformRolesService', () => {
  let prisma: any;
  let service: PlatformRolesService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new PlatformRolesService(prisma, {} as any);
  });

  it('creates a role with permissions', async () => {
    prisma.platformRole.findFirst.mockResolvedValue(null);
    prisma.platformPermission.findMany.mockResolvedValue([{ id: 'p1', code: 'schools.read' }]);
    prisma.platformRole.create.mockResolvedValue({ id: 'r1', name: 'Support' });
    const result = await service.create({ name: 'Support', permissionCodes: ['schools.read'] });
    expect(result.name).toBe('Support');
  });

  it('throws ConflictException on duplicate role name', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1' });
    await expect(service.create({ name: 'Support' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException for unknown permissions', async () => {
    prisma.platformRole.findFirst.mockResolvedValue(null);
    prisma.platformPermission.findMany.mockResolvedValue([]);
    await expect(service.create({ name: 'Support', permissionCodes: ['nope'] })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lists roles with filters', async () => {
    prisma.platformRole.findMany.mockResolvedValue([{ id: 'r1' }]);
    prisma.platformRole.count.mockResolvedValue(1);
    const result = await service.findAll({ page: 1, limit: 10, search: 'sup', isSystem: true });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('finds a role', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Support', _count: { users: 0 } });
    const result = await service.findOne('Support');
    expect(result.name).toBe('Support');
  });

  it('throws NotFoundException when role missing', async () => {
    prisma.platformRole.findFirst.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a role name with duplicate check', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Support', _count: { users: 0 } });
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r2' });
    await expect(service.update('Support', { name: 'Admin' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('updates a role successfully', async () => {
    prisma.platformRole.findFirst.mockResolvedValueOnce({ id: 'r1', name: 'Support', _count: { users: 0 } });
    prisma.platformRole.findFirst.mockResolvedValueOnce(null);
    prisma.platformRole.update.mockResolvedValue({ id: 'r1', name: 'Support2' });
    const result = await service.update('Support', { name: 'Support2' });
    expect(result.name).toBe('Support2');
  });

  it('refuses to delete a system role', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Super Admin', isSystem: true, _count: { users: 0 } });
    await expect(service.remove('Super Admin')).rejects.toBeInstanceOf(ConflictException);
  });

  it('refuses to delete a role in use', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Support', isSystem: false, _count: { users: 2 } });
    await expect(service.remove('Support')).rejects.toBeInstanceOf(ConflictException);
  });

  it('deletes an unused non-system role', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Support', isSystem: false, _count: { users: 0 } });
    prisma.platformRole.delete.mockResolvedValue({});
    const result = await service.remove('Support');
    expect(result.deleted).toBe(true);
  });

  it('replaces permissions on a role', async () => {
    prisma.platformRole.findFirst.mockResolvedValue({ id: 'r1', name: 'Support', _count: { users: 0 } });
    prisma.platformPermission.findMany.mockResolvedValue([{ id: 'p1', code: 'schools.read' }]);
    prisma.platformRolePermission.deleteMany.mockResolvedValue({});
    prisma.platformRolePermission.createMany.mockResolvedValue({});
    prisma.platformRole.findFirst
      .mockResolvedValueOnce({ id: 'r1', name: 'Support', _count: { users: 0 } })
      .mockResolvedValueOnce({ id: 'r1', name: 'Support', permissions: [] });
    const result = await service.setPermissions('Support', ['schools.read'], 'replace');
    expect(result.id).toBe('r1');
  });
});