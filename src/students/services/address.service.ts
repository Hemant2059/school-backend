import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: any) {
    return this.prisma.address.create({ data: { ...dto, tenantId } });
  }

  async findAll(tenantId: string) {
    return this.prisma.address.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(tenantId: string, id: string) {
    const address = await this.prisma.address.findFirst({ where: { id, tenantId, deletedAt: null } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.address.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.tenantId !== tenantId) throw new NotFoundException('Address not found');
    if (!address.deletedAt) throw new ConflictException('Address is not deleted');
    return this.prisma.address.update({ where: { id }, data: { deletedAt: null } });
  }
}