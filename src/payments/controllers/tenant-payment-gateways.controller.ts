import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { AuthenticatedPrincipal } from '../../auth/types/principal.js';
import { TenantPaymentGatewayService } from '../tenant-payment-gateway.service.js';
import type { GatewayName } from '../providers/types.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

class UpsertPaymentGatewayConfigDto {
  @IsOptional() @IsIn(['sandbox', 'production']) environment?: string;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
  @IsOptional() @IsString() @MaxLength(64) merchantId?: string | null;
  @IsOptional() @IsString() @MaxLength(64) appId?: string | null;
  @IsOptional() @IsString() @MaxLength(300) secretKey?: string | null;
  @IsOptional() @IsString() @MaxLength(120) appName?: string | null;
  /** ConnectIPS creditor private key (PEM content). Cleared with "". */
  @IsOptional() @IsString() @MaxLength(4096) privateKeyPem?: string | null;
  @IsOptional() @IsString() @MaxLength(300) baseUrl?: string | null;
}

/**
 * Self-service payment gateway configuration for a school.
 * Secrets are stored AES-256-GCM encrypted and only ever leave the
 * server masked.
 */
@Controller('tenants/:tenantId/payment-gateways')
export class TenantPaymentGatewaysController {
  constructor(private readonly service: TenantPaymentGatewayService) {}

  /** Masked status of every gateway for this school (source, enabled, last-4 hints). */
  @Permissions('payment_gateways.read')
  @Get()
  list(@Param('tenantId') tenantId: string) {
    return this.service.list(tenantId);
  }

  /** Create or replace the school's credentials for one gateway. */
  @Permissions('payment_gateways.manage')
  @Put(':gateway')
  upsert(
    @Param('tenantId') tenantId: string,
    @Param('gateway') gateway: string,
    @Body() dto: UpsertPaymentGatewayConfigDto,
    @Req() req: Request & { user?: AuthenticatedPrincipal },
  ) {
    return this.service.upsert(
      tenantId,
      gateway.toUpperCase() as GatewayName,
      dto,
      req.user?.id,
    );
  }

  /** Remove the school's credentials for one gateway (falls back to platform env, if any). */
  @Permissions('payment_gateways.manage')
  @Delete(':gateway')
  remove(
    @Param('tenantId') tenantId: string,
    @Param('gateway') gateway: string,
  ) {
    return this.service.remove(tenantId, gateway.toUpperCase() as GatewayName);
  }
}
