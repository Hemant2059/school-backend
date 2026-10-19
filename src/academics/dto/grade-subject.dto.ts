import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateGradeSubjectDto {
  @IsUUID() gradeLevelId!: string;
  @IsUUID() subjectId!: string;
  @IsOptional() @IsInt() @Min(0) creditHours?: number;
  @IsOptional() @IsInt() @Min(0) theoryCreditHours?: number;
  @IsOptional() @IsInt() @Min(0) internalCreditHours?: number;
  @IsOptional() @IsNumber() @Min(0) theoryFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) theoryPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalPassMarks?: number;
  @IsOptional() @IsBoolean() isOptional?: boolean = false;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number = 0;
}

export class UpdateGradeSubjectDto {
  @IsOptional() @IsUUID() gradeLevelId?: string;
  @IsOptional() @IsUUID() subjectId?: string;
  @IsOptional() @IsInt() @Min(0) creditHours?: number;
  @IsOptional() @IsInt() @Min(0) theoryCreditHours?: number;
  @IsOptional() @IsInt() @Min(0) internalCreditHours?: number;
  @IsOptional() @IsNumber() @Min(0) theoryFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) theoryPassMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalFullMarks?: number;
  @IsOptional() @IsNumber() @Min(0) internalPassMarks?: number;
  @IsOptional() @IsBoolean() isOptional?: boolean;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}
