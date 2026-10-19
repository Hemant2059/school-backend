import { IsUUID } from 'class-validator';

export class CreateTeacherSubjectAllocationDto {
  @IsUUID() academicYearId!: string;
  @IsUUID() staffId!: string;
  @IsUUID() sectionId!: string;
  @IsUUID() subjectId!: string;
}

export class UpdateTeacherSubjectAllocationDto {
  @IsUUID() academicYearId?: string;
  @IsUUID() staffId?: string;
  @IsUUID() sectionId?: string;
  @IsUUID() subjectId?: string;
}