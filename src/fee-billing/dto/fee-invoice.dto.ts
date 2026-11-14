import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

/**
 * Generates a fee invoice for an enrolment from the tenant's class fee
 * structure.
 *
 * The client states *what* to bill (who, which year, which fiscal year); the
 * server decides *how much* — every line, every discount and every total is
 * computed server-side.
 */
export class GenerateFeeInvoiceDto {
  @IsUUID()
  fiscalYearId!: string;

  @IsUUID()
  academicYearId!: string;

  @IsUUID()
  enrollmentId!: string;

  @IsDate()
  @Type(() => Date)
  issueDateAd!: Date;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  issueDateBs!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  dueDateBs!: string;

  /** Last Bikram Sambat month covered by this invoice (1-12). */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  billedUpToBsMonth?: number;

  /** Overrides the generated invoice number prefix. */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  invoicePrefix?: string;

  /** Notes printed on the invoice. */
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

/**
 * A manually raised invoice.
 *
 * The client may state the subtotal and the discount, but the payable amount
 * and the balance are always derived by the server — they used to be
 * client-supplied, which allowed an invoice with a subtotal of 100,000 and a
 * payable of 0.
 */
export class CreateFeeInvoiceDto {
  @IsUUID() fiscalYearId!: string;
  @IsUUID() academicYearId!: string;
  @IsUUID() enrollmentId!: string;

  @IsString() @MinLength(2) @MaxLength(60) invoiceNumber!: string;
  @IsDate() @Type(() => Date) issueDateAd!: Date;
  @IsString() @MinLength(4) @MaxLength(10) issueDateBs!: string;
  @IsString() @MinLength(4) @MaxLength(10) dueDateBs!: string;

  @IsOptional() @IsInt() @Min(1) @Max(12) billedUpToBsMonth?: number;

  @IsNumber() @Min(0) subtotalAmount!: number;
  @IsOptional() @IsNumber() @Min(0) discountAmount?: number = 0;
  @IsOptional() @IsNumber() @Min(0) previousDuesBroughtForward?: number = 0;
  /** Amount already received against this invoice (e.g. an advance). */
  @IsOptional() @IsNumber() @Min(0) paidAmount?: number = 0;

  @IsOptional() @IsString() @MaxLength(500) notes?: string;
}

/**
 * Only operational flags may be changed on an issued invoice. The money
 * fields are derived by the server, so they are no longer editable here.
 */
export class UpdateFeeInvoiceDto {
  @IsOptional() @IsInt() @Min(0) printCount?: number;
  @IsOptional() @BooleanParam() @IsBoolean() isSyncedToIrd?: boolean;
  @IsOptional() @IsString() @MaxLength(500) notes?: string;
}
