import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateSectionDto {
  @IsUUID() gradeLevelId!: string;
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsString() @MinLength(1) @MaxLength(40) nameEn!: string;
  @IsString() @MinLength(1) @MaxLength(40) nameNe!: string;
  @IsOptional() @IsString() @MaxLength(40) roomNumber?: string;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number = 0;
  @IsOptional() @IsUUID() classTeacherId?: string;
}

export class UpdateSectionDto {
  @IsOptional() @IsUUID() gradeLevelId?: string;
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(40) nameEn?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(40) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(40) roomNumber?: string;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
  @IsOptional() @IsUUID() classTeacherId?: string;
}
