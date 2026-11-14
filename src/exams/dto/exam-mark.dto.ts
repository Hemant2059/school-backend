import { IsBoolean, IsNumber, IsObject, IsOptional, IsUUID, Min } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateExamMarkDto {
  @IsUUID() examScheduleId!: string;
  @IsUUID() enrollmentId!: string;

  @IsOptional() @IsNumber() @Min(0) theoryMarksObtained?: number;
  @BooleanParam()
  @IsOptional() @IsBoolean() isTheoryAbsent?: boolean = false;
  @IsOptional() @IsNumber() @Min(0) internalMarksObtained?: number;
  @BooleanParam()
  @IsOptional() @IsBoolean() isInternalAbsent?: boolean = false;
  @IsOptional() @IsObject() internalBreakdown?: Record<string, unknown>;

  /**
   * The letter grade and the grade points are derived by the server from the
   * tenant's grading scale. They are deliberately not accepted here: a
   * caller used to be able to award `finalSubjectGp: 4.0` for 12% marks.
   */
}

export class UpdateExamMarkDto {
  @IsOptional() @IsNumber() @Min(0) theoryMarksObtained?: number;
  @BooleanParam()
  @IsOptional() @IsBoolean() isTheoryAbsent?: boolean;
  @IsOptional() @IsNumber() @Min(0) internalMarksObtained?: number;
  @BooleanParam()
  @IsOptional() @IsBoolean() isInternalAbsent?: boolean;
  @IsOptional() @IsObject() internalBreakdown?: Record<string, unknown>;
}
