import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class AssignPlanFeatureDto {
  @IsString() featureCode!: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isEnabled?: boolean = true;
  @IsOptional() @IsInt() @Min(0) limit?: number;
  @IsOptional() config?: any;
}

export class ReplacePlanFeaturesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignPlanFeatureDto)
  features!: AssignPlanFeatureDto[];
}

export class UpdatePlanFeatureDto {
  @BooleanParam()
  @IsOptional() @IsBoolean() isEnabled?: boolean;
  @IsOptional() @IsInt() @Min(0) limit?: number;
  @IsOptional() config?: any;
}