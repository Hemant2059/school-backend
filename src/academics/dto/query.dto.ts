import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../platform/dto/pagination.dto.js';

export class QueryStreamsDto extends PaginationQueryDto {
  @IsOptional() @IsString() search?: string;
}

export class QueryGradeLevelsDto extends PaginationQueryDto {
  @IsOptional() @IsString() search?: string;
}

export class QuerySectionsDto extends PaginationQueryDto {
  @IsOptional() @IsString() search?: string;
}

export class QueryStaffProfilesDto extends PaginationQueryDto {
  @IsOptional() @IsString() search?: string;
}
