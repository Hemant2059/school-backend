import { DisabilityType, Gender } from '../../generated/prisma/client.js';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsString() @MinLength(2) @MaxLength(40) admissionNo!: string;
  @IsOptional() @IsString() @MaxLength(20) iemisStudentId?: string;
  @IsOptional() @IsString() @MaxLength(40) nebRegistrationNo?: string;
  @IsOptional() @IsString() @MaxLength(40) symbolNo?: string;
  @IsString() @MinLength(2) @MaxLength(120) firstNameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) firstNameNe!: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameNe?: string;
  @IsString() @MinLength(2) @MaxLength(120) lastNameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) lastNameNe!: string;
  @IsDate() @Type(() => Date) dobAd!: Date;
  @IsString() @MaxLength(10) dobBs!: string;
  @IsEnum(Gender) gender!: Gender;
  @IsString() @MinLength(1) @MaxLength(40) casteEthnicityCode!: string;
  @IsString() @MinLength(2) @MaxLength(80) casteEthnicity!: string;
  @IsOptional() @IsEnum(DisabilityType) disabilityType?: DisabilityType = DisabilityType.NONE;
  @IsString() @MinLength(2) @MaxLength(60) motherTongue!: string;
  @IsOptional() @IsString() @MaxLength(10) bloodGroup?: string;
  @IsString() @MinLength(2) @MaxLength(40) birthCertificateNo!: string;
  @IsString() @MinLength(2) @MaxLength(40) nationalIdNin!: string;
  @IsOptional() @IsBoolean() hadEcdExperience?: boolean = false;
  @IsOptional() @IsString() @MaxLength(500) photoUrl?: string;
}

export class UpdateStudentDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) admissionNo?: string;
  @IsOptional() @IsString() @MaxLength(20) iemisStudentId?: string;
  @IsOptional() @IsString() @MaxLength(40) nebRegistrationNo?: string;
  @IsOptional() @IsString() @MaxLength(40) symbolNo?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) firstNameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) firstNameNe?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) middleNameNe?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) lastNameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) lastNameNe?: string;
  @IsOptional() @IsDate() @Type(() => Date) dobAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) dobBs?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(40) casteEthnicityCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) casteEthnicity?: string;
  @IsOptional() @IsEnum(DisabilityType) disabilityType?: DisabilityType;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(60) motherTongue?: string;
  @IsOptional() @IsString() @MaxLength(10) bloodGroup?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) birthCertificateNo?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) nationalIdNin?: string;
  @IsOptional() @IsBoolean() hadEcdExperience?: boolean;
  @IsOptional() @IsString() @MaxLength(500) photoUrl?: string;
}