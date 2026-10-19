import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGradingScaleDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
}

export class UpdateGradingScaleDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) name?: string;
}

export class CreateGradingScaleItemDto {
  @IsNumber() minPercentage!: number;
  @IsNumber() maxPercentage!: number;
  @IsString() @MinLength(1) @MaxLength(10) letterGrade!: string;
  @IsNumber() gradePoint!: number;
  @IsOptional() @IsString() @MaxLength(80) descriptorEn?: string;
  @IsOptional() @IsString() @MaxLength(80) descriptorNp?: string;
}

export class UpdateGradingScaleItemDto {
  @IsOptional() @IsNumber() minPercentage?: number;
  @IsOptional() @IsNumber() maxPercentage?: number;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(10) letterGrade?: string;
  @IsOptional() @IsNumber() gradePoint?: number;
  @IsOptional() @IsString() @MaxLength(80) descriptorEn?: string;
  @IsOptional() @IsString() @MaxLength(80) descriptorNp?: string;
}