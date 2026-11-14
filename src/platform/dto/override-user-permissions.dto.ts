import { ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsString } from 'class-validator';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class OverrideUserPermissionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  permissionCodes!: string[];

  @BooleanParam()
  @IsBoolean()
  granted!: boolean;
}