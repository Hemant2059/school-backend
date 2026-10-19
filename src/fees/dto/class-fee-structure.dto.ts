import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateClassFeeStructureDto {
  @IsUUID() academicYearId!: string;
  @IsUUID() gradeLevelId!: string;
  @IsUUID() feeHeadId!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsArray() applicableBsMonths?: number[];
}

export class UpdateClassFeeStructureDto {
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsUUID() gradeLevelId?: string;
  @IsOptional() @IsUUID() feeHeadId?: string;
  @IsOptional() @IsNumber() @Min(0) amount?: number;
  @IsOptional() @IsArray() applicableBsMonths?: number[];
}