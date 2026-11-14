import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCreditNoteDto {
  @IsUUID() invoiceId!: string;
  @IsString() @MinLength(2) @MaxLength(60) creditNoteNumber!: string;
  @IsString() @MinLength(2) @MaxLength(500) reason!: string;
  /** Must be positive and may not exceed the invoice's outstanding balance. */
  @IsNumber() @Min(0.01) amount!: number;
  @IsOptional() @IsUUID() approvedByUserId?: string;
}

/**
 * A credit note's amount may not be edited after the fact: it has already
 * been deducted from the invoice balance. Only the reason may be corrected.
 */
export class UpdateCreditNoteDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(500) reason?: string;
}
