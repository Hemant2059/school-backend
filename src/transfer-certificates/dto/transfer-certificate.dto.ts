import { IsDate, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransferCertificateDto {
  @IsUUID() studentId!: string;
  @IsDate() @Type(() => Date) issueDateAd!: Date;
  @IsString() @MaxLength(10) issueDateBs!: string;
  @IsString() @MinLength(2) @MaxLength(60) tcNumber!: string;
  @IsOptional() @IsString() @MaxLength(20) destinationIemisCode?: string;
  @IsString() @MinLength(2) @MaxLength(500) characterRemark!: string;
  @IsString() @MinLength(2) @MaxLength(500) leavingReason!: string;
}

export class UpdateTransferCertificateDto {
  @IsOptional() @IsDate() @Type(() => Date) issueDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) issueDateBs?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(60) tcNumber?: string;
  @IsOptional() @IsString() @MaxLength(20) destinationIemisCode?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(500) characterRemark?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(500) leavingReason?: string;
}