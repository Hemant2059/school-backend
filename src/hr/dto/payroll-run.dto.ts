import { PayrollRunStatus } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CreatePayrollRunDto {
  @IsUUID() fiscalYearId!: string;
  @IsInt() @Min(2000) @Max(2200) bsYear!: number;
  @IsInt() @Min(1) @Max(12) bsMonth!: number;
  @IsOptional() @IsEnum(PayrollRunStatus) status?: PayrollRunStatus = PayrollRunStatus.DRAFT;
}

export class UpdatePayrollRunDto {
  @IsOptional() @IsEnum(PayrollRunStatus) status?: PayrollRunStatus;
}