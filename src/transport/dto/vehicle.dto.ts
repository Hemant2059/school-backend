import { TransportVehicleType } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString() @MinLength(2) @MaxLength(40) vehicleNumber!: string;
  @IsOptional() @IsEnum(TransportVehicleType) type?: TransportVehicleType = TransportVehicleType.BUS;
  @IsOptional() @IsInt() @Min(1) @Max(100) capacity?: number;
  @IsOptional() @IsUUID() driverStaffId?: string;
}

export class UpdateVehicleDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(40) vehicleNumber?: string;
  @IsOptional() @IsEnum(TransportVehicleType) type?: TransportVehicleType;
  @IsOptional() @IsInt() @Min(1) @Max(100) capacity?: number;
  @IsOptional() @IsUUID() driverStaffId?: string;
}