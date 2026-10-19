import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreatePlatformPermissionDto {
  @IsString()
  @Matches(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/, {
    message: 'code must be a dotted lowercase identifier like "schools.read"',
  })
  code!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;
}