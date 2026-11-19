import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

/**
 * The tenant's own branding — the surface `custom.branding` (premium)
 * unlocks. Deliberately narrow: schools cannot use this to edit their
 * registered identity (IEMIS code, PAN, legal name) — that stays with
 * platform admins via the main tenant update.
 */
export class UpdateBrandingDto {
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(500) logoUrl?: string;
  @IsOptional() @IsUrl({ require_tld: false }) @MaxLength(300) website?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(120) motoEn?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(120) motoNe?: string;
}
