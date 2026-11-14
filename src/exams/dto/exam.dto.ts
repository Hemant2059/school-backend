import { ExamType } from '../../generated/prisma/client.js';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateExamDto {
  @IsUUID() academicYearId!: string;
  @IsOptional() @IsUUID() gradingScaleId?: string;
  @IsString() @MinLength(2) @MaxLength(160) name!: string;

  /**
   * Nepal distinguishes terminal (annual) exams from periodic ones
   * (unit tests, quarterly assessments, practicals).
   */
  @IsOptional() @IsEnum(ExamType) examType?: ExamType = ExamType.TERMINAL;

  @IsOptional() @IsNumber() @Min(0) @Max(100) termWeightage?: number;
  @IsDate() @Type(() => Date) startDateAd!: Date;
  @IsDate() @Type(() => Date) endDateAd!: Date;
  @IsString() @MaxLength(10) startDateBs!: string;
  @IsString() @MaxLength(10) endDateBs!: string;
  @IsOptional() @IsDate() @Type(() => Date) resultPublishDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) resultPublishDateBs?: string;

  /**
   * `isPublished` and `isLocked` are deliberately not accepted here: an
   * exam is created as a draft and moved through the publish/lock workflow.
   */
}

export class UpdateExamDto {
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsUUID() gradingScaleId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) name?: string;
  @IsOptional() @IsEnum(ExamType) examType?: ExamType;
  @IsOptional() @IsNumber() @Min(0) @Max(100) termWeightage?: number;
  @IsOptional() @IsDate() @Type(() => Date) startDateAd?: Date;
  @IsOptional() @IsDate() @Type(() => Date) endDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) startDateBs?: string;
  @IsOptional() @IsString() @MaxLength(10) endDateBs?: string;
  @IsOptional() @IsDate() @Type(() => Date) resultPublishDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) resultPublishDateBs?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @BooleanParam()
  @IsOptional() @IsBoolean() isLocked?: boolean;
}
