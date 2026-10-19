import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength, ArrayUnique, ArrayMinSize } from 'class-validator';

export class CreateRoleDto {
  @IsString() @MinLength(2) @MaxLength(80)
  name!: string;

  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

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

  @IsOptional() @IsBoolean()
  isPrimary?: boolean = false;

  @IsOptional() @IsArray() @ArrayUnique() @IsString({ each: true })
  roleNames?: string[] = [];
}

export class UpdateTenantUserDto {
  @IsOptional() @IsBoolean()
  isPrimary?: boolean;

  @IsOptional() @IsString()
  status?: string;
}

export class AssignTenantUserRolesDto {
  @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsString({ each: true })
  roleNames!: string[];
}