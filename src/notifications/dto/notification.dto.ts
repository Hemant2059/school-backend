import { NotificationRecipientType } from '../../generated/prisma/client.js';
import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateNotificationDto {
  /** Defaults to the calling principal. */
  @IsOptional() @IsEnum(NotificationRecipientType) recipientType?: NotificationRecipientType;
  /** Defaults to the calling principal. */
  @IsOptional() @IsString() @MinLength(1) recipientId?: string;
  @IsString() @MinLength(2) @MaxLength(160) title!: string;
  @IsString() @MinLength(2) @MaxLength(1000) message!: string;
  @IsOptional() @IsString() @MaxLength(60) type?: string;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

export class UpdateNotificationDto {
  @BooleanParam()
  @IsOptional() @IsBoolean() isRead?: boolean;
  @IsOptional() @IsObject() metadata?: Record<string, unknown>;
}

/**
 * Notifications are always scoped to the calling principal, so there is no
 * tenant or recipient filter here.
 */
export class QueryNotificationsDto {
  @IsOptional() @IsString() @MaxLength(60) type?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isRead?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
