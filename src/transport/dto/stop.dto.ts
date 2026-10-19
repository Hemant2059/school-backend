import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateStopDto {
  @IsUUID() routeId!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameNe!: string;
  @IsInt() @Min(1) sequence!: number;
  @IsOptional() @IsString() @MaxLength(10) arrivalTime?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
}

export class UpdateStopDto {
  @IsOptional() @IsUUID() routeId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameNe?: string;
  @IsOptional() @IsInt() @Min(1) sequence?: number;
  @IsOptional() @IsString() @MaxLength(10) arrivalTime?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
}