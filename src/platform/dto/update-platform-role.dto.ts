import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class UpdatePlatformRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @BooleanParam()
  @IsBoolean()
  isSystem?: boolean;
}