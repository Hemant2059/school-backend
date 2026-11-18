import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { decryptSecret, encryptSecret, maskSecret } from './crypto.js';
import type { GatewayName } from './providers/types.js';
import type { ResolvedGatewayConfig } from './providers/resolved-config.js';

export const GATEWAYS: GatewayName[] = [
  'DEMO',
  'ESEWA',
  'KHALTI',
  'CONNECTIPS',
];

export interface UpsertPaymentGatewayConfigDto {
  environment?: string;
  isEnabled?: boolean;
  /** eSewa product_code · ConnectIPS MERCHANTID (plaintext in, encrypted at rest) */
  merchantId?: string | null;
  /** ConnectIPS APPID */
  appId?: string | null;
  /** eSewa secret · Khalti live_secret_key · ConnectIPS APP password */
  secretKey?: string | null;
  /** ConnectIPS APPNAME (not secret) */
  appName?: string | null;
  /** ConnectIPS creditor private key (PEM content) */
  privateKeyPem?: string | null;
  baseUrl?: string | null;
}

/**
 * Per-tenant payment gateway configuration.
 *
 * Each school runs its own merchant account; this table stores those
 * credentials encrypted (AES-256-GCM, platform master key in the
 * environment). Resolution order per intent: the school's row first,
 * the platform .env as fallback (single-school/demo installs). A tenant
 * row that is disabled explicitly disables the gateway for that school
 * (no silent fall-back to the platform credentials).
 */
