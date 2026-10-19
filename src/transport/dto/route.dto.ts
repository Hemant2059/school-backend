import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateRouteDto {
  @IsOptional() @IsUUID() vehicleId?: string;
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameNe!: string;
  @IsOptional() @IsString() @MaxLength(500) descriptionEn?: string;
  @IsOptional() @IsString() @MaxLength(500) descriptionNe?: string;
  @IsOptional() @IsNumber() @Min(0) fare?: number;
}

export class UpdateRouteDto {
  @IsOptional() @IsUUID() vehicleId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(500) descriptionEn?: string;
  @IsOptional() @IsString() @MaxLength(500) descriptionNe?: string;
  @IsOptional() @IsNumber() @Min(0) fare?: number;
}