import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { PlatformPermissionsService } from './platform-permissions.service.js';

@Injectable()
export class PlatformRolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionsService: PlatformPermissionsService,
  ) {}

  async create(dto: {
    name: string;
    description?: string;
    isSystem?: boolean;
    permissionCodes?: string[];
  }) {
    const existing = await this.prisma.platformRole.findFirst({ where: { name: dto.name, deletedAt: null } });
    if (existing) throw new ConflictException('Role name already exists');

    const permissionIds = await this.resolvePermissionIds(dto.permissionCodes ?? []);

    const role = await this.prisma.platformRole.create({
      data: {
        name: dto.name,
        description: dto.description,
        isSystem: dto.isSystem ?? false,
        permissions: {
          create: permissionIds.map((permissionId) => ({ permissionId })),
        },
      },
      include: { permissions: { include: { permission: true } } },
    });
    return role;
  }

  async findAll(query: { page: number; limit: number; search?: string; isSystem?: boolean }) {
    const where: Prisma.PlatformRoleWhereInput = { deletedAt: null };
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isSystem !== undefined) where.isSystem = query.isSystem;

    const [data, total] = await Promise.all([
      this.prisma.platformRole.findMany({
        where,
        include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
        orderBy: { name: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.platformRole.count({ where }),
    ]);
    return { data, meta: this.meta(total, query.page, query.limit) };
  }

  async findOne(idOrName: string) {
    const role = await this.prisma.platformRole.findFirst({
      where: { OR: [{ id: idOrName }, { name: idOrName }] },
      include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } },
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(idOrName: string, dto: { name?: string; description?: string; isSystem?: boolean }) {
    const role = await this.findOne(idOrName);
    if (dto.name && dto.name !== role.name) {
      const duplicate = await this.prisma.platformRole.findFirst({ where: { name: dto.name, deletedAt: null } });
      if (duplicate) throw new ConflictException('Role name already exists');
    }
    return this.prisma.platformRole.update({
      where: { id: role.id },
      data: dto,
      include: { permissions: { include: { permission: true } } },
    });
  }

  async remove(idOrName: string) {
    const role = await this.findOne(idOrName);
    if (role.isSystem) throw new ConflictException('System roles cannot be deleted');
    if (role._count.users > 0) {
      throw new ConflictException('Role is assigned to one or more users');
    }
    await this.prisma.platformRole.update({ where: { id: role.id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(idOrName: string) {
    const role = await this.prisma.platformRole.findFirst({ where: { OR: [{ id: idOrName }, { name: idOrName }] } });
    if (!role) throw new NotFoundException('Role not found');
    if (!role.deletedAt) throw new ConflictException('Role is not deleted');
    return this.prisma.platformRole.update({ where: { id: role.id }, data: { deletedAt: null } });
  }

  async setPermissions(idOrName: string, permissionCodes: string[], mode: 'replace' | 'add' | 'remove' = 'replace') {
    const role = await this.findOne(idOrName);
    const permissionIds = await this.resolvePermissionIds(permissionCodes);

    if (mode === 'replace') {
      await this.prisma.$transaction([
        this.prisma.platformRolePermission.deleteMany({ where: { roleId: role.id } }),
        this.prisma.platformRolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })),
          skipDuplicates: true,
        }),
      ]);
    } else if (mode === 'add') {
      await this.prisma.platformRolePermission.createMany({
        data: permissionIds.map((permissionId) => ({ roleId: role.id, permissionId })),
        skipDuplicates: true,
      });
    } else {
      await this.prisma.platformRolePermission.deleteMany({
        where: { roleId: role.id, permissionId: { in: permissionIds } },
      });
    }

    return this.findOne(role.id);
  }

  private async resolvePermissionIds(codes: string[]): Promise<string[]> {
    if (codes.length === 0) return [];
    const permissions = await this.prisma.platformPermission.findMany({
      where: { code: { in: codes } },
      select: { id: true, code: true },
    });
    const found = new Set(permissions.map((p) => p.code));
    const missing = codes.filter((c) => !found.has(c));
    if (missing.length) throw new NotFoundException(`Unknown permissions: ${missing.join(', ')}`);
    return permissions.map((p) => p.id);
  }

  private meta(total: number, page: number, limit: number) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }
}