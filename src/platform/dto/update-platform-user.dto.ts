import { PlatformUserStatus } from '../../generated/prisma/client.js';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePlatformUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  firstNameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  firstNameNe?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  middleNameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  middleNameNe?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  lastNameEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  lastNameNe?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'phone must be a valid number' })
  phone?: string;

  @IsOptional()
  @IsEnum(PlatformUserStatus)
  status?: PlatformUserStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionCodes?: string[];
}