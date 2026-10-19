import { ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsString } from 'class-validator';

export class OverrideUserPermissionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  permissionCodes!: string[];

  @IsBoolean()
  granted!: boolean;
}