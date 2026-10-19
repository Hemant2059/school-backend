import { FeeInvoiceStatus } from '../../generated/prisma/client.js';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeeInvoiceDto {
  @IsUUID() fiscalYearId!: string;
  @IsUUID() academicYearId!: string;
  @IsUUID() enrollmentId!: string;
  @IsString() @MinLength(2) @MaxLength(60) invoiceNumber!: string;
  @IsDate() @Type(() => Date) issueDateAd!: Date;
  @IsString() @MaxLength(10) issueDateBs!: string;
  @IsString() @MaxLength(10) dueDateBs!: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) billedUpToBsMonth?: number;
  @IsNumber() @Min(0) subtotalAmount!: number;
  @IsOptional() @IsNumber() @Min(0) discountAmount?: number = 0;
  @IsOptional() @IsNumber() @Min(0) previousDuesBroughtForward?: number = 0;
  @IsNumber() @Min(0) netPayableAmount!: number;
  @IsOptional() @IsNumber() @Min(0) paidAmount?: number = 0;
  @IsNumber() @Min(0) balanceDue!: number;
  @IsOptional() @IsEnum(FeeInvoiceStatus) status?: FeeInvoiceStatus = FeeInvoiceStatus.UNPAID;
  @IsOptional() @IsInt() @Min(0) printCount?: number = 0;
  @IsOptional() @IsBoolean() isSyncedToIrd?: boolean = false;
}

export class UpdateFeeInvoiceDto {
  @IsOptional() @IsEnum(FeeInvoiceStatus) status?: FeeInvoiceStatus;
  @IsOptional() @IsNumber() @Min(0) paidAmount?: number;
  @IsOptional() @IsNumber() @Min(0) balanceDue?: number;
  @IsOptional() @IsInt() @Min(0) printCount?: number;
  @IsOptional() @IsBoolean() isSyncedToIrd?: boolean;
}