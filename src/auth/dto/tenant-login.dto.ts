import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class TenantLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}