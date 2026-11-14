import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { BooleanParam } from '../../common/decorators/boolean-param.decorator.js';

export class CreateAcademicCalendarEventDto {
  @IsUUID() academicYearId!: string;
  @IsString() @MinLength(2) @MaxLength(160) titleEn!: string;
  @IsString() @MinLength(2) @MaxLength(160) titleNe!: string;
  @IsDate() @Type(() => Date) dateAd!: Date;
  @IsString() @MaxLength(10) dateBs!: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isHoliday?: boolean = false;
}

export class UpdateAcademicCalendarEventDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) titleEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(160) titleNe?: string;
  @IsOptional() @IsDate() @Type(() => Date) dateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) dateBs?: string;
  @BooleanParam()
  @IsOptional() @IsBoolean() isHoliday?: boolean;
}
