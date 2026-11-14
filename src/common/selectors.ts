import { Prisma } from '../generated/prisma/client.js';

/**
 * Explicit projections for the identity tables.
 *
 * `include: { user: true }` returns every scalar column of the related row,
 * which for `User` and `PlatformUser` means `passwordHash`,
 * `refreshTokenHash`, `twoFactorSecret` (the TOTP seed) and `invitationToken`
 * were all being served to anyone with `tenant_users.read` or
 * `platform_users.read`. These projections never include a credential.
 */

export const SAFE_USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  status: true,
  firstNameEn: true,
  firstNameNe: true,
  lastNameEn: true,
  lastNameNe: true,
  profilePhotoUrl: true,
  lastLoginAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const SAFE_PLATFORM_USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  status: true,
  firstNameEn: true,
  firstNameNe: true,
  middleNameEn: true,
  middleNameNe: true,
  lastNameEn: true,
  lastNameNe: true,
  address: true,
  emailVerifiedAt: true,
  phoneVerifiedAt: true,
  twoFactorEnabled: true,
  lastLoginAt: true,
  mustChangePassword: true,
  passwordChangedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PlatformUserSelect;

/**
 * The safe fields of a student.
 *
 * `nationalIdNin` and `birthCertificateNo` are government identifiers: they
 * must not appear in list responses, only when a single record is requested
 * by someone who may see them.
 */
export const STUDENT_LIST_SELECT = {
  id: true,
  tenantId: true,
  admissionNo: true,
  iemisStudentId: true,
  symbolNo: true,
  firstNameEn: true,
  firstNameNe: true,
  middleNameEn: true,
  middleNameNe: true,
  lastNameEn: true,
  lastNameNe: true,
  dobAd: true,
  dobBs: true,
  gender: true,
  disabilityType: true,
  motherTongue: true,
  bloodGroup: true,
  photoUrl: true,
  createdAt: true,
} satisfies Prisma.StudentSelect;
