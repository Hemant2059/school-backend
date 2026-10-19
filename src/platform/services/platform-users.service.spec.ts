import { ConflictException, NotFoundException } from '@nestjs/common';
import { PlatformUserStatus } from '../../generated/prisma/client.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlatformUsersService } from './platform-users.service.js';
import { Prisma } from '../../generated/prisma/client.js';

function makePrisma() {
  return {
    platformUser: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    platformRole: { findMany: vi.fn() },
    platformPermission: { findMany: vi.fn(), findUnique: vi.fn() },
    platformUserRole: { createMany: vi.fn(), deleteMany: vi.fn() },
    platformUserPermission: { upsert: vi.fn(), deleteMany: vi.fn(), count: vi.fn() },
    $transaction: vi.fn((ops: any) => (Array.isArray(ops) ? Promise.all(ops) : ops())),
  } as any;
}

const baseUser = {
  id: 'u1',
  email: 'a@test.com',
  firstNameEn: 'Alice',
  firstNameNe: 'एलिस',
  lastNameEn: 'Test',
  lastNameNe: 'टेस्ट',
  phone: null,
  status: PlatformUserStatus.ACTIVE,
  deletedAt: null,
  roles: [],
  permissions: [],
};

describe('PlatformUsersService', () => {
  let prisma: any;
  let service: PlatformUsersService;

  beforeEach(() => {
    prisma = makePrisma();
    service = new PlatformUsersService(prisma, {} as any, {} as any);
  });

  it('creates a user', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(null);
    prisma.platformRole.findMany.mockResolvedValue([]);
    prisma.platformPermission.findMany.mockResolvedValue([]);
    prisma.platformUser.create.mockResolvedValue(baseUser);
    const result = await service.create({ email: 'a@test.com', firstNameEn: 'Alice', firstNameNe: 'एलिस', lastNameEn: 'Test', lastNameNe: 'टेस्ट' });
    expect(result.id).toBe('u1');
  });

  it('throws ConflictException on duplicate email', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(baseUser);
    await expect(service.create({ email: 'a@test.com', firstNameEn: 'Alice', firstNameNe: 'एलिस', lastNameEn: 'Test', lastNameNe: 'टेस्ट' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFoundException for unknown roles', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(null);
    prisma.platformRole.findMany.mockResolvedValue([]);
    await expect(service.create({ email: 'b@test.com', firstNameEn: 'Bob', firstNameNe: 'बब', lastNameEn: 'Test', lastNameNe: 'टेस्ट', roleNames: ['Nope'] })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws NotFoundException for unknown permissions', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(null);
    prisma.platformRole.findMany.mockResolvedValue([]);
    prisma.platformPermission.findMany.mockResolvedValue([]);
    await expect(service.create({ email: 'c@test.com', firstNameEn: 'Cara', firstNameNe: 'कारा', lastNameEn: 'Test', lastNameNe: 'टेस्ट', permissionCodes: ['nope'] })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('handles unique violation on create', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(null);
    prisma.platformRole.findMany.mockResolvedValue([]);
    prisma.platformPermission.findMany.mockResolvedValue([]);
    const err = new (Prisma as any).PrismaClientKnownRequestError('unique', {
      code: 'P2002',
      clientVersion: '7.10.1',
      meta: { target: ['email'] },
    });
    prisma.platformUser.create.mockRejectedValue(err);
    await expect(service.create({ email: 'd@test.com', firstNameEn: 'Dan', firstNameNe: 'ड्यान', lastNameEn: 'Test', lastNameNe: 'टेस्ट' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists users with filters and pagination', async () => {
    prisma.platformUser.findMany.mockResolvedValue([baseUser]);
    prisma.platformUser.count.mockResolvedValue(1);
    const result = await service.findAll({ page: 1, limit: 10, search: 'ali', status: PlatformUserStatus.ACTIVE, includeDeleted: false });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('excludes soft-deleted users by default', async () => {
    prisma.platformUser.findMany.mockResolvedValue([]);
    prisma.platformUser.count.mockResolvedValue(0);
    await service.findAll({ page: 1, limit: 10, includeDeleted: false });
    expect(prisma.platformUser.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ deletedAt: null }) }),
    );
  });

  it('finds a user by id', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    const result = await service.findOne('u1');
    expect(result.id).toBe('u1');
  });

  it('throws NotFoundException when user missing', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates a user', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformUser.findUnique.mockResolvedValue(null);
    prisma.platformUser.update.mockResolvedValue({ ...baseUser, firstNameEn: 'Alice2' });
    const result = await service.update('u1', { firstNameEn: 'Alice2' });
    expect(result.firstNameEn).toBe('Alice2');
  });

  it('throws ConflictException on duplicate email update', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformUser.findUnique.mockResolvedValue({ id: 'u2', email: 'taken@test.com' });
    await expect(service.update('u1', { email: 'taken@test.com' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('soft deletes a user', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformUser.update.mockResolvedValue({});
    const result = await service.softDelete('u1');
    expect(result.deleted).toBe(true);
  });

  it('restores a deleted user', async () => {
    prisma.platformUser.findUnique.mockResolvedValue({ ...baseUser, deletedAt: new Date() });
    prisma.platformUser.update.mockResolvedValue({ ...baseUser, deletedAt: null });
    const result = await service.restore('u1');
    expect(result.deletedAt).toBeNull();
  });

  it('throws ConflictException when restoring non-deleted user', async () => {
    prisma.platformUser.findUnique.mockResolvedValue(baseUser);
    await expect(service.restore('u1')).rejects.toBeInstanceOf(ConflictException);
  });

  it('assigns roles to a user', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformRole.findMany.mockResolvedValue([{ id: 'r1', name: 'Admin' }]);
    prisma.platformUserRole.createMany.mockResolvedValue({});
    prisma.platformUser.findFirst.mockResolvedValueOnce(baseUser).mockResolvedValueOnce({ ...baseUser, roles: [{ role: { name: 'Admin' } }] });
    const result = await service.assignRoles('u1', ['Admin']);
    expect(result.id).toBe('u1');
  });

  it('throws NotFoundException when assigning unknown roles', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformRole.findMany.mockResolvedValue([]);
    await expect(service.assignRoles('u1', ['Nope'])).rejects.toBeInstanceOf(NotFoundException);
  });

  it('revokes roles from a user', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformRole.findMany.mockResolvedValue([{ id: 'r1' }]);
    prisma.platformUserRole.deleteMany.mockResolvedValue({});
    prisma.platformUser.findFirst.mockResolvedValueOnce(baseUser).mockResolvedValueOnce(baseUser);
    const result = await service.revokeRoles('u1', ['Admin']);
    expect(result.id).toBe('u1');
  });

  it('overrides permissions for a user', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformPermission.findMany.mockResolvedValue([{ id: 'p1', code: 'schools.read' }]);
    prisma.platformUserPermission.upsert.mockResolvedValue({});
    prisma.platformUser.findFirst.mockResolvedValueOnce(baseUser).mockResolvedValueOnce(baseUser);
    const result = await service.overridePermissions('u1', ['schools.read'], true);
    expect(result.id).toBe('u1');
  });

  it('throws NotFoundException for unknown permission override', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformPermission.findMany.mockResolvedValue([]);
    await expect(service.overridePermissions('u1', ['nope'], true)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes a permission override', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformPermission.findUnique.mockResolvedValue({ id: 'p1', code: 'schools.read' });
    prisma.platformUserPermission.deleteMany.mockResolvedValue({});
    prisma.platformUser.findFirst.mockResolvedValueOnce(baseUser).mockResolvedValueOnce(baseUser);
    const result = await service.removePermissionOverride('u1', 'schools.read');
    expect(result.id).toBe('u1');
  });

  it('throws NotFoundException when removing unknown permission override', async () => {
    prisma.platformUser.findFirst.mockResolvedValue(baseUser);
    prisma.platformPermission.findUnique.mockResolvedValue(null);
    await expect(service.removePermissionOverride('u1', 'nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});