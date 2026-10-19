import { IsDate, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentTransportDto {
  @IsUUID() enrollmentId!: string;
  @IsUUID() routeId!: string;
  @IsOptional() @IsUUID() stopId?: string;
  @IsOptional() @IsUUID() vehicleId?: string;
  @IsDate() @Type(() => Date) startDate!: Date;
  @IsOptional() @Type(() => Date) endDate?: Date;
  @IsOptional() @IsString() @MaxLength(20) status?: string = 'ACTIVE';
}

export class UpdateStudentTransportDto {
  @IsOptional() @IsUUID() routeId?: string;
  @IsOptional() @IsUUID() stopId?: string;
  @IsOptional() @IsUUID() vehicleId?: string;
  @IsOptional() @Type(() => Date) startDate?: Date;
  @IsOptional() @Type(() => Date) endDate?: Date;
  @IsOptional() @IsString() @MaxLength(20) status?: string;
}