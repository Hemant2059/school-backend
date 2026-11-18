import { AddressEntityType, AddressFormat, AddressType } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateAddressDto {
  @IsEnum(AddressEntityType) entityType!: AddressEntityType;
  @IsString() entityId!: string;
  @IsEnum(AddressType) type!: AddressType;
  @IsEnum(AddressFormat) format!: AddressFormat;

  // Provincial format
  @IsOptional() @IsString() @MaxLength(20) provinceCode?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceNe?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceEn?: string;
  @IsOptional() @IsString() @MaxLength(20) districtCode?: string;
  @IsOptional() @IsString() @MaxLength(80) districtNe?: string;
  @IsOptional() @IsString() @MaxLength(80) districtEn?: string;
  @IsOptional() @IsString() @MaxLength(20) municipalityCode?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityNe?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityEn?: string;
  @IsOptional() @IsInt() @Min(1) @Max(35) ward?: number;
  @IsOptional() @IsString() @MaxLength(120) toleNe?: string;
  @IsOptional() @IsString() @MaxLength(120) toleEn?: string;

  // Zonal format
  @IsOptional() @IsString() @MaxLength(20) zoneCode?: string;
  @IsOptional() @IsString() @MaxLength(80) zoneNe?: string;
  @IsOptional() @IsString() @MaxLength(80) zoneEn?: string;
  @IsOptional() @IsString() @MaxLength(20) vdcCode?: string;
  @IsOptional() @IsString() @MaxLength(120) vdcNe?: string;
  @IsOptional() @IsString() @MaxLength(120) vdcEn?: string;
  @IsOptional() @IsString() @MaxLength(120) village?: string;

  /// Where the address is, for mapping and route planning.
  @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;
  @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;
}

export class UpdateAddressDto {
  @IsOptional() @IsEnum(AddressType) type?: AddressType;
  @IsOptional() @IsEnum(AddressFormat) format?: AddressFormat;
  @IsOptional() @IsString() @MaxLength(20) provinceCode?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceNe?: string;
  @IsOptional() @IsString() @MaxLength(80) provinceEn?: string;
  @IsOptional() @IsString() @MaxLength(20) districtCode?: string;
  @IsOptional() @IsString() @MaxLength(80) districtNe?: string;
  @IsOptional() @IsString() @MaxLength(80) districtEn?: string;
  @IsOptional() @IsString() @MaxLength(20) municipalityCode?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityNe?: string;
  @IsOptional() @IsString() @MaxLength(120) municipalityEn?: string;
  @IsOptional() @IsInt() @Min(1) @Max(35) ward?: number;
  @IsOptional() @IsString() @MaxLength(120) toleNe?: string;
  @IsOptional() @IsString() @MaxLength(120) toleEn?: string;
  @IsOptional() @IsString() @MaxLength(20) zoneCode?: string;
  @IsOptional() @IsString() @MaxLength(80) zoneNe?: string;
  @IsOptional() @IsString() @MaxLength(80) zoneEn?: string;
  @IsOptional() @IsString() @MaxLength(20) vdcCode?: string;
  @IsOptional() @IsString() @MaxLength(120) vdcNe?: string;
  @IsOptional() @IsString() @MaxLength(120) vdcEn?: string;
  @IsOptional() @IsString() @MaxLength(120) village?: string;
  @IsOptional() @IsNumber() @Min(-90) @Max(90) latitude?: number;
  @IsOptional() @IsNumber() @Min(-180) @Max(180) longitude?: number;
}
