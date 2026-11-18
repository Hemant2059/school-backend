import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateClassFeeStructureDto {
  @IsUUID() academicYearId!: string;
  @IsUUID() gradeLevelId!: string;
  @IsUUID() feeHeadId!: string;

  /**
   * The fiscal year the structure belongs to.
   *
   * It was in the schema but not in the DTO, so the field was rejected on the
   * way in and could never be set. Without it a structure cannot be tied to
   * the fiscal year its invoice belongs to.
   */
  @IsOptional() @IsUUID() fiscalYearId?: string;

  @IsNumber() @Min(0) amount!: number;

  /**
   * The Bikram Sambat months this fee applies to. A `MONTHLY_BS` fee head is
   * expanded into one invoice line per month listed here.
   */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(12, { each: true })
  applicableBsMonths?: number[];
}

export class UpdateClassFeeStructureDto {
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsUUID() gradeLevelId?: string;
  @IsOptional() @IsUUID() feeHeadId?: string;
  @IsOptional() @IsUUID() fiscalYearId?: string;
  @IsOptional() @IsNumber() @Min(0) amount?: number;
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(12, { each: true })
  applicableBsMonths?: number[];
}
