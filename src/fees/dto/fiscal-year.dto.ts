import { IsBoolean, IsDate, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFiscalYearDto {
  @IsString() @MinLength(2) @MaxLength(20) name!: string;
  @IsDate() @Type(() => Date) startDateAd!: Date;
  @IsString() @MaxLength(10) startDateBs!: string;
  @IsDate() @Type(() => Date) endDateAd!: Date;
  @IsString() @MaxLength(10) endDateBs!: string;
  @IsOptional() @IsBoolean() isActive?: boolean = false;
}

export class UpdateFiscalYearDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(20) name?: string;
  @IsOptional() @IsDate() @Type(() => Date) startDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) startDateBs?: string;
  @IsOptional() @IsDate() @Type(() => Date) endDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) endDateBs?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}