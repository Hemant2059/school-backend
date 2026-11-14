import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from './pagination.dto.js';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class QueryPlatformRolesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @BooleanParam()
  @IsBoolean()
  isSystem?: boolean;
}