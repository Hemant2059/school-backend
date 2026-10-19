import { IemisScholarshipType } from '../../generated/prisma/client.js';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateScholarshipSchemeDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsEnum(IemisScholarshipType) iemisScholarshipType!: IemisScholarshipType;
}

export class UpdateScholarshipSchemeDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) name?: string;
  @IsOptional() @IsEnum(IemisScholarshipType) iemisScholarshipType?: IemisScholarshipType;
}