import { OrganizationStatus, OrganizationType } from '../../generated/prisma/client.js';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsInt, IsOptional, Matches, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrganizationDto {
  @IsString() @MinLength(2) @MaxLength(160) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(160) nameNe!: string;
  @IsOptional() @IsString() @MaxLength(80) shortName?: string;
  @IsOptional() @IsEnum(OrganizationType) organizationType?: OrganizationType = OrganizationType.OTHER;
  @IsOptional() @IsString() @MaxLength(80) registrationNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) panVatNumber?: string;
  @IsOptional() @IsDate() @Type(() => Date) establishedDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) @Matches(/^\d{4}-\d{2}-\d{2}$/) establishedDateBs?: string;
  @IsOptional() @IsBoolean() isTaxExempt?: boolean = false;
  @IsString() @MaxLength(20) provinceCode!: string;
  @IsString() @MaxLength(80) provinceNe!: string;
  @IsOptional() @IsString() @MaxLength(80) provinceEn?: string;
  @IsString() @MaxLength(20) districtCode!: string;
  @IsString() @MaxLength(80) districtNe!: string;
  @IsOptional() @IsString() @MaxLength(80) districtEn?: string;
  @IsString() @MaxLength(20) municipalityCode!: string;
  @IsString() @MaxLength(120) municipalityNe!: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityEn?: string;
  @IsInt() @Min(1) @Max(35) wardNumber!: number;
  @IsOptional() @IsString() @MaxLength(120) toleEn?: string;
  @IsOptional() @IsString() @MaxLength(120) toleNe?: string;
  @IsOptional() @IsString() @MaxLength(255) addressEn?: string;
  @IsOptional() @IsString() @MaxLength(255) addressNe?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(255) website?: string;
  @IsOptional() @IsString() @MaxLength(500) logoUrl?: string;
  @IsOptional() @IsString() @MaxLength(120) contactPersonName?: string;
  @IsOptional() @IsString() @MaxLength(30) contactPersonPhone?: string;
  @IsOptional() @IsEmail() contactPersonEmail?: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) fiscalYearStartMonth?: number = 7;
  @IsOptional() @IsString() @MaxLength(40) timezone?: string = 'Asia/Kathmandu';
  @IsOptional() @IsEnum(OrganizationStatus) status?: OrganizationStatus = OrganizationStatus.ACTIVE;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
  @IsOptional() @IsUUID() resellerPartnerId?: string;
}

export class UpdateOrganizationDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(80) shortName?: string;
  @IsOptional() @IsEnum(OrganizationType) organizationType?: OrganizationType;
  @IsOptional() @IsString() @MaxLength(80) registrationNumber?: string;
  @IsOptional() @IsString() @MaxLength(40) panVatNumber?: string;
  @IsOptional() @IsDate() @Type(() => Date) establishedDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) @Matches(/^\d{4}-\d{2}-\d{2}$/) establishedDateBs?: string;
  @IsOptional() @IsBoolean() isTaxExempt?: boolean;
  @IsOptional() @IsString() @MaxLength(20) provinceCode?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceNe?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceEn?: string;
  @IsOptional() @IsString() @MaxLength(20) districtCode?: string;
  @IsOptional() @IsString() @MaxLength(80) districtNe?: string;
  @IsOptional() @IsString() @MaxLength(80) districtEn?: string;
  @IsOptional() @IsString() @MaxLength(20) municipalityCode?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityNe?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityEn?: string;
  @IsOptional() @IsInt() @Min(1) @Max(35) wardNumber?: number;
  @IsOptional() @IsString() @MaxLength(120) toleEn?: string;
  @IsOptional() @IsString() @MaxLength(120) toleNe?: string;
  @IsOptional() @IsString() @MaxLength(255) addressEn?: string;
  @IsOptional() @IsString() @MaxLength(255) addressNe?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(255) website?: string;
  @IsOptional() @IsString() @MaxLength(500) logoUrl?: string;
  @IsOptional() @IsString() @MaxLength(120) contactPersonName?: string;
  @IsOptional() @IsString() @MaxLength(30) contactPersonPhone?: string;
  @IsOptional() @IsEmail() contactPersonEmail?: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) fiscalYearStartMonth?: number;
  @IsOptional() @IsString() @MaxLength(40) timezone?: string;
  @IsOptional() @IsEnum(OrganizationStatus) status?: OrganizationStatus;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
  @IsOptional() @IsUUID() resellerPartnerId?: string;
}

export class QueryOrganizationsDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsUUID() createdByPlatformUserId?: string;
  @IsOptional() @IsUUID() resellerPartnerId?: string;
  @IsOptional() @IsBoolean() includeDeleted?: boolean = false;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}