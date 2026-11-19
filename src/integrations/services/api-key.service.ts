import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma.service.js';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';

/**
 * Read-only catalog an integration key may touch. Integration credentials
 * are for syncing data (rosters, fees, exam results) into the school's own
 * systems — never for administering the school. PII with no integration
 * use-case (HR/payroll, PAN, bank accounts, staff addresses) is excluded,
 * and catalog surfaces (permissions, roles, tenant users, gateway config)
 * are excluded so keys cannot be leveraged to map attack surface.
 */
const INTEGRATION_READABLE = [
  'academic_calendar.read',
  'academic_years.read',
  'attendance.read',
  'credit_notes.read',
  'enrollments.read',
  'exams.read',
  'fee_invoices.read',
  'fee_payments.read',
  'fees.read',
  'grade_levels.read',
  'grade_subjects.read',
  'grading_scales.read',
  'guardians.read',
  'hostel.read',
  'library.read',
  'notifications.read',
  'reports.read',
  'scholarships.read',
  'sections.read',
  'streams.read',
  'students.read',
  'subjects.read',
  'transfer_certificates.read',
  'transport.read',
] as const;

/**
 * Tenant-scoped API keys for integrations.
 *
 * The raw key is shown exactly once, at creation. Only a SHA-256 hash is
 * stored; keys are high-entropy (192 bits) so an unsalted digest is a
 * sound lookup credential. Keys are pinned to one tenant, read-only, and
 * revocable at any time.
 */
@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    dto: { name: string; expiresInDays?: number },
    createdByUserId?: string,
  ) {
    const raw = `sk_${randomBytes(24).toString('base64url')}`;
    const prefix = raw.slice(0, 12);
    const expiresAt = dto.expiresInDays
      ? new Date(Date.now() + dto.expiresInDays * 86_400_000)
      : null;

    const key = await this.prisma.apiKey.create({
      data: {
        tenantId,
        name: dto.name,
        prefix,
        hash: this.hash(raw),
        expiresAt,
        createdByUserId: createdByUserId ?? null,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return {
      ...key,
      /** Shown exactly once — store it now. */
      key: raw,
    };
  }

  async list(tenantId: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsedAt: true,
        expiresAt: true,
        revokedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return keys;
  }

  async revoke(tenantId: string, id: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id, tenantId },
    });
    if (!key) throw new NotFoundException('API key not found');
    if (key.revokedAt) return { revoked: true };
    await this.prisma.apiKey.update({
      where: { id: key.id },
      data: { revokedAt: new Date() },
    });
    return { revoked: true };
  }

  /**
   * Resolve a raw key to a principal, or null. Caller is responsible for
   * method-level restrictions (read-only enforcement).
   */
  async authenticate(rawKey: string): Promise<AuthenticatedPrincipal | null> {
    if (!rawKey || !rawKey.startsWith('sk_')) return null;
    const prefix = rawKey.slice(0, 12);
    if (prefix.length < 12) return null;

    const candidates = await this.prisma.apiKey.findMany({
      where: { prefix },
      select: {
        id: true,
        tenantId: true,
        hash: true,
        revokedAt: true,
        expiresAt: true,
      },
    });

    for (const key of candidates) {
      if (!this.matches(rawKey, key.hash)) continue;
      if (key.revokedAt) return null;
      if (key.expiresAt && key.expiresAt.getTime() < Date.now()) return null;

      // Best-effort — the key must not fail because of telemetry.
      this.prisma.apiKey
        .update({ where: { id: key.id }, data: { lastUsedAt: new Date() } })
        .catch(() => undefined);

      return {
        type: 'tenant',
        id: `api-key:${key.id}`,
        email: null,
        tenantId: key.tenantId,
        tenantUserId: undefined,
        roles: ['Integration'],
        permissions: [...INTEGRATION_READABLE],
        subscriptionStatus: await this.subscriptionStatus(key.tenantId),
        apiKeyId: key.id,
      };
    }
    return null;
  }

  private hash(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }

  private matches(raw: string, storedHash: string): boolean {
    const a = Buffer.from(this.hash(raw), 'utf8');
    const b = Buffer.from(storedHash, 'utf8');
    return a.length === b.length && timingSafeEqual(a, b);
  }

  /** Same subscription verdict the JWT strategy applies. */
  private async subscriptionStatus(tenantId: string): Promise<string> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { status: true, endDate: true },
    });
    if (!subscription) return 'NONE';
    if (subscription.status !== 'EXPIRED' && subscription.endDate < new Date()) {
      return 'EXPIRED';
    }
    return subscription.status;
  }
}
