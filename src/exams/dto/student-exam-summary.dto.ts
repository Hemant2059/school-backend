import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStudentExamSummaryDto {
  @IsUUID() examId!: string;
  @IsUUID() enrollmentId!: string;

  /**
   * `totalMarksObtained`, `percentage`, `gpa`, `finalGrade`, `rankInSection`,
   * `rankInGrade` and the attendance counters are computed by the server from
   * the recorded marks and the grading scale. They are no longer accepted
   * from the client.
   */
  @IsOptional() @IsString() @MaxLength(500) classTeacherRemarks?: string;
}

export class UpdateStudentExamSummaryDto {
  /** Only the class teacher's remark may be edited by hand. */
  @IsOptional() @IsString() @MaxLength(500) classTeacherRemarks?: string;
}
