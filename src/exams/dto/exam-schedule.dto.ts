import { IsDate, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamScheduleDto {
  @IsUUID() examId!: string;
  @IsUUID() gradeSubjectId!: string;
  @IsDate() @Type(() => Date) examDateAd!: Date;
  @IsString() @MaxLength(10) examDateBs!: string;
  @IsOptional() @IsString() @MaxLength(10) startTime?: string;
  @IsOptional() @IsString() @MaxLength(10) endTime?: string;

  /**
   * When omitted, the full marks are inherited from the grade subject's
   * curriculum entry. Note that these fields need an explicit validation
   * decorator: the global validation pipe runs with `whitelist: true`, so a
   * property without one is stripped from the request body entirely.
   */
  @IsOptional() @IsNumber() @Min(0) theoryFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) theoryPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) creditHours?: number;
}

export class UpdateExamScheduleDto {
  @IsOptional() @IsUUID() examId!: string;
  @IsOptional() @IsUUID() gradeSubjectId!: string;
  @IsOptional() @IsDate() @Type(() => Date) examDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) examDateBs?: string;
  @IsOptional() @IsString() @MaxLength(10) startTime?: string;
  @IsOptional() @IsString() @MaxLength(10) endTime?: string;
  @IsOptional() @IsNumber() @Min(0) theoryFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) theoryPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) creditHours?: number;
}
