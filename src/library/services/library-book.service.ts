import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class LibraryBookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.prisma.libraryBook.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.libraryBook.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const book = await this.prisma.libraryBook.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!book) throw new NotFoundException('Library book not found');
    return book;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.libraryBook.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.libraryBook.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const book = await this.prisma.libraryBook.findUnique({ where: { id } });
    if (!book || book.tenantId !== tenantId) throw new NotFoundException('Library book not found');
    if (!book.deletedAt) throw new ConflictException('Library book is not deleted');
    return this.prisma.libraryBook.update({ where: { id }, data: { deletedAt: null } });
  }
}