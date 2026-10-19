import { ArrayMinSize, ArrayUnique, IsArray, IsString } from 'class-validator';

export class AssignUserRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  roleNames!: string[];
}

export class RevokeUserRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  roleNames!: string[];
}