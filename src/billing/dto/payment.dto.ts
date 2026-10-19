import { PaymentMethod, PaymentStatus } from '../../generated/prisma/client.js';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../platform/dto/pagination.dto.js';

export class QueryPaymentsDto extends PaginationQueryDto {
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;
}

export class CreatePaymentDto {
  @IsUUID() invoiceId!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsString() currency?: string = 'NPR';
  @IsEnum(PaymentMethod) method!: PaymentMethod;
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus = PaymentStatus.PENDING;
  @IsOptional() @IsString() transactionRef?: string;
  @IsOptional() @IsDate() @Type(() => Date) paidAt?: Date;
}