import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BookIssueStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { buildMeta, resolvePagination } from '../../common/utils/pagination.js';

@Injectable()
export class BookIssueService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Issues a book to a student.
   *
   * The available copy count was never decremented, so a single-copy book
   * could be issued to a hundred students at once.
   */
  async create(tenantId: string, dto: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const book = await this.prisma.libraryBook.findFirst({
      where: { id: dto.bookId, tenantId, deletedAt: null },
    });
    if (!book) throw new NotFoundException('Library book not found');

    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId, deletedAt: null },
    });
    if (!student) throw new NotFoundException('Student not found');

    if (book.availableCopies <= 0) {
      throw new ConflictException(`No copy of "${book.titleEn}" is currently available`);
    }

    // A student may not hold the same book twice.
    const outstanding = await this.prisma.bookIssue.findFirst({
      where: {
        tenantId,
        bookId: dto.bookId,
        studentId: dto.studentId,
        status: { in: [BookIssueStatus.ISSUED, BookIssueStatus.OVERDUE] },
        deletedAt: null,
      },
      select: { id: true },
    });
    if (outstanding) {
      throw new ConflictException('This student already has this book on loan');
    }

    return this.prisma.$transaction(async (tx) => {
      const issue = await tx.bookIssue.create({
        data: {
          ...dto,
          tenantId,
          status: dto.status ?? BookIssueStatus.ISSUED,
          fineAmount: dto.fineAmount ?? 0,
        },
        include: { book: true, student: true },
      });

      const updated = await tx.libraryBook.update({
        where: { id: dto.bookId },
        data: { availableCopies: { decrement: 1 } },
        select: { id: true, availableCopies: true },
      });
      if (updated.availableCopies < 0) {
        throw new ConflictException(`No copy of "${book.titleEn}" is currently available`);
      }

      return issue;
    });
  }

  async findAll(tenantId: string, query: Record<string, any> = {}) {
    const { page, limit, skip, take } = resolvePagination(query);
    const where: Record<string, any> = { tenantId, deletedAt: null };
    if (query.bookId) where.bookId = query.bookId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      this.prisma.bookIssue.findMany({
        where,
        include: { book: true, student: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.bookIssue.count({ where }),
    ]);
    return { data, meta: buildMeta(total, page, limit) };
  }

  async findOne(tenantId: string, id: string) {
    const issue = await this.prisma.bookIssue.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: { book: true, student: true },
    });
    if (!issue) throw new NotFoundException('Book issue not found');
    return issue;
  }

  async update(tenantId: string, id: string, dto: any) {
    const issue = await this.findOne(tenantId, id);
    return this.prisma.bookIssue.update({
      where: { id },
      data: dto,
      include: { book: true, student: true },
    });
  }

  /**
   * Returns a book and puts the copy back on the shelf.
   *
   * The return date was recorded but the copy count was never restored.
   */
  async returnBook(tenantId: string, id: string, returnedAt: Date, returnedAtBs?: string) {
    const issue = await this.findOne(tenantId, id);
    if (issue.status === BookIssueStatus.RETURNED) {
      throw new ConflictException('This book has already been returned');
    }

    return this.prisma.$transaction(async (tx) => {
      const returned = await tx.bookIssue.update({
        where: { id },
        data: {
          status: BookIssueStatus.RETURNED,
          returnDateAd: returnedAt,
          returnDateBs: returnedAtBs ?? null,
        },
        include: { book: true, student: true },
      });

      await tx.libraryBook.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } },
      });

      return returned;
    });
  }

  /**
   * Flags the issues that are past their due date.
   *
   * `BookIssueStatus.OVERDUE` existed in the schema but nothing ever set it,
   * so overdue books were invisible as a category.
   */
  async markOverdue(tenantId: string, asOf: Date = new Date()) {
    const result = await this.prisma.bookIssue.updateMany({
      where: {
        tenantId,
        deletedAt: null,
        status: BookIssueStatus.ISSUED,
        dueDateAd: { lt: asOf },
      },
      data: { status: BookIssueStatus.OVERDUE },
    });
    return { updated: result.count };
  }

  async softDelete(tenantId: string, id: string) {
    const issue = await this.findOne(tenantId, id);
    if (issue.status === BookIssueStatus.ISSUED || issue.status === BookIssueStatus.OVERDUE) {
      throw new ConflictException('Return the book before removing the loan record');
    }
    await this.prisma.bookIssue.update({ where: { id }, data: { deletedAt: new Date() } });
    return { deleted: true };
  }

  async restore(tenantId: string, id: string) {
    const issue = await this.prisma.bookIssue.findUnique({ where: { id } });
    if (!issue || issue.tenantId !== tenantId) throw new NotFoundException('Book issue not found');
    if (!issue.deletedAt) throw new ConflictException('Book issue is not deleted');
    return this.prisma.bookIssue.update({ where: { id }, data: { deletedAt: null } });
  }
}
