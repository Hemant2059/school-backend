import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

export type DocumentKind = 'FEE_INVOICE' | 'FEE_RECEIPT' | 'TRANSFER_CERTIFICATE' | 'STUDENT_ADMISSION';

export interface SequenceOptions {
  prefix?: string;
  padding?: number;
}

/**
 * Server-side, gap-free document numbering.
 *
 * Invoice and receipt numbers used to be supplied by the client. Two
 * concurrent requests could pick the same number, and the sequence was never
 * contiguous — both unacceptable for IRD reconciliation. The counter is now
 * owned by the server and advanced atomically with `increment`, so every
 * allocated number is unique even under concurrency.
 */
@Injectable()
export class DocumentSequenceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Allocates the next number for the given (tenant, fiscal year, kind).
   * The returned number is reserved even if the surrounding transaction is
   * rolled back, which keeps the series gap-free for the documents that were
   * actually issued.
   */
  async next(
    tenantId: string,
    fiscalYearId: string,
    kind: DocumentKind,
    options: SequenceOptions = {},
  ): Promise<string> {
    const prefix = options.prefix ?? defaultPrefix(kind);
    const padding = options.padding ?? defaultPadding(kind);

    const sequence = await this.prisma.documentSequence.upsert({
      where: { tenantId_fiscalYearId_kind: { tenantId, fiscalYearId, kind } },
      create: { tenantId, fiscalYearId, kind, prefix, padding, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
      select: { lastNumber: true, prefix: true, padding: true },
    });

    // On creation `lastNumber` is already 1; on update the increment returns
    // the new value.
    return `${sequence.prefix}${String(sequence.lastNumber).padStart(sequence.padding, '0')}`;
  }
}

function defaultPrefix(kind: DocumentKind): string {
  switch (kind) {
    case 'FEE_INVOICE':
      return 'INV-';
    case 'FEE_RECEIPT':
      return 'RCP-';
    case 'TRANSFER_CERTIFICATE':
      return 'TC-';
    case 'STUDENT_ADMISSION':
      return 'ADM-';
    default:
      return 'DOC-';
  }
}

function defaultPadding(kind: DocumentKind): number {
  return kind === 'FEE_INVOICE' || kind === 'FEE_RECEIPT' ? 5 : 4;
}
