import { HostelType } from '../../generated/prisma/client.js';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateHostelDto {
  @IsString() @MinLength(2) @MaxLength(120) nameEn!: string;
  @IsString() @MinLength(2) @MaxLength(120) nameNe!: string;
  @IsOptional() @IsEnum(HostelType) type?: HostelType = HostelType.MIXED;
  @IsOptional() @IsInt() @Min(1) @Max(10000) capacity?: number;
  @IsOptional() @IsUUID() wardenStaffId?: string;
}

export class UpdateHostelDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameEn?: string;
  @IsOptional() @IsString() @MinLength(2) @MaxLength(120) nameNe?: string;
  @IsOptional() @IsEnum(HostelType) type?: HostelType;
  @IsOptional() @IsInt() @Min(1) @Max(10000) capacity?: number;
  @IsOptional() @IsUUID() wardenStaffId?: string;
}

export class CreateHostelRoomDto {
  @IsUUID() hostelId!: string;
  @IsString() @MinLength(1) @MaxLength(40) roomNumber!: string;
  @IsOptional() @IsInt() @Min(0) floor?: number;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsString() @MaxLength(40) roomType?: string;
}

export class UpdateHostelRoomDto {
  @IsOptional() @IsUUID() hostelId?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(40) roomNumber?: string;
  @IsOptional() @IsInt() @Min(0) floor?: number;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsString() @MaxLength(40) roomType?: string;
}

export class CreateHostelAllocationDto {
  @IsUUID() hostelId!: string;
  @IsUUID() roomId!: string;
  @IsUUID() enrollmentId!: string;
  @IsString() @MaxLength(20) startDate!: string;
  @IsOptional() @IsString() @MaxLength(20) endDate?: string;
  @IsOptional() @IsString() @MaxLength(20) status?: string = 'ACTIVE';
}

export class UpdateHostelAllocationDto {
  @IsOptional() @IsUUID() roomId?: string;
  @IsOptional() @IsString() @MaxLength(20) endDate?: string;
  @IsOptional() @IsString() @MaxLength(20) status?: string;
}