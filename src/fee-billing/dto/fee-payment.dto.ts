import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { FeePaymentMethod } from '../../generated/prisma/client.js';

export class CreateFeePaymentDto {
  @IsUUID() fiscalYearId!: string;
  @IsUUID() enrollmentId!: string;
  @IsOptional() @IsUUID() invoiceId?: string;

  /** Server-generated when omitted. */
  @IsOptional() @IsString() @MinLength(2) @MaxLength(60) receiptNumber?: string;

  @IsDate() @Type(() => Date) paymentDateAd!: Date;
  @IsString() @MinLength(4) @MaxLength(10) paymentDateBs!: string;

  @IsNumber() @Min(0.01) amountPaid!: number;
  @IsEnum(FeePaymentMethod) paymentMethod!: FeePaymentMethod;

  /** Idempotency key from the payment gateway. */
  @IsOptional() @IsString() @MaxLength(120) gatewayTransactionId?: string;
  @IsOptional() @IsObject() gatewayResponsePayload?: Record<string, unknown>;
}

/**
 * Only the collection details of a receipt may be corrected. The amount is
 * immutable — a mistake is fixed by reversing the receipt and issuing a new
 * one, which keeps the ledger auditable.
 */
export class UpdateFeePaymentDto {
  @IsOptional() @IsEnum(FeePaymentMethod) paymentMethod?: FeePaymentMethod;
  @IsOptional() @IsString() @MaxLength(120) gatewayTransactionId?: string;
  @IsOptional() @IsObject() gatewayResponsePayload?: Record<string, unknown>;
}
