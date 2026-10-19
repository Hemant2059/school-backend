import { IsDate, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamScheduleDto {
  @IsUUID() examId!: string;
  @IsUUID() gradeSubjectId!: string;
  @IsDate() @Type(() => Date) examDateAd!: Date;
  @IsString() @MaxLength(10) examDateBs!: string;
  @IsOptional() @IsString() @MaxLength(10) startTime?: string;
  @IsOptional() @IsString() @MaxLength(10) endTime?: string;
  @IsOptional() theoryFullMarks?: number;
  @IsOptional() theoryPassMarks?: number;
  @IsOptional() internalFullMarks?: number;
  @IsOptional() internalPassMarks?: number;
}

export class UpdateExamScheduleDto {
  @IsOptional() @IsUUID() examId?: string;
  @IsOptional() @IsUUID() gradeSubjectId?: string;
  @IsOptional() @IsDate() @Type(() => Date) examDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) examDateBs?: string;
  @IsOptional() @IsString() @MaxLength(10) startTime?: string;
  @IsOptional() @IsString() @MaxLength(10) endTime?: string;
  @IsOptional() theoryFullMarks?: number;
  @IsOptional() theoryPassMarks?: number;
  @IsOptional() internalFullMarks?: number;
  @IsOptional() internalPassMarks?: number;
}