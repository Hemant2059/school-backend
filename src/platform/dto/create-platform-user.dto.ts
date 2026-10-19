import { PlatformUserStatus } from '../../generated/prisma/client.js';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlatformUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  firstNameEn!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  firstNameNe!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  lastNameEn!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  lastNameNe!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'phone must be a valid number' })
  phone?: string;

  @IsOptional()
  @IsEnum(PlatformUserStatus)
  status?: PlatformUserStatus = PlatformUserStatus.INVITED;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  district?: string;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean = false;

  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleNames?: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionCodes?: string[] = [];
}