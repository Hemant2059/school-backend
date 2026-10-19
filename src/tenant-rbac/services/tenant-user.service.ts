import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    let userId = dto.userId;
    if (!userId) {
      if (!dto.email || !dto.firstNameEn || !dto.lastNameEn) {
        throw new BadRequestException('email, firstNameEn and lastNameEn are required to create a new user');
      }
      const existing = dto.email ? await this.prisma.user.findUnique({ where: { email: dto.email } }) : null;
      if (existing) {
        userId = existing.id;
      } else {
        const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : null;
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
        });
        userId = created.id;
      }
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const membership = await this.prisma.tenantUser.findUnique({ where: { tenantId_userId: { tenantId, userId } } });
    if (membership) throw new ConflictException('User is already a member of this tenant');

    const roleIds = await this.resolveRoleIds(tenantId, dto.roleNames ?? []);
    const tu = await this.prisma.tenantUser.create({
      data: {
        tenantId,
        userId,
        isPrimary: dto.isPrimary ?? false,
        roles: { create: roleIds.map((roleId) => ({ roleId })) },
      },
      include: { user: true, roles: { include: { role: true } } },
    });
    return tu;
  }

  async findAll(tenantId: string) {
    return this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: { user: true, roles: { include: { role: true } } },
      orderBy: { joinedAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const tu = await this.prisma.tenantUser.findFirst({
      where: { id, tenantId },
      include: { user: true, roles: { include: { role: true } } },
    });
    if (!tu) throw new NotFoundException('Tenant user not found');
    return tu;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.tenantUser.update({
      where: { id },
      data: { isPrimary: dto.isPrimary, status: dto.status },
      include: { user: true, roles: { include: { role: true } } },
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
    const roles = await this.prisma.role.findMany({ where: { tenantId, name: { in: roleNames } }, select: { id: true } });
    await this.prisma.tenantUserRole.deleteMany({ where: { tenantUserId: id, roleId: { in: roles.map((r) => r.id) } } });
    return this.findOne(tenantId, id);
  }

  private async resolveRoleIds(tenantId: string, roleNames: string[]): Promise<string[]> {
    if (roleNames.length === 0) return [];
    const roles = await this.prisma.role.findMany({ where: { tenantId, name: { in: roleNames } }, select: { id: true, name: true } });
    const found = new Set(roles.map((r) => r.name));
    const missing = roleNames.filter((n) => !found.has(n));
    if (missing.length) throw new NotFoundException(`Unknown roles: ${missing.join(', ')}`);
    return roles.map((r) => r.id);
  }
}