import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';
import { STUDENT_LIST_SELECT } from '../../common/selectors.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    // The plan's student limit is now enforced.
    const current = await this.prisma.student.count({
      where: { tenantId, deletedAt: null },
    });
    await this.entitlements.assertWithinLimit(tenantId, 'students.limit', current);

    try {
      return await this.prisma.student.create({ data: { ...dto, tenantId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Admission number already exists');
      }
      throw e;
    }
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Prisma.StudentWhereInput = { tenantId, deletedAt: null };
    if (query.search) {
      where.OR = [
        { admissionNo: { contains: query.search, mode: 'insensitive' } },
        { firstNameEn: { contains: query.search, mode: 'insensitive' } },
        { firstNameNe: { contains: query.search, mode: 'insensitive' } },
        { lastNameEn: { contains: query.search, mode: 'insensitive' } },
        { lastNameNe: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.gender) where.gender = query.gender;

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        // The list projection omits `nationalIdNin` and `birthCertificateNo`:
        // government identifiers should not be broadcast in a roster.
        select: STUDENT_LIST_SELECT,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.student.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(tenantId: string, id: string, dto: any) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.student.update({ where: { id }, data: dto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Admission number already exists');
      }
      throw e;
    }
  }

  async softDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.student.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student || student.tenantId !== tenantId) throw new NotFoundException('Student not found');
    if (!student.deletedAt) throw new ConflictException('Student is not deleted');
    return this.prisma.student.update({ where: { id }, data: { deletedAt: null } });
  }
}
