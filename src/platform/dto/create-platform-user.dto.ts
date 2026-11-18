import { PlatformUserStatus } from '../../generated/prisma/client.js';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreatePlatformUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  firstNameEn!: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
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

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  lastNameEn!: string;

  @IsOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  lastNameNe?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'phone must be a valid number' })
  phone?: string;

  @IsOptional()
  @IsEnum(PlatformUserStatus)
  /**
   * Defaults to ACTIVE, because credentials are issued with the account.
   * Pass INVITED explicitly to onboard someone later.
   */
  status?: PlatformUserStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @BooleanParam()
  @IsBoolean()
  twoFactorEnabled?: boolean = false;

  @IsOptional()
  @BooleanParam()
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

  /**
   * Initial password. When omitted a strong temporary password is generated
   * and returned exactly once in the creation response, together with
   * `mustChangePassword` set. Previously no password was ever set, so a
   * newly created platform user could not log in at all.
   */
  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password?: string;
}