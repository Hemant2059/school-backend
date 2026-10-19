import { InvoiceStatus } from '../../generated/prisma/client.js';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../platform/dto/pagination.dto.js';

export class CreateInvoiceDto {
  @IsOptional() @IsUUID() subscriptionId?: string;
  @IsString() number!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsString() currency?: string = 'NPR';
  @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus = InvoiceStatus.ISSUED;
  @IsDate() @Type(() => Date) dueDate!: Date;
  @IsOptional() @IsDate() @Type(() => Date) issueDate?: Date;
  @IsOptional() @IsString() notes?: string;
}

export class QueryInvoicesDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus;
}

export class UpdateInvoiceDto {
  @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus;
  @IsOptional() @IsDate() @Type(() => Date) dueDate?: Date;
  @IsOptional() @IsDate() @Type(() => Date) paidAt?: Date;
  @IsOptional() @IsString() notes?: string;
}