import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateFeatureDto {
  @IsString() @MinLength(2) code!: string;
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(60) category?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isActive?: boolean = true;
}

export class UpdateFeatureDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(60) category?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class QueryFeaturesDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() category?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}