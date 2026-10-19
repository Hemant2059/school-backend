import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlatformPermissionsService } from './platform-permissions.service.js';
import { Prisma } from '../../generated/prisma/client.js';

function makePrisma() {
  return {
    platformPermission: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    platformRolePermission: { count: vi.fn() },
    platformUserPermission: { count: vi.fn() },
  } as any;
}

describe('PlatformPermissionsService', () => {
  let prisma: any;
  let service: PlatformPermissionsService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new PlatformPermissionsService(prisma);
  });

  it('creates a permission', async () => {
    prisma.platformPermission.create.mockResolvedValue({ id: '1', code: 'x.read' });
    const result = await service.create({ code: 'x.read', name: 'X Read' });
    expect(result.code).toBe('x.read');
  });

  it('throws ConflictException on duplicate code', async () => {
    const err = new (Prisma as any).PrismaClientKnownRequestError('unique', {
      code: 'P2002',
      clientVersion: '7.10.1',
      meta: { target: ['code'] },
    });
    prisma.platformPermission.create.mockRejectedValue(err);
    await expect(service.create({ code: 'x.read', name: 'X Read' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists with pagination and filters', async () => {
    prisma.platformPermission.findMany.mockResolvedValue([{ id: '1' }]);
    prisma.platformPermission.count.mockResolvedValue(1);
    const result = await service.findAll({ page: 1, limit: 10, search: 'read', category: 'schools' });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('finds by id or code', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue({ id: '1', code: 'x.read' });
    const result = await service.findOne('x.read');
    expect(result.code).toBe('x.read');
  });

  it('throws NotFoundException when missing', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a permission', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue({ id: '1', code: 'x.read' });
    prisma.platformPermission.update.mockResolvedValue({ id: '1', name: 'Updated' });
    const result = await service.update('x.read', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('refuses to delete a permission in use by roles', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue({ id: '1', code: 'x.read' });
    prisma.platformRolePermission.count.mockResolvedValue(2);
    await expect(service.remove('x.read')).rejects.toBeInstanceOf(ConflictException);
  });

  it('refuses to delete a permission in use by users', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue({ id: '1', code: 'x.read' });
    prisma.platformRolePermission.count.mockResolvedValue(0);
    prisma.platformUserPermission.count.mockResolvedValue(1);
    await expect(service.remove('x.read')).rejects.toBeInstanceOf(ConflictException);
  });

  it('deletes an unused permission', async () => {
    prisma.platformPermission.findFirst.mockResolvedValue({ id: '1', code: 'x.read' });
    prisma.platformRolePermission.count.mockResolvedValue(0);
    prisma.platformUserPermission.count.mockResolvedValue(0);
    prisma.platformPermission.delete.mockResolvedValue({});
    const result = await service.remove('x.read');
    expect(result.deleted).toBe(true);
  });
});