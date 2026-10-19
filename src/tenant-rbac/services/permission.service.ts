import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class TenantPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    try {
      return await this.prisma.permission.create({ data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Permission code already exists');
      }
      throw e;
    }
  }

  async findAll(q: any) {
    const page = Number(q.page) || 1;
    const limit = Number(q.limit) || 20;
    const where: any = {};
    if (q.search) where.OR = [{ code: { contains: q.search, mode: 'insensitive' } }, { name: { contains: q.search, mode: 'insensitive' } }];
    if (q.category) where.category = q.category;
    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({ where, orderBy: { code: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.permission.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 } };
  }

  async findOne(idOrCode: string) {
    const p = await this.prisma.permission.findFirst({ where: { OR: [{ id: idOrCode }, { code: idOrCode }] } });
    if (!p) throw new NotFoundException('Permission not found');
    return p;
  }

  async update(idOrCode: string, dto: any) {
    const p = await this.findOne(idOrCode);
    return this.prisma.permission.update({ where: { id: p.id }, data: dto });
  }

  async remove(idOrCode: string) {
    const p = await this.findOne(idOrCode);
    const inUse = await this.prisma.rolePermission.count({ where: { permissionId: p.id } });
    if (inUse > 0) throw new ConflictException('Permission is in use by roles');
    await this.prisma.permission.delete({ where: { id: p.id } });
    return { deleted: true };
  }
}