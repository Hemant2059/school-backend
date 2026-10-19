import { EnrollmentStatus } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID() studentId!: string;
  @IsUUID() academicYearId!: string;
  @IsUUID() gradeLevelId!: string;
  @IsUUID() sectionId!: string;
  @IsInt() @Min(1) @Max(999) rollNo!: number;
  @IsOptional() @IsString() @MaxLength(20) houseName?: string;
  @IsOptional() @IsEnum(EnrollmentStatus) enrollmentStatus?: EnrollmentStatus = EnrollmentStatus.NEW_ADMISSION;
}

export class UpdateEnrollmentDto {
  @IsOptional() @IsUUID() academicYearId?: string;
  @IsOptional() @IsUUID() gradeLevelId?: string;
  @IsOptional() @IsUUID() sectionId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(999) rollNo?: number;
  @IsOptional() @IsString() @MaxLength(20) houseName?: string;
  @IsOptional() @IsEnum(EnrollmentStatus) enrollmentStatus?: EnrollmentStatus;
}