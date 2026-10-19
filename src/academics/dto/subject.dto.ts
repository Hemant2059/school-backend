import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString() @MinLength(2) @MaxLength(40) code!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameNe!: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
}

export class UpdateSubjectDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) code?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
}
