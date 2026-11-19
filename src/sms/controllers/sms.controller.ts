import { Body, Controller, Param, Post } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SmsService } from '../sms.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { TenantEntitlementService } from '../../billing/services/tenant-entitlement.service.js';

export class SendSmsDto {
  @IsString() @IsNotEmpty() @MaxLength(40) to!: string;
  @IsString() @IsNotEmpty() @MaxLength(640) message!: string;
}

@Controller('tenants/:tenantId/sms')
export class SmsController {
  constructor(
    private readonly sms: SmsService,
    private readonly entitlements: TenantEntitlementService,
  ) {}

  /**
   * Sends one SMS to one Nepali mobile number.
   * Uses the configured provider (noop until SPARROW_SMS_* is set), so it
   * is always safe to call — with no gateway configured it only logs.
   */
  @Permissions('notifications.manage')
  @Post('send')
  async send(@Param('tenantId') tenantId: string, @Body() dto: SendSmsDto) {
    await this.entitlements.assertFeatureEnabled(tenantId, 'sms.notifications');
    return this.sms.send(dto.to, dto.message);
  }
}
