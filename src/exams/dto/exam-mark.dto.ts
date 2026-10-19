import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateExamMarkDto {
  @IsUUID() examScheduleId!: string;
  @IsUUID() enrollmentId!: string;
  @IsOptional() @IsNumber() theoryMarksObtained?: number;
  @IsOptional() @IsBoolean() isTheoryAbsent?: boolean = false;
  @IsOptional() @IsNumber() internalMarksObtained?: number;
  @IsOptional() @IsBoolean() isInternalAbsent?: boolean = false;
  @IsOptional() internalBreakdown?: any;
  @IsOptional() @IsString() @MaxLength(3) theoryGrade?: string;
  @IsOptional() @IsNumber() theoryGp?: number;
  @IsOptional() @IsString() @MaxLength(3) internalGrade?: string;
  @IsOptional() @IsNumber() internalGp?: number;
  @IsOptional() @IsString() @MaxLength(3) finalSubjectGrade?: string;
  @IsOptional() @IsNumber() finalSubjectGp?: number;
  @IsOptional() @IsUUID() enteredByUserId?: string;
}

export class UpdateExamMarkDto {
  @IsOptional() @IsNumber() theoryMarksObtained?: number;
  @IsOptional() @IsBoolean() isTheoryAbsent?: boolean;
  @IsOptional() @IsNumber() internalMarksObtained?: number;
  @IsOptional() @IsBoolean() isInternalAbsent?: boolean;
  @IsOptional() internalBreakdown?: any;
  @IsOptional() @IsString() @MaxLength(3) theoryGrade?: string;
  @IsOptional() @IsNumber() theoryGp?: number;
  @IsOptional() @IsString() @MaxLength(3) internalGrade?: string;
  @IsOptional() @IsNumber() internalGp?: number;
  @IsOptional() @IsString() @MaxLength(3) finalSubjectGrade?: string;
  @IsOptional() @IsNumber() finalSubjectGp?: number;
  @IsOptional() @IsUUID() enteredByUserId?: string;
}