import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTimetableSlotDto {
  @IsUUID() sectionId!: string;
  /** 1 = Sunday ... 7 = Saturday, as used in Nepali school timetables. */
  @IsInt() @Min(1) @Max(7) dayOfWeek!: number;
  @IsInt() @Min(1) @Max(12) periodNo!: number;
  /** "08:00" */
  @IsString() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) startTime!: string;
  /** "08:45" */
  @IsString() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) endTime!: string;
  @IsUUID() subjectId!: string;
  @IsUUID() staffId!: string;
}

export class UpdateTimetableSlotDto {
  @IsOptional() @IsUUID() sectionId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(7) dayOfWeek?: number;
  @IsOptional() @IsInt() @Min(1) @Max(12) periodNo?: number;
  @IsOptional() @IsString() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) startTime?: string;
  @IsOptional() @IsString() @Matches(/^([01]\d|2[0-3]):[0-5]\d$/) endTime?: string;
  @IsOptional() @IsUUID() subjectId?: string;
  @IsOptional() @IsUUID() staffId?: string;
}

export class QueryTimetableDto {
  @IsOptional() @IsUUID() sectionId?: string;
  @IsOptional() @IsUUID() staffId?: string;
  @IsOptional() @IsUUID() subjectId?: string;
  @IsOptional() @IsInt() @Min(1) @Max(7) dayOfWeek?: number;
  @IsOptional() @IsString() @MaxLength(120) search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 50;
}

export class GenerateTimetableDto {
  @IsUUID() sectionId!: string;
  @IsOptional() @IsInt() @Min(1) @Max(7) startDay?: number;
}
