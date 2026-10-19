import { IsBoolean, IsDate, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamDto {
  @IsUUID() academicYearId!: string;
  @IsOptional() @IsUUID() gradingScaleId?: string;
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsNumber() @Min(0) termWeightage?: number;
  @IsDate() @Type(() => Date) startDateAd!: Date;
  @IsDate() @Type(() => Date) endDateAd!: Date;
  @IsString() @MaxLength(10) startDateBs!: string;
  @IsString() @MaxLength(10) endDateBs!: string;
  @IsOptional() @IsDate() @Type(() => Date) resultPublishDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) resultPublishDateBs?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean = false;
  @IsOptional() @IsBoolean() isLocked?: boolean = false;
}

export class UpdateExamDto {
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsUUID() gradingScaleId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) name?: string;
  @IsOptional() @IsNumber() @Min(0) termWeightage?: number;
  @IsOptional() @IsDate() @Type(() => Date) startDateAd?: Date;
  @IsOptional() @IsDate() @Type(() => Date) endDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) startDateBs?: string;
  @IsOptional() @IsString() @MaxLength(10) endDateBs?: string;
  @IsOptional() @IsDate() @Type(() => Date) resultPublishDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) resultPublishDateBs?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsBoolean() isLocked?: boolean;
}