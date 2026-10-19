import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateFeeInvoiceItemDto {
  @IsUUID() invoiceId!: string;
  @IsUUID() feeHeadId!: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) bsMonth?: number;
  @IsString() @MinLength(2) @MaxLength(255) description!: string;
  @IsNumber() @Min(0) grossAmount!: number;
  @IsOptional() @IsNumber() @Min(0) discountAmount?: number = 0;
  @IsNumber() @Min(0) netAmount!: number;
}

export class UpdateFeeInvoiceItemDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(255) description?: string;
  @IsOptional() @IsNumber() @Min(0) grossAmount?: number;
  @IsOptional() @IsNumber() @Min(0) discountAmount?: number;
  @IsOptional() @IsNumber() @Min(0) netAmount?: number;
}