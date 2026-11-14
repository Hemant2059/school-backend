import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus } from '../../generated/prisma/client.js';

export class MarkAttendanceDto {
  @IsUUID() enrollmentId!: string;
  @IsDate() @Type(() => Date) dateAd!: Date;
  @IsString() @MinLength(4) @MaxLength(10) dateBs!: string;
  @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @IsOptional() @IsString() @MaxLength(10) checkInTime?: string;
  @IsOptional() @IsString() @MaxLength(10) checkOutTime?: string;
  /** biometric, manual, mobile, ... */
  @IsOptional() @IsString() @MaxLength(40) source?: string;
}

/**
 * Marks the attendance of a whole section in one request.
 */
export class BulkAttendanceDto {
  @IsUUID() sectionId!: string;
  @IsDate() @Type(() => Date) dateAd!: Date;
  @IsString() @MinLength(4) @MaxLength(10) dateBs!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceEntryDto)
  entries!: BulkAttendanceEntryDto[];

  @IsOptional() @IsString() @MaxLength(40) source?: string;
}

export class BulkAttendanceEntryDto {
  @IsUUID() enrollmentId!: string;
  @IsEnum(AttendanceStatus) status!: AttendanceStatus;
  @IsOptional() @IsString() @MaxLength(10) checkInTime?: string;
  @IsOptional() @IsString() @MaxLength(10) checkOutTime?: string;
}

export class UpdateAttendanceDto {
  @IsOptional() @IsEnum(AttendanceStatus) status?: AttendanceStatus;
  @IsOptional() @IsString() @MaxLength(10) checkInTime?: string;
  @IsOptional() @IsString() @MaxLength(10) checkOutTime?: string;
  @IsOptional() @IsString() @MaxLength(40) source?: string;
}

export class QueryAttendanceDto {
  @IsOptional() @IsUUID() sectionId?: string;
  @IsOptional() @IsUUID() enrollmentId?: string;
  @IsOptional() @IsDate() @Type(() => Date) from?: Date;
  @IsOptional() @IsDate() @Type(() => Date) to?: Date;
  @IsOptional() @IsEnum(AttendanceStatus) status?: AttendanceStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 50;
}
