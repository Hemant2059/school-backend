import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomBytes, randomInt } from 'node:crypto';
import { PlatformUserStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';
import { PlatformPermissionsService } from './platform-permissions.service.js';
import { PlatformRolesService } from './platform-roles.service.js';

@Injectable()
export class PlatformUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesService: PlatformRolesService,
    private readonly permissionsService: PlatformPermissionsService,
  ) {}

  async create(dto: any) {
    await this.ensureUniqueIdentity(dto.email, dto.phone);

    const roleIds = await this.resolveRoleIds(dto.roleNames ?? []);
    const permissionIds = await this.resolvePermissionIds(dto.permissionCodes ?? []);

    // A platform user must be able to log in. Previously no password was
    // ever set, so every account created through the API was unusable.
    const temporaryPassword = dto.password ?? generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);
    const isTemporary = !dto.password;

    try {
      const user = await this.prisma.platformUser.create({
        data: {
          email: dto.email,
          firstNameEn: dto.firstNameEn,
          firstNameNe: dto.firstNameNe,
          lastNameEn: dto.lastNameEn,
          lastNameNe: dto.lastNameNe,
          phone: dto.phone,
          address: dto.address,
          passwordHash,
          status: dto.status ?? PlatformUserStatus.INVITED,
          twoFactorEnabled: dto.twoFactorEnabled ?? false,
          mustChangePassword: isTemporary ? true : (dto.mustChangePassword ?? false),
          invitationToken: isTemporary ? randomToken() : null,
          invitationExpiresAt: isTemporary ? new Date(Date.now() + 7 * 86_400_000) : null,
          roles: {
            create: roleIds.map((roleId) => ({ roleId })),
          },
          permissions: {
            create: permissionIds.map((permissionId) => ({ permissionId, granted: true })),
          },
        },
        select: this.defaultSelect(),
      });
      return {
        ...user,
        // Returned exactly once, so the administrator can hand it over.
        ...(isTemporary ? { temporaryPassword } : {}),
      };
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  /** Generates a strong temporary password, for handing over to a user. */
  generateTemporaryPassword(): string {
    return generateTemporaryPassword();
  }

  async findAll(query: any) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Prisma.PlatformUserWhereInput = {};
    if (!query.includeDeleted) where.deletedAt = null;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { firstNameEn: { contains: query.search, mode: 'insensitive' } },
        { firstNameNe: { contains: query.search, mode: 'insensitive' } },
        { lastNameEn: { contains: query.search, mode: 'insensitive' } },
        { lastNameNe: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.platformUser.findMany({
        where,
        select: this.defaultSelect(),
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.platformUser.count({ where }),
    ]);
    return { data, meta: this.meta(total, page, limit) };
  }

  async findOne(id: string, includeDeleted = false) {
    const user = await this.prisma.platformUser.findFirst({
      where: includeDeleted ? { id } : { id, deletedAt: null },
      select: this.defaultSelect(),
    });
    if (!user) throw new NotFoundException('Platform user not found');
    return user;
  }

  async update(id: string, dto: any) {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.ensureUniqueEmail(dto.email);
    }
    if (dto.phone && dto.phone !== user.phone) {
      await this.ensureUniquePhone(dto.phone);
    }

    const roleIds = dto.roleNames ? await this.resolveRoleIds(dto.roleNames) : null;
    const permissionIds = dto.permissionCodes ? await this.resolvePermissionIds(dto.permissionCodes) : null;

    try {
      const updated = await this.prisma.platformUser.update({
        where: { id: user.id },
        data: {
          email: dto.email,
          firstNameEn: dto.firstNameEn,
          firstNameNe: dto.firstNameNe,
          lastNameEn: dto.lastNameEn,
          lastNameNe: dto.lastNameNe,
          phone: dto.phone,
          address: dto.address,
          status: dto.status,
          twoFactorEnabled: dto.twoFactorEnabled,
          mustChangePassword: dto.mustChangePassword,
          ...(roleIds
            ? {
                roles: {
                  deleteMany: {},
                  create: roleIds.map((roleId) => ({ roleId })),
                },
              }
            : {}),
          ...(permissionIds
            ? {
                permissions: {
                  deleteMany: {},
                  create: permissionIds.map((permissionId) => ({ permissionId, granted: true })),
                },
              }
            : {}),
        },
        select: this.defaultSelect(),
      });
      return updated;
    } catch (error) {
      this.handleUniqueViolation(error);
      throw error;
    }
  }

  async softDelete(id: string) {
    const user = await this.findOne(id);
    await this.prisma.platformUser.update({
      where: { id: user.id },
      data: { deletedAt: new Date(), status: PlatformUserStatus.DEACTIVATED },
    });
    return { deleted: true };
  }

  async hardDelete(id: string) {
    await this.findOne(id, true);
    await this.prisma.platformUser.delete({ where: { id } });
    return { deleted: true, permanent: true };
  }

  async restore(id: string) {
    const user = await this.prisma.platformUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Platform user not found');
    if (!user.deletedAt) throw new ConflictException('User is not deleted');
    return this.prisma.platformUser.update({
      where: { id },
      data: { deletedAt: null, status: PlatformUserStatus.ACTIVE },
      select: this.defaultSelect(),
    });
  }

  async assignRoles(id: string, roleNames: string[]) {
    const user = await this.findOne(id);
    const roleIds = await this.resolveRoleIds(roleNames);
    await this.prisma.platformUserRole.createMany({
      data: roleIds.map((roleId) => ({ userId: user.id, roleId })),
      skipDuplicates: true,
    });
    return this.findOne(user.id);
  }

  async revokeRoles(id: string, roleNames: string[]) {
    const user = await this.findOne(id);
    const roles = await this.prisma.platformRole.findMany({
      where: { name: { in: roleNames } },
      select: { id: true },
    });
    await this.prisma.platformUserRole.deleteMany({
      where: { userId: user.id, roleId: { in: roles.map((r) => r.id) } },
    });
    return this.findOne(user.id);
  }

  async overridePermissions(id: string, permissionCodes: string[], granted: boolean) {
    const user = await this.findOne(id);
    const permissionIds = await this.resolvePermissionIds(permissionCodes);
    await this.prisma.$transaction(
      permissionIds.map((permissionId) =>
        this.prisma.platformUserPermission.upsert({
          where: { userId_permissionId: { userId: user.id, permissionId } },
          update: { granted },
          create: { userId: user.id, permissionId, granted },
        }),
      ),
    );
    return this.findOne(user.id);
  }

  async removePermissionOverride(id: string, permissionCode: string) {
    const user = await this.findOne(id);
    const permission = await this.prisma.platformPermission.findUnique({
      where: { code: permissionCode },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    await this.prisma.platformUserPermission.deleteMany({
      where: { userId: user.id, permissionId: permission.id },
    });
    return this.findOne(user.id);
  }

  private async ensureUniqueIdentity(email: string, phone?: string) {
    await this.ensureUniqueEmail(email);
    if (phone) await this.ensureUniquePhone(phone);
  }

  private async ensureUniqueEmail(email: string) {
    const existing = await this.prisma.platformUser.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already in use');
  }

  private async ensureUniquePhone(phone: string) {
    const existing = await this.prisma.platformUser.findUnique({ where: { phone } });
    if (existing) throw new ConflictException('Phone already in use');
  }

  private async resolveRoleIds(roleNames: string[]): Promise<string[]> {
    if (roleNames.length === 0) return [];
    const roles = await this.prisma.platformRole.findMany({
      where: { name: { in: roleNames } },
      select: { id: true, name: true },
    });
    const found = new Set(roles.map((r) => r.name));
    const missing = roleNames.filter((name) => !found.has(name));
    if (missing.length) throw new NotFoundException(`Unknown roles: ${missing.join(', ')}`);
    return roles.map((r) => r.id);
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

  /**
   * The platform user projection.
   *
   * The previous implementation used `include` for the relations, which
   * returned *every* scalar column of the user - including `passwordHash`,
   * `twoFactorSecret` (the TOTP seed) and `refreshTokenHash` - to anyone
   * with `platform_users.read`.
   */
  private defaultSelect() {
    return {
      id: true,
      email: true,
      phone: true,
      status: true,
      firstNameEn: true,
      firstNameNe: true,
      middleNameEn: true,
      middleNameNe: true,
      lastNameEn: true,
      lastNameNe: true,
      address: true,
      emailVerifiedAt: true,
      phoneVerifiedAt: true,
      twoFactorEnabled: true,
      lastLoginAt: true,
      mustChangePassword: true,
      passwordChangedAt: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      permissions: { include: { permission: true } },
    } as const;
  }

  private meta(total: number, page: number, limit: number) {
    return buildMeta(total, page, limit);
  }

  private handleUniqueViolation(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = (error.meta?.target as string[] | undefined)?.join(', ');
      throw new ConflictException(`Unique constraint violated: ${target ?? 'field'}`);
    }
  }
}

/**
 * Generates a strong temporary password for an invited user.
 * It contains upper case, lower case, digits and symbols so it satisfies
 * any reasonable password policy.
 */
export function generateTemporaryPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*()-_=+';
  const all = upper + lower + digits + symbols;

  const pick = (set: string) => set[randomInt(set.length)];
  const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  for (let i = chars.length; i < 20; i++) chars.push(pick(all));

  // Fisher-Yates so the guaranteed characters are not always in front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

function randomToken(): string {
  return randomBytes(32).toString('hex');
}
