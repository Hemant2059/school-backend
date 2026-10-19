import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const existing = await this.prisma.role.findFirst({ where: { tenantId, name: dto.name, deletedAt: null } });
    if (existing) throw new ConflictException('Role name already exists for this tenant');

    const permissionIds = await this.resolvePermissionIds(dto.permissionCodes ?? []);
    const role = await this.prisma.role.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        isSystem: dto.isSystem ?? false,
        permissions: { create: permissionIds.map((permissionId) => ({ permissionId })) },
      },
      include: { permissions: { include: { permission: true } } },
    });
    return role;
  }

  async findAll(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId, deletedAt: null },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, idOrName: string) {
    const role = await this.prisma.role.findFirst({
      where: { tenantId, OR: [{ id: idOrName }, { name: idOrName }] },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(tenantId: string, idOrName: string, dto: any) {
    const role = await this.findOne(tenantId, idOrName);
    if (dto.name && dto.name !== role.name) {
      const dup = await this.prisma.role.findFirst({ where: { tenantId, name: dto.name, deletedAt: null } });
      if (dup) throw new ConflictException('Role name already exists for this tenant');
    }
    return this.prisma.role.update({
      where: { id: role.id },
      data: dto,
      include: { permissions: { include: { permission: true } } },
    });
  }

  async remove(tenantId: string, idOrName: string) {
    const role = await this.findOne(tenantId, idOrName);
    if (role.isSystem) throw new ConflictException('System roles cannot be deleted');
    if (role._count.users > 0) throw new ConflictException('Role is assigned to one or more users');
    await this.prisma.role.update({ where: { id: role.id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, idOrName: string) {
    const role = await this.prisma.role.findFirst({ where: { tenantId, OR: [{ id: idOrName }, { name: idOrName }] } });
    if (!role) throw new NotFoundException('Role not found');
    if (!role.deletedAt) throw new ConflictException('Role is not deleted');
    return this.prisma.role.update({ where: { id: role.id }, data: { deletedAt: null } });
  }

  async setPermissions(tenantId: string, idOrName: string, permissionCodes: string[], mode: 'replace' | 'add' | 'remove') {
    const role = await this.findOne(tenantId, idOrName);
    const permissionIds = await this.resolvePermissionIds(permissionCodes);
    if (mode === 'replace') {
      await this.prisma.$transaction([
        this.prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
        this.prisma.rolePermission.createMany({ data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })), skipDuplicates: true }),
      ]);
    } else if (mode === 'add') {
      await this.prisma.rolePermission.createMany({ data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })), skipDuplicates: true });
    } else {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: role.id, permissionId: { in: permissionIds } } });
    }
    return this.findOne(tenantId, role.id);
  }

  private async resolvePermissionIds(codes: string[]): Promise<string[]> {
    if (codes.length === 0) return [];
    const perms = await this.prisma.permission.findMany({ where: { code: { in: codes } }, select: { id: true, code: true } });
    const found = new Set(perms.map((p) => p.code));
    const missing = codes.filter((c) => !found.has(c));
    if (missing.length) throw new NotFoundException(`Unknown permissions: ${missing.join(', ')}`);
    return perms.map((p) => p.id);
  }
}