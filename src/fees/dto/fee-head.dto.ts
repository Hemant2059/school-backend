import { FeeFrequency } from '../../generated/prisma/client.js';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateFeeHeadDto {
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameNe!: string;
  @IsEnum(FeeFrequency) frequency!: FeeFrequency;
  @BooleanParam()
  @IsOptional() @IsBoolean() isTaxable?: boolean = false;
}

export class UpdateFeeHeadDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameNe?: string;
  @IsOptional() @IsEnum(FeeFrequency) frequency?: FeeFrequency;
  @BooleanParam()
  @IsOptional() @IsBoolean() isTaxable?: boolean;
}