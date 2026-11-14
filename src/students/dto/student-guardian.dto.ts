import { GuardianRelationship } from '../../generated/prisma/client.js';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateStudentGuardianDto {
  @IsUUID() studentId!: string;
  @IsUUID() guardianId!: string;
  @IsOptional() @IsEnum(GuardianRelationship) relationship?: GuardianRelationship = GuardianRelationship.GUARDIAN;
  @IsOptional() @IsString() otherRelationship?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isPrimary?: boolean = false;
}

export class UpdateStudentGuardianDto {
  @IsOptional() @IsEnum(GuardianRelationship) relationship?: GuardianRelationship;
  @IsOptional() @IsString() otherRelationship?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isPrimary?: boolean;
}