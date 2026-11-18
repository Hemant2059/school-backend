import { Body, Controller, Param, Post } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { SmsService } from '../sms.service.js';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';

export class SendSmsDto {
  @IsString() @IsNotEmpty() @MaxLength(40) to!: string;
  @IsString() @IsNotEmpty() @MaxLength(640) message!: string;
}

@Controller('tenants/:tenantId/sms')
export class SmsController {
  constructor(private readonly sms: SmsService) {}

  /**
   * Sends one SMS to one Nepali mobile number.
   * Uses the configured provider (noop until SPARROW_SMS_* is set), so it
   * is always safe to call — with no gateway configured it only logs.
   */
  @Permissions('notifications.manage')
  @Post('send')
  send(@Param('tenantId') _tenantId: string, @Body() dto: SendSmsDto) {
    return this.sms.send(dto.to, dto.message);
  }
}
