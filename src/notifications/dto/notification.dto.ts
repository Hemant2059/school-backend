import { NotificationRecipientType } from '../../generated/prisma/client.js';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotificationDto {
  @IsOptional() @IsUUID() tenantId?: string;
  @IsEnum(NotificationRecipientType) recipientType!: NotificationRecipientType;
  @IsString() @MinLength(2) recipientId!: string;
  @IsString() @MinLength(2) @MaxLength(160) title!: string;
  @IsString() @MinLength(2) @MaxLength(1000) message!: string;
  @IsOptional() @IsString() @MaxLength(60) type?: string;
  @IsOptional() metadata?: any;
}

export class UpdateNotificationDto {
  @IsOptional() @IsBoolean() isRead?: boolean;
  @IsOptional() metadata?: any;
}

export class QueryNotificationsDto {
  @IsOptional() @IsUUID() tenantId?: string;
  @IsOptional() @IsEnum(NotificationRecipientType) recipientType?: NotificationRecipientType;
  @IsOptional() @IsString() recipientId?: string;
  @IsOptional() @IsBoolean() isRead?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}