@Injectable()
export class TenantPaymentGatewayService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------------------------------------------------
  // Resolution
  // ------------------------------------------------------------------

  /** True when the resolved config carries everything the gateway needs. */
  credentialsComplete(cfg: ResolvedGatewayConfig | null): boolean {
    if (!cfg) return false;
    switch (cfg.gateway) {
      case 'DEMO':
        return true;
      case 'ESEWA':
        // The sandbox credentials are public, so sandbox always works;
        // production requires both merchant credentials.
        return (
          cfg.environment !== 'production' ||
          !!(cfg.merchantId && cfg.secretKey)
        );
      case 'KHALTI':
        return !!cfg.secretKey;
      case 'CONNECTIPS':
        return !!(
          cfg.merchantId &&
          cfg.appId &&
          cfg.secretKey &&
          cfg.privateKeyPem
        );
    }
  }

  /**
   * The effective configuration for a school: the tenant row when present
   * and enabled, otherwise the platform environment fallback. Returns null
   * when the gateway is not usable (missing credentials or disabled).
   */
  async resolveForTenant(
    tenantId: string,
    gateway: GatewayName,
  ): Promise<ResolvedGatewayConfig | null> {
    const row = await this.prisma.tenantPaymentGatewayConfig.findUnique({
      where: { tenantId_gateway: { tenantId, gateway } },
    });
    if (row) {
      if (!row.isEnabled) return null; // explicitly disabled — no env fallback
      return {
        gateway,
        environment: row.environment,
        merchantId: row.merchantIdEncrypted
          ? decryptSecret(row.merchantIdEncrypted)
          : undefined,
        appId: row.appIdEncrypted
          ? decryptSecret(row.appIdEncrypted)
          : undefined,
        secretKey: row.secretKeyEncrypted
          ? decryptSecret(row.secretKeyEncrypted)
          : undefined,
        appName: row.appName ?? undefined,
        privateKeyPem: row.privateKeyPemEncrypted
          ? decryptSecret(row.privateKeyPemEncrypted)
          : undefined,
        baseUrl: row.baseUrl ?? undefined,
      };
    }
    // No row for this school: only the built-in DEMO gateway works
    // (it needs no credentials at all). Real gateways must be configured
    // per school first.
    return gateway === 'DEMO' ? { gateway, environment: 'sandbox' } : null;
  }

  /**
   * Public, tenant-agnostic listing. No gateway is available until a
   * school configures its own merchant credentials — the only exception
   * is the built-in DEMO gateway, which needs no credentials at all.
   */
  envStatus() {
    return {
      default: 'DEMO',
      gateways: GATEWAYS.map((gateway) => ({
        name: gateway,
        configured: gateway === 'DEMO',
        environment: gateway === 'DEMO' ? 'sandbox' : null,
        note:
          gateway === 'DEMO'
            ? null
            : 'Configure per school under Payment Gateways',
      })),
    };
  }

  // ------------------------------------------------------------------
  // Admin API (masked)
  // ------------------------------------------------------------------

  async list(tenantId: string) {
    const rows = await this.prisma.tenantPaymentGatewayConfig.findMany({
      where: { tenantId },
      take: 10, // one row per gateway — never a real list
    });
    const byGateway = new Map(rows.map((r) => [r.gateway, r] as const));

    const gateways = GATEWAYS.map((gateway) => {
      const row = byGateway.get(gateway);
      if (row) {
        return {
          name: gateway,
          source: 'tenant' as const,
          enabled: row.isEnabled,
          environment: row.environment,
          configured: this.credentialsComplete({
            gateway,
            environment: row.environment,
            merchantId: row.merchantIdEncrypted ? 'x' : undefined,
            appId: row.appIdEncrypted ? 'x' : undefined,
            secretKey: row.secretKeyEncrypted ? 'x' : undefined,
            privateKeyPem: row.privateKeyPemEncrypted ? 'x' : undefined,
            baseUrl: row.baseUrl ?? undefined,
          }),
          masked: {
            merchantId: row.merchantIdEncrypted
              ? maskSecret(decryptSecret(row.merchantIdEncrypted))
              : null,
            appId: row.appIdEncrypted
              ? maskSecret(decryptSecret(row.appIdEncrypted))
              : null,
            secretKey: row.secretKeyEncrypted
              ? maskSecret(decryptSecret(row.secretKeyEncrypted))
              : null,
            privateKeyPem: row.privateKeyPemEncrypted ? '••••(pem)' : null,
          },
          appName: row.appName,
          baseUrl: row.baseUrl,
          updatedAt: row.updatedAt,
        };
      }

      return {
        name: gateway,
        source: 'none' as const,
        enabled: true,
        environment: 'sandbox',
        configured: gateway === 'DEMO',
        masked: null,
        appName: null,
        baseUrl: null,
        updatedAt: null,
      };
    });

    return { gateways };
  }

  async upsert(
    tenantId: string,
    gateway: GatewayName,
    dto: UpsertPaymentGatewayConfigDto,
    userId?: string,
  ) {
    if (!GATEWAYS.includes(gateway))
      throw new BadRequestException('Unknown payment gateway');
    if (
      dto.environment !== undefined &&
      !['sandbox', 'production'].includes(dto.environment)
    ) {
      throw new BadRequestException(
        'environment must be "sandbox" or "production"',
      );
    }
    if (dto.baseUrl) {
      if (!/^https?:\/\//i.test(dto.baseUrl)) {
        throw new BadRequestException('baseUrl must be an http(s) URL');
      }
    }

    const existing = await this.prisma.tenantPaymentGatewayConfig.findUnique({
      where: { tenantId_gateway: { tenantId, gateway } },
    });

    // Merge: absent field keeps the stored value; empty string clears it.
    const merged = {
      environment: dto.environment ?? existing?.environment ?? 'sandbox',
      isEnabled: dto.isEnabled ?? existing?.isEnabled ?? true,
      merchantId: this.pick(
        dto.merchantId,
        existing?.merchantIdEncrypted
          ? decryptSecret(existing.merchantIdEncrypted)
          : undefined,
      ),
      appId: this.pick(
        dto.appId,
        existing?.appIdEncrypted
          ? decryptSecret(existing.appIdEncrypted)
          : undefined,
      ),
      secretKey: this.pick(
        dto.secretKey,
        existing?.secretKeyEncrypted
          ? decryptSecret(existing.secretKeyEncrypted)
          : undefined,
      ),
      appName:
        dto.appName === undefined
          ? existing?.appName
          : dto.appName === ''
            ? null
            : dto.appName,
      privateKeyPem: this.pick(
        dto.privateKeyPem,
        existing?.privateKeyPemEncrypted
          ? decryptSecret(existing.privateKeyPemEncrypted)
          : undefined,
      ),
      baseUrl:
        dto.baseUrl === undefined
          ? existing?.baseUrl
          : dto.baseUrl === ''
            ? null
            : dto.baseUrl,
    };

    // If the gateway will be enabled after the change, its credentials must be complete.
    if (merged.isEnabled && gateway !== 'DEMO') {
      const complete = this.credentialsComplete({
        gateway,
        environment: merged.environment,
        merchantId: merged.merchantId ?? undefined,
        appId: merged.appId ?? undefined,
        secretKey: merged.secretKey ?? undefined,
        privateKeyPem: merged.privateKeyPem ?? undefined,
        baseUrl: merged.baseUrl ?? undefined,
      });
      if (!complete) {
        throw new BadRequestException(
          `The ${gateway} gateway is missing credentials — provide merchantId/secretKey (eSewa), secretKey (Khalti), or merchantId+appId+secretKey+privateKeyPem (ConnectIPS) before enabling it`,
        );
      }
    }

    const data = {
      tenantId,
      gateway,
      environment: merged.environment,
      isEnabled: merged.isEnabled,
      merchantIdEncrypted:
        merged.merchantId === undefined
          ? null
          : merged.merchantId
            ? encryptSecret(merged.merchantId)
            : null,
      appIdEncrypted:
        merged.appId === undefined
          ? null
          : merged.appId
            ? encryptSecret(merged.appId)
            : null,
      secretKeyEncrypted:
        merged.secretKey === undefined
          ? null
          : merged.secretKey
            ? encryptSecret(merged.secretKey)
            : null,
      privateKeyPemEncrypted:
        merged.privateKeyPem === undefined
          ? null
          : merged.privateKeyPem
            ? encryptSecret(merged.privateKeyPem)
            : null,
      appName: merged.appName ?? null,
      baseUrl: merged.baseUrl ?? null,
      configuredByUserId: userId ?? null,
    };

    await this.prisma.tenantPaymentGatewayConfig.upsert({
      where: { tenantId_gateway: { tenantId, gateway } },
      create: data,
      update: data,
    });

    return (await this.list(tenantId)).gateways.find((g) => g.name === gateway);
  }

  async remove(tenantId: string, gateway: GatewayName) {
    if (!GATEWAYS.includes(gateway))
      throw new BadRequestException('Unknown payment gateway');
    const existing = await this.prisma.tenantPaymentGatewayConfig.findUnique({
      where: { tenantId_gateway: { tenantId, gateway } },
    });
    if (!existing)
      throw new NotFoundException(
        'Payment gateway is not configured for this school',
      );
    await this.prisma.tenantPaymentGatewayConfig.delete({
      where: { id: existing.id },
    });
    return { deleted: true, gateway };
  }

  /** undefined = keep existing, null = clear, string = set (trimmed). */
  private pick(
    dtoValue: string | null | undefined,
    existing: string | undefined,
  ): string | null | undefined {
    if (dtoValue === undefined) return existing;
    if (dtoValue === null || dtoValue.trim() === '') return null; // clear
    return dtoValue.trim();
  }
}
