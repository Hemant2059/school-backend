import { FeePaymentMethod } from '../../generated/prisma/client.js';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeePaymentDto {
  @IsUUID() fiscalYearId!: string;
  @IsUUID() enrollmentId!: string;
  @IsOptional() @IsUUID() invoiceId?: string;
  @IsString() @MaxLength(40) receiptNumber!: string;
  @IsDate() @Type(() => Date) paymentDateAd!: Date;
  @IsString() @MaxLength(10) paymentDateBs!: string;
  @IsNumber() @Min(0) amountPaid!: number;
  @IsEnum(FeePaymentMethod) paymentMethod!: FeePaymentMethod;
  @IsOptional() @IsString() @MaxLength(120) gatewayTransactionId?: string;
  @IsOptional() gatewayResponsePayload?: any;
  @IsOptional() @IsUUID() collectedByUserId?: string;
}

export class UpdateFeePaymentDto {
  @IsOptional() @IsEnum(FeePaymentMethod) paymentMethod?: FeePaymentMethod;
  @IsOptional() @IsString() @MaxLength(120) gatewayTransactionId?: string;
  @IsOptional() gatewayResponsePayload?: any;
}