import { IsBoolean, IsDate, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateAcademicYearDto {
  @IsString() @MinLength(2) @MaxLength(40) name!: string;
  @IsInt() @Min(1900) @Max(2200) bsYear!: number;
  @IsDate() @Type(() => Date) startDateAd!: Date;
  @IsDate() @Type(() => Date) endDateAd!: Date;
  @IsString() @MaxLength(10) startDateBs!: string;
  @IsString() @MaxLength(10) endDateBs!: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isCurrent?: boolean = false;
}

export class UpdateAcademicYearDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) name?: string;
  @IsOptional() @IsInt() @Min(1900) @Max(2200) bsYear?: number;
  @IsOptional() @IsDate() @Type(() => Date) startDateAd?: Date;
  @IsOptional() @IsDate() @Type(() => Date) endDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) startDateBs?: string;
  @IsOptional() @IsString() @MaxLength(10) endDateBs?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isCurrent?: boolean;
}

export class QueryAcademicYearsDto {
  @BooleanParam()
  @IsOptional() @IsBoolean() isCurrent?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}