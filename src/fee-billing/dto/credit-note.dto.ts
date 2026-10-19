import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCreditNoteDto {
  @IsUUID() invoiceId!: string;
  @IsString() @MinLength(2) @MaxLength(60) creditNoteNumber!: string;
  @IsString() @MinLength(2) @MaxLength(500) reason!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsUUID() approvedByUserId?: string;
}

export class UpdateCreditNoteDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(500) reason?: string;
  @IsOptional() @IsNumber() @Min(0) amount?: number;
  @IsOptional() @IsUUID() approvedByUserId?: string;
}