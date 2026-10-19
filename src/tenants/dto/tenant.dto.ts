import { SchoolType, TenantStatus } from '../../generated/prisma/client.js';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsInt, Matches, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTenantDto {
  @IsOptional() @IsUUID() organizationId?: string;
  @IsString() @MinLength(2) @MaxLength(160) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(160) nameNe!: string;
  @IsString() @MinLength(2) @MaxLength(60) subdomain!: string;
  @IsString() @MaxLength(15) iemisCode!: string;
  @IsString() @MinLength(2) @MaxLength(60) schoolCode!: string;
  @IsString() @MinLength(2) @MaxLength(80) registrationNumber!: string;
  @IsString() @MinLength(2) @MaxLength(40) panVatNumber!: string;
  @IsEnum(SchoolType) schoolType!: SchoolType;
  @IsString() @MaxLength(20) provinceCode!: string;
  @IsString() @MaxLength(80) provinceNe!: string;
  @IsString() @MaxLength(80) provinceEn!: string;
  @IsString() @MaxLength(20) districtCode!: string;
  @IsString() @MaxLength(80) districtNe!: string;
  @IsString() @MaxLength(80) districtEn!: string;
  @IsString() @MaxLength(20) municipalityCode!: string;
  @IsString() @MaxLength(120) municipalityNe!: string;
  @IsString() @MaxLength(120) municipalityEn!: string;
  @IsInt() @Min(1) @Max(35) wardNumber!: number;
  @IsString() @MaxLength(120) toleEn!: string;
  @IsString() @MaxLength(120) toleNe!: string;
  @IsOptional() @IsString() @MaxLength(255) addressEn?: string;
  @IsOptional() @IsString() @MaxLength(255) addressNe?: string;
  @IsString() @MaxLength(30) phone!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(255) website?: string;
  @IsOptional() @IsString() @MaxLength(500) logoUrl?: string;
  @IsDate() @Type(() => Date) establishedDateAd!: Date;
  @IsString() @MaxLength(10) @Matches(/^\d{4}-\d{2}-\d{2}$/) establishedDateBs!: string;
  @IsString() @MaxLength(255) motoEn!: string;
  @IsString() @MaxLength(255) motoNe!: string;
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
  @IsOptional() @IsEnum(TenantStatus) status?: TenantStatus = TenantStatus.ONBOARDING;
}

export class UpdateTenantDto {
  @IsOptional() @IsUUID() organizationId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) nameNe?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(60) subdomain?: string;
  @IsOptional() @IsString() @MaxLength(15) iemisCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(60) schoolCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80) registrationNumber?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) panVatNumber?: string;
  @IsOptional() @IsEnum(SchoolType) schoolType?: SchoolType;
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
  @IsOptional() @IsDate() @Type(() => Date) establishedDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) @Matches(/^\d{4}-\d{2}-\d{2}$/) establishedDateBs?: string;
  @IsOptional() @IsString() @MaxLength(255) motoEn?: string;
  @IsOptional() @IsString() @MaxLength(255) motoNe?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsEnum(TenantStatus) status?: TenantStatus;
}

export class QueryTenantsDto {
  @IsOptional() @IsUUID() organizationId?: string;
  @IsOptional() @IsEnum(SchoolType) schoolType?: SchoolType;
  @IsOptional() @IsEnum(TenantStatus) status?: TenantStatus;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsBoolean() includeDeleted?: boolean = false;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}