import { IsInt, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStudentExamSummaryDto {
  @IsUUID() examId!: string;
  @IsUUID() enrollmentId!: string;
  @IsOptional() @IsNumber() totalMarksObtained?: number;
  @IsOptional() @IsNumber() percentage?: number;
  @IsOptional() @IsNumber() gpa?: number;
  @IsOptional() @IsString() @MaxLength(3) finalGrade?: string;
  @IsOptional() @IsInt() rankInSection?: number;
  @IsOptional() @IsInt() rankInGrade?: number;
  @IsOptional() @IsInt() totalAttendanceDays?: number;
  @IsOptional() @IsInt() presentDays?: number;
  @IsOptional() @IsString() @MaxLength(500) classTeacherRemarks?: string;
}

export class UpdateStudentExamSummaryDto {
  @IsOptional() @IsNumber() totalMarksObtained?: number;
  @IsOptional() @IsNumber() percentage?: number;
  @IsOptional() @IsNumber() gpa?: number;
  @IsOptional() @IsString() @MaxLength(3) finalGrade?: string;
  @IsOptional() @IsInt() rankInSection?: number;
  @IsOptional() @IsInt() rankInGrade?: number;
  @IsOptional() @IsInt() totalAttendanceDays?: number;
  @IsOptional() @IsInt() presentDays?: number;
  @IsOptional() @IsString() @MaxLength(500) classTeacherRemarks?: string;
}