import { EvaluationType } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateGradeLevelDto {
  @IsOptional() @IsUUID() streamId?: string;
  @IsString() @MinLength(2) @MaxLength(80) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(80) nameNe!: string;
  @IsOptional() @IsString() @MaxLength(20) iemisGradeCode?: string;
  @IsOptional() @IsEnum(EvaluationType) evaluationType?: EvaluationType = EvaluationType.PERCENTAGE;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number = 0;
}

export class UpdateGradeLevelDto {
  @IsOptional() @IsUUID() streamId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(20) iemisGradeCode?: string;
  @IsOptional() @IsEnum(EvaluationType) evaluationType?: EvaluationType;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
