import { EmploymentType, Gender, MaritalStatusForTax, StaffCategory, TeacherTrainingStatus } from '../../generated/prisma/client.js';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class CreateStaffProfileDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsString() @MaxLength(40) employeeCode?: string;
  @IsOptional() @IsString() @MaxLength(40) iemisTeacherId?: string;
  @IsString() @MinLength(2) @MaxLength(120) firstNameEn!: string;
  @IsOptional() @IsString() @MaxLength(120) firstNameNe?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameNe?: string;
  @IsString() @MinLength(2) @MaxLength(120) lastNameEn!: string;
  @IsOptional() @IsString() @MaxLength(120) lastNameNe?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsString() @MaxLength(40) casteEthnicityCode?: string;
  @IsOptional() @IsString() @MaxLength(80) casteEthnicity?: string;
  @IsOptional() @IsEnum(StaffCategory) staffCategory?: StaffCategory;
  @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @IsOptional() @IsString() @MaxLength(80) teachingLicenseNo?: string;
  @IsOptional() @IsString() @MaxLength(120) highestQualification?: string;
  @IsOptional() @IsEnum(TeacherTrainingStatus) teacherTrainingStatus?: TeacherTrainingStatus;
  @IsOptional() @IsString() @MaxLength(40) panNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) pfNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) citNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) ssfNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) bankAccountNo?: string;
  @IsOptional() @IsEnum(MaritalStatusForTax) maritalStatusForTax?: MaritalStatusForTax;

  /// The agreed monthly package. The payroll engine reads these to compute
  /// the gross, the statutory deductions and the net.
  @IsOptional() @IsNumber() @Min(0) basicSalary?: number;
  @IsOptional() @IsNumber() @Min(0) gradeAllowance?: number;
  @IsOptional() @IsNumber() @Min(0) dearnessAllowance?: number;
}

export class UpdateStaffProfileDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsString() @MaxLength(40) employeeCode?: string;
  @IsOptional() @IsString() @MaxLength(40) iemisTeacherId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) firstNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) firstNameNe?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameNe?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) lastNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) lastNameNe?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsString() @MaxLength(40) casteEthnicityCode?: string;
  @IsOptional() @IsString() @MaxLength(80) casteEthnicity?: string;
  @IsOptional() @IsEnum(StaffCategory) staffCategory?: StaffCategory;
  @IsOptional() @IsEnum(EmploymentType) employmentType?: EmploymentType;
  @IsOptional() @IsString() @MaxLength(80) teachingLicenseNo?: string;
  @IsOptional() @IsString() @MaxLength(120) highestQualification?: string;
  @IsOptional() @IsEnum(TeacherTrainingStatus) teacherTrainingStatus?: TeacherTrainingStatus;
  @IsOptional() @IsString() @MaxLength(40) panNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) pfNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) citNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) ssfNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) bankAccountNo?: string;
  @IsOptional() @IsEnum(MaritalStatusForTax) maritalStatusForTax?: MaritalStatusForTax;

  /// The agreed monthly package. The payroll engine reads these to compute
  /// the gross, the statutory deductions and the net.
  @IsOptional() @IsNumber() @Min(0) basicSalary?: number;
  @IsOptional() @IsNumber() @Min(0) gradeAllowance?: number;
  @IsOptional() @IsNumber() @Min(0) dearnessAllowance?: number;
}