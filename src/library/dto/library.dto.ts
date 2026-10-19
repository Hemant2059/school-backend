import { BookIssueStatus } from '../../generated/prisma/client.js';
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLibraryBookDto {
  @IsString() @MinLength(2) @MaxLength(200) titleEn!: string;
  @IsString() @MinLength(2) @MaxLength(200) titleNe!: string;
  @IsOptional() @IsString() @MaxLength(200) authorEn?: string;
  @IsOptional() @IsString() @MaxLength(200) authorNe?: string;
  @IsOptional() @IsString() @MaxLength(40) isbn?: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsInt() @Min(1) totalCopies?: number = 1;
  @IsOptional() @IsInt() @Min(0) availableCopies?: number = 1;
}

export class UpdateLibraryBookDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) titleNe?: string;
  @IsOptional() @IsString() @MaxLength(200) authorEn?: string;
  @IsOptional() @IsString() @MaxLength(200) authorNe?: string;
  @IsOptional() @IsString() @MaxLength(40) isbn?: string;
  @IsOptional() @IsString() @MaxLength(80) category?: string;
  @IsOptional() @IsInt() @Min(1) totalCopies?: number;
  @IsOptional() @IsInt() @Min(0) availableCopies?: number;
}

export class CreateBookIssueDto {
  @IsUUID() bookId!: string;
  @IsUUID() studentId!: string;
  @IsDate() @Type(() => Date) issueDateAd!: Date;
  @IsOptional() @IsString() @MaxLength(10) issueDateBs?: string;
  @IsDate() @Type(() => Date) dueDateAd!: Date;
  @IsOptional() @IsString() @MaxLength(10) dueDateBs?: string;
  @IsOptional() @IsDate() @Type(() => Date) returnDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) returnDateBs?: string;
  @IsOptional() @IsNumber() @Min(0) fineAmount?: number = 0;
  @IsOptional() @IsEnum(BookIssueStatus) status?: BookIssueStatus = BookIssueStatus.ISSUED;
}

export class UpdateBookIssueDto {
  @IsOptional() @IsDate() @Type(() => Date) returnDateAd?: Date;
  @IsOptional() @IsString() @MaxLength(10) returnDateBs?: string;
  @IsOptional() @IsNumber() @Min(0) fineAmount?: number;
  @IsOptional() @IsEnum(BookIssueStatus) status?: BookIssueStatus;
}