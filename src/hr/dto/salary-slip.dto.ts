import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateSalarySlipDto {
  @IsUUID() payrollRunId!: string;
  @IsUUID() staffId!: string;
  @IsNumber() @Min(0) basicSalary!: number;
  @IsOptional() @IsNumber() @Min(0) gradeAllowance?: number = 0;
  @IsOptional() @IsNumber() @Min(0) dearnessAllowance?: number = 0;
  @IsOptional() @IsNumber() @Min(0) employerPfSsfContribution?: number = 0;
  @IsOptional() @IsNumber() @Min(0) employeePfSsfDeduction?: number = 0;
  @IsOptional() @IsNumber() @Min(0) citDeduction?: number = 0;
  @IsOptional() @IsNumber() @Min(0) salaryAdvanceDeduction?: number = 0;
  @IsOptional() @IsNumber() @Min(0) sstTax1Percent?: number = 0;
  @IsOptional() @IsNumber() @Min(0) tdsIncomeTax?: number = 0;
  @IsNumber() @Min(0) netPayable!: number;
}

export class UpdateSalarySlipDto {
  @IsOptional() @IsNumber() @Min(0) basicSalary?: number;
  @IsOptional() @IsNumber() @Min(0) gradeAllowance?: number;
  @IsOptional() @IsNumber() @Min(0) dearnessAllowance?: number;
  @IsOptional() @IsNumber() @Min(0) employerPfSsfContribution?: number;
  @IsOptional() @IsNumber() @Min(0) employeePfSsfDeduction?: number;
  @IsOptional() @IsNumber() @Min(0) citDeduction?: number;
  @IsOptional() @IsNumber() @Min(0) salaryAdvanceDeduction?: number;
  @IsOptional() @IsNumber() @Min(0) sstTax1Percent?: number;
  @IsOptional() @IsNumber() @Min(0) tdsIncomeTax?: number;
  @IsOptional() @IsNumber() @Min(0) netPayable?: number;
}