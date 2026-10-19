import { DiscountType } from '../../generated/prisma/client.js';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateStudentScholarshipDto {
  @IsUUID() enrollmentId!: string;
  @IsUUID() scholarshipSchemeId!: string;
  @IsUUID() feeHeadId!: string;
  @IsEnum(DiscountType) discountType!: DiscountType;
  @IsNumber() @Min(0) discountValue!: number;
}

export class UpdateStudentScholarshipDto {
  @IsOptional() @IsEnum(DiscountType) discountType?: DiscountType;
  @IsOptional() @IsNumber() @Min(0) discountValue?: number;
}