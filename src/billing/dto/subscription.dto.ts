import { SubscriptionStatus } from '../../generated/prisma/client.js';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../platform/dto/pagination.dto.js';

export class CreateSubscriptionDto {
  @IsUUID() planId!: string;
  @IsOptional() @IsEnum(SubscriptionStatus) status?: SubscriptionStatus = SubscriptionStatus.TRIAL;
  @IsDate() @Type(() => Date) startDate!: Date;
  @IsDate() @Type(() => Date) endDate!: Date;
  @IsOptional() @IsDate() @Type(() => Date) trialEndsAt?: Date;
  @IsOptional() @IsBoolean() autoRenew?: boolean = true;
  @IsOptional() metadata?: any;
}

export class QuerySubscriptionsDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(SubscriptionStatus) status?: SubscriptionStatus;
}

export class UpdateSubscriptionDto {
  @IsOptional() @IsEnum(SubscriptionStatus) status?: SubscriptionStatus;
  @IsOptional() @IsDate() @Type(() => Date) endDate?: Date;
  @IsOptional() @IsDate() @Type(() => Date) trialEndsAt?: Date;
  @IsOptional() @IsBoolean() autoRenew?: boolean;
  @IsOptional() metadata?: any;
}