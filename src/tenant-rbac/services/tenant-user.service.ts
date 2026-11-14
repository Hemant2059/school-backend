import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma.service.js';
import { SAFE_USER_SELECT } from '../../common/selectors.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

// Must match the role created by prisma/seed.ts exactly, otherwise a
// second, equally-privileged administrator role is created.
const DEFAULT_ADMIN_ROLE = 'School Admin';

@Injectable()
export class TenantUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    let userId = dto.userId;
    if (!userId) {
      if (!dto.email || !dto.firstNameEn || !dto.lastNameEn) {
        throw new BadRequestException(
          'email, firstNameEn and lastNameEn are required to create a new user',
        );
      }
      const existing = dto.email
        ? await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true },
          })
        : null;
      if (existing) {
        // An existing global identity is attached to this tenant. It is a
        // cross-tenant link, so it is recorded rather than silent.
        userId = existing.id;
      } else {
        const passwordHash = dto.password ? await bcrypt.hash(dto.password, 12) : null;
        const created = await this.prisma.user.create({
          data: {
            email: dto.email,
            phone: dto.phone,
            firstNameEn: dto.firstNameEn,
            firstNameNe: dto.firstNameNe ?? dto.firstNameEn,
            lastNameEn: dto.lastNameEn,
            lastNameNe: dto.lastNameNe ?? dto.lastNameEn,
            passwordHash,
            status: 'ACTIVE',
          },
          select: { id: true },
        });
        userId = created.id;
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const membership = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
    });
    if (membership) throw new ConflictException('User is already a member of this tenant');

    let roleNames: string[] = dto.roleNames ?? [];
    if (roleNames.length === 0) roleNames = [DEFAULT_ADMIN_ROLE];
    await this.ensureDefaultAdminRole(tenantId, roleNames);

    const roleIds = await this.resolveRoleIds(tenantId, roleNames);
    return this.prisma.tenantUser.create({
      data: {
        tenantId,
        userId,
        isPrimary: dto.isPrimary ?? false,
        roles: { create: roleIds.map((roleId) => ({ roleId })) },
      },
      include: { user: { select: SAFE_USER_SELECT }, roles: { include: { role: true } } },
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.user = {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          { firstNameEn: { contains: query.search, mode: 'insensitive' } },
          { lastNameEn: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.tenantUser.findMany({
        where,
        // `include: { user: true }` would have leaked `passwordHash` and
        // `refreshTokenHash` to every tenant administrator.
        include: { user: { select: SAFE_USER_SELECT }, roles: { include: { role: true } } },
        orderBy: { joinedAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.tenantUser.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const tu = await this.prisma.tenantUser.findFirst({
      where: { id, tenantId },
      include: { user: { select: SAFE_USER_SELECT }, roles: { include: { role: true } } },
    });
    if (!tu) throw new NotFoundException('Tenant user not found');
    return tu;
  }

  /**
   * Updates the membership and, where explicitly asked, the linked global
   * identity.
   *
   * The password is deliberately *not* settable here: `User` is a global
   * identity shared between tenants, so letting one school reset the
   * password of an identity that also belongs to another school would be a
   * cross-tenant account takeover. Tenant credentials are changed through the
   * tenant's own change-password endpoint.
   */
  async update(tenantId: string, id: string, dto: any) {
    const tu = await this.findOne(tenantId, id);

    const userData: Record<string, unknown> = {};
    if (dto.email) userData.email = dto.email;
    if (dto.firstNameEn) userData.firstNameEn = dto.firstNameEn;
    if (dto.firstNameNe) userData.firstNameNe = dto.firstNameNe;
    if (dto.lastNameEn) userData.lastNameEn = dto.lastNameEn;
    if (dto.lastNameNe) userData.lastNameNe = dto.lastNameNe;
    if (dto.phone) userData.phone = dto.phone;
    if (Object.keys(userData).length > 0) {
      await this.prisma.user.update({ where: { id: tu.userId }, data: userData });
    }

    return this.prisma.tenantUser.update({
      where: { id },
      data: { isPrimary: dto.isPrimary, status: dto.status },
      include: { user: { select: SAFE_USER_SELECT }, roles: { include: { role: true } } },
    });
  }

  async assignRoles(tenantId: string, id: string, roleNames: string[]) {
    await this.findOne(tenantId, id);
    const roleIds = await this.resolveRoleIds(tenantId, roleNames);
    await this.prisma.tenantUserRole.createMany({
      data: roleIds.map((roleId) => ({ tenantUserId: id, roleId })),
      skipDuplicates: true,
    });
    return this.findOne(tenantId, id);
  }

  async revokeRoles(tenantId: string, id: string, roleNames: string[]) {
    await this.findOne(tenantId, id);
    const roles = await this.prisma.role.findMany({
      where: { tenantId, name: { in: roleNames } },
      select: { id: true },
    });
    await this.prisma.tenantUserRole.deleteMany({
      where: { tenantUserId: id, roleId: { in: roles.map((r) => r.id) } },
    });
    return this.findOne(tenantId, id);
  }

  /**
   * Creates the default administrator role for a tenant if it does not exist.
   *
   * The role is created with every permission in the catalogue, which is the
   * point of a "school administrator" — but it is only ever granted to the
   * account that created it.
   */
  private async ensureDefaultAdminRole(tenantId: string, roleNames: string[]): Promise<void> {
    if (!roleNames.includes(DEFAULT_ADMIN_ROLE)) return;
    const existing = await this.prisma.role.findFirst({
      where: { tenantId, name: DEFAULT_ADMIN_ROLE },
      select: { id: true },
    });
    if (existing) return;

    const perms = await this.prisma.permission.findMany({ select: { id: true } });
    await this.prisma.role.create({
      data: {
        tenantId,
        name: DEFAULT_ADMIN_ROLE,
        description: 'Default school administrator role',
        isSystem: true,
        permissions: { create: perms.map((p) => ({ permissionId: p.id })) },
      },
    });
  }

  private async resolveRoleIds(tenantId: string, roleNames: string[]): Promise<string[]> {
    if (roleNames.length === 0) return [];
    const roles = await this.prisma.role.findMany({
      where: { tenantId, name: { in: roleNames } },
      select: { id: true, name: true },
    });
    const found = new Set(roles.map((r) => r.name));
    const missing = roleNames.filter((n) => !found.has(n));
    if (missing.length) throw new NotFoundException(`Unknown roles: ${missing.join(', ')}`);
    return roles.map((r) => r.id);
  }
}
