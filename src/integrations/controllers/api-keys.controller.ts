import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { PlanFeature } from '../../common/decorators/plan-feature.decorator.js';
import { ApiKeyService } from '../services/api-key.service.js';

class CreateApiKeyDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  /** Optional days until the key expires. Omit for a non-expiring key. */
  @IsOptional() @IsInt() expiresInDays?: number;
}

/**
 * Tenant-scoped API key management for integrations.
 *
 * The raw key is returned exactly once — at creation — and never again.
 * Listing shows only the key prefix and usage metadata. Keys grant
 * read-only access to the school's data for external systems (Zapier,
 * Google Sheets, the school's website).
 */
@Controller('tenants/:tenantId/api-keys')
export class ApiKeysController {
  constructor(private readonly service: ApiKeyService) {}

  @Permissions('integrations.manage')
  @PlanFeature('api.access')
  @Post()
  create(
    @Param('tenantId') tenantId: string,
    @Body() dto: CreateApiKeyDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.service.create(tenantId, dto, userId);
  }

  @Permissions('integrations.read')
  @PlanFeature('api.access')
  @Get()
  list(@Param('tenantId') tenantId: string) {
    return this.service.list(tenantId);
  }

  @Permissions('integrations.manage')
  @PlanFeature('api.access')
  @Delete(':id')
  revoke(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    return this.service.revoke(tenantId, id);
  }
}
