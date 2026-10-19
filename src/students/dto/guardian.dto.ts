import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateGuardianDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsOptional() @IsString() @MaxLength(120) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(80) occupation?: string;
  @IsOptional() citizenshipDetails?: any;
  @IsOptional() @IsString() @MaxLength(40) nationalIdNin?: string;
  @IsOptional() @IsString() @MaxLength(500) photoUrl?: string;
}

export class UpdateGuardianDto {
  @IsOptional() @IsUUID() userId?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MaxLength(120) nameNe?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(80) occupation?: string;
  @IsOptional() citizenshipDetails?: any;
  @IsOptional() @IsString() @MaxLength(40) nationalIdNin?: string;
  @IsOptional() @IsString() @MaxLength(500) photoUrl?: string;
}