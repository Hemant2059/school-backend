import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class PlatformPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { code: string; name: string; description?: string; category?: string }) {
    try {
      return await this.prisma.platformPermission.create({ data });
    } catch (error) {
      this.handleUniqueViolation(error, 'Permission code already exists');
      throw error;
    }
  }

  async findAll(query: { page: number; limit: number; search?: string; category?: string }) {
    const where: Prisma.PlatformPermissionWhereInput = {};
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = query.category;

    const [data, total] = await Promise.all([
      this.prisma.platformPermission.findMany({
        where,
        orderBy: { code: 'asc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.platformPermission.count({ where }),
    ]);
    return { data, meta: this.meta(total, query.page, query.limit) };
  }

  async findOne(codeOrId: string) {
    const permission = await this.prisma.platformPermission.findFirst({
      where: { OR: [{ id: codeOrId }, { code: codeOrId }] },
    });
    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(codeOrId: string, data: { name?: string; description?: string; category?: string }) {
    const permission = await this.findOne(codeOrId);
    return this.prisma.platformPermission.update({
      where: { id: permission.id },
      data,
    });
  }

  async remove(codeOrId: string) {
    const permission = await this.findOne(codeOrId);
    const inUse = await this.prisma.platformRolePermission.count({
      where: { permissionId: permission.id },
    });
    if (inUse > 0) {
      throw new ConflictException('Permission is assigned to one or more roles');
    }
    const directUse = await this.prisma.platformUserPermission.count({
      where: { permissionId: permission.id },
    });
    if (directUse > 0) {
      throw new ConflictException('Permission is assigned directly to one or more users');
    }
    await this.prisma.platformPermission.delete({ where: { id: permission.id } });
    return { deleted: true };
  }

  private meta(total: number, page: number, limit: number) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  private handleUniqueViolation(error: unknown, message: string): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException(message);
    }
  }
}