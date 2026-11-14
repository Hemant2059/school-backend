import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength, ArrayUnique, ArrayMinSize } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateRoleDto {
  @IsString() @MinLength(2) @MaxLength(80)
  name!: string;

  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @BooleanParam()
  @IsOptional() @IsBoolean()
  isSystem?: boolean = false;

  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true })
  permissionCodes?: string[] = [];
}

export class UpdateRoleDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(80)
  name?: string;

  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @BooleanParam()
  @IsOptional() @IsBoolean()
  isSystem?: boolean;
}

export class AssignRolePermissionsDto {
  @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsString({ each: true })
  permissionCodes!: string[];
}

export class CreateTenantUserDto {
  @IsOptional() @IsUUID()
  userId?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString() @MinLength(2)
  firstNameEn?: string;

  @IsOptional() @IsString()
  firstNameNe?: string;

  @IsOptional() @IsString() @MinLength(2)
  lastNameEn?: string;

  @IsOptional() @IsString()
  lastNameNe?: string;

  @IsOptional() @IsString() @MinLength(6)
  password?: string;

  @BooleanParam()
  @IsOptional() @IsBoolean()
  isPrimary?: boolean = false;

  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true })
  roleNames?: string[] = [];
}

export class UpdateTenantUserDto {
  @BooleanParam()
  @IsOptional() @IsBoolean()
  isPrimary?: boolean;

  @IsOptional() @IsString()
  status?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString() @MinLength(2) @MaxLength(120)
  firstNameEn?: string;

  @IsOptional() @IsString() @MaxLength(120)
  firstNameNe?: string;

  @IsOptional() @IsString() @MinLength(2) @MaxLength(120)
  lastNameEn?: string;

  @IsOptional() @IsString() @MaxLength(120)
  lastNameNe?: string;

  /**
   * The password of the linked global identity is deliberately NOT settable
   * here. `User` is shared between tenants, so resetting it from a
   * tenant-scoped endpoint would let one school take over an account that
   * also belongs to another school. Users change their own password through
   * `POST /tenant/auth/change-password`.
   */
}

export class AssignTenantUserRolesDto {
  @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsString({ each: true })
  roleNames!: string[];
}