-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PlatformUserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('TRUST', 'FOUNDATION', 'COMPANY', 'NGO', 'GOVERNMENT', 'COOPERATIVE', 'SCHOOL_GROUP', 'OTHER');

-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('COMMUNITY', 'INSTITUTIONAL_PRIVATE', 'GUTHI', 'COOPERATIVE', 'RELIGIOUS');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TenantUserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'VOID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'ESEWA', 'KHALTI', 'CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('PERCENTAGE', 'GPA', 'LETTER', 'CGPA');

-- CreateEnum
CREATE TYPE "StaffCategory" AS ENUM ('TEACHING', 'NON_TEACHING_ADMIN', 'SUPPORT_DRIVER_HELPER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('GOVT_PERMANENT', 'GOVT_TEMPORARY', 'RAHAT_GRANT', 'LOCAL_LEVEL_GRANT', 'PRIVATE_SOURCE', 'ECD_FACILITATOR');

-- CreateEnum
CREATE TYPE "TeacherTrainingStatus" AS ENUM ('TPD_COMPLETED', 'PARTIAL', 'UNTRAINED');

-- CreateEnum
CREATE TYPE "MaritalStatusForTax" AS ENUM ('SINGLE', 'MARRIED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "DisabilityType" AS ENUM ('NONE', 'PHYSICAL', 'MENTAL', 'DEAF', 'BLIND', 'LOW_VISION', 'DEAF_BLIND', 'SPEECH', 'INTELLECTUAL', 'AUTISM', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "AddressEntityType" AS ENUM ('STUDENT', 'STAFF', 'GUARDIAN', 'USER', 'TENANT', 'ORGANIZATION', 'PLATFORM_USER');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('PERMANENT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "AddressFormat" AS ENUM ('PROVINCIAL', 'ZONAL');

-- CreateEnum
CREATE TYPE "GuardianRelationship" AS ENUM ('FATHER', 'MOTHER', 'GRANDFATHER', 'GRANDMOTHER', 'GUARDIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('NEW_ADMISSION', 'PROMOTED', 'REPEATED', 'TRANSFERRED_IN', 'TRANSFERRED_OUT', 'DROPOUT', 'GRADUATED');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('TERMINAL', 'PERIODIC', 'UNIT', 'PRACTICAL', 'INTERNAL');

-- CreateEnum
CREATE TYPE "FeeFrequency" AS ENUM ('MONTHLY_BS', 'ONE_TIME', 'TERM_WISE', 'ANNUAL', 'AD_HOC');

-- CreateEnum
CREATE TYPE "IemisScholarshipType" AS ENUM ('DALIT', 'JANAJATI', 'MARTYR_CHILD', 'CONFLICT_VICTIM', 'POOR_TALENTED', 'DISABILITY', 'MUNICIPAL_QUOTA', 'SCHOOL_INTERNAL');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FLAT_AMOUNT');

-- CreateEnum
CREATE TYPE "FeeInvoiceStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'VOIDED_BY_CREDIT_NOTE');

-- CreateEnum
CREATE TYPE "FeePaymentMethod" AS ENUM ('CASH', 'ESEWA', 'KHALTI', 'FONEPAY_QR', 'CONNECT_IPS', 'BANK_VOUCHER', 'CHEQUE');

-- CreateEnum
CREATE TYPE "FeePaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "PayrollRunStatus" AS ENUM ('DRAFT', 'APPROVED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "TransportVehicleType" AS ENUM ('BUS', 'MICROBUS', 'VAN', 'OTHER');

-- CreateEnum
CREATE TYPE "BookIssueStatus" AS ENUM ('ISSUED', 'RETURNED', 'OVERDUE', 'LOST');

-- CreateEnum
CREATE TYPE "HostelType" AS ENUM ('BOYS', 'GIRLS', 'MIXED');

-- CreateEnum
CREATE TYPE "NotificationRecipientType" AS ENUM ('USER', 'PLATFORM_USER');

-- CreateTable
CREATE TABLE "PlatformUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstNameEn" TEXT NOT NULL,
    "firstNameNe" TEXT NOT NULL,
    "middleNameEn" TEXT,
    "middleNameNe" TEXT,
    "lastNameEn" TEXT NOT NULL,
    "lastNameNe" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "status" "PlatformUserStatus" NOT NULL DEFAULT 'INVITED',
    "address" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "passwordChangedAt" TIMESTAMP(3),
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "invitationToken" TEXT,
    "invitationExpiresAt" TIMESTAMP(3),
    "invitationAcceptedAt" TIMESTAMP(3),
    "refreshTokenHash" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "invitedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlatformUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlatformRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformPermission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformRolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformRolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "PlatformUserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT,

    CONSTRAINT "PlatformUserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "PlatformUserPermission" (
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedById" TEXT,

    CONSTRAINT "PlatformUserPermission_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "billingCycle" "BillingCycle" NOT NULL,
    "trialDays" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFeature" (
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "limit" INTEGER,
    "config" JSONB,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("planId","featureId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "shortName" TEXT,
    "organizationType" "OrganizationType" NOT NULL DEFAULT 'OTHER',
    "registrationNumber" TEXT,
    "panVatNumber" TEXT,
    "establishedDateAd" TIMESTAMP(3),
    "establishedDateBs" VARCHAR(10),
    "isTaxExempt" BOOLEAN NOT NULL DEFAULT false,
    "provinceCode" TEXT NOT NULL,
    "provinceNe" TEXT NOT NULL,
    "provinceEn" TEXT,
    "districtCode" TEXT NOT NULL,
    "districtNe" TEXT NOT NULL,
    "districtEn" TEXT,
    "municipalityCode" TEXT NOT NULL,
    "municipalityNe" TEXT NOT NULL,
    "municipalityEn" TEXT,
    "wardNumber" INTEGER NOT NULL,
    "toleEn" TEXT,
    "toleNe" TEXT,
    "addressEn" TEXT,
    "addressNe" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "contactPersonName" TEXT NOT NULL,
    "contactPersonPhone" TEXT NOT NULL,
    "contactPersonEmail" TEXT,
    "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 7,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
    "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdByPlatformUserId" TEXT NOT NULL,
    "resellerPartnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "firstNameEn" TEXT NOT NULL,
    "firstNameNe" TEXT NOT NULL,
    "lastNameEn" TEXT NOT NULL,
    "lastNameNe" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "refreshTokenHash" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "iemisCode" VARCHAR(15) NOT NULL,
    "schoolCode" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "panVatNumber" TEXT NOT NULL,
    "schoolType" "SchoolType" NOT NULL,
    "provinceCode" TEXT NOT NULL,
    "provinceNe" TEXT NOT NULL,
    "provinceEn" TEXT NOT NULL,
    "districtCode" TEXT NOT NULL,
    "districtNe" TEXT NOT NULL,
    "districtEn" TEXT NOT NULL,
    "municipalityCode" TEXT NOT NULL,
    "municipalityNe" TEXT NOT NULL,
    "municipalityEn" TEXT NOT NULL,
    "wardNumber" INTEGER NOT NULL,
    "toleEn" TEXT NOT NULL,
    "toleNe" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "addressNe" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "logoUrl" TEXT,
    "establishedDateAd" TIMESTAMP(3) NOT NULL,
    "establishedDateBs" VARCHAR(10) NOT NULL,
    "motoEn" TEXT NOT NULL,
    "motoNe" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "status" "TenantStatus" NOT NULL DEFAULT 'ONBOARDING',
    "createdByPlatformUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "TenantUser" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "TenantUserStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "TenantUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantUserRole" (
    "tenantUserId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenantUserRole_pkey" PRIMARY KEY ("tenantUserId","roleId")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "assignedByPlatformUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "number" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'ISSUED',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionRef" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bsYear" SMALLINT NOT NULL,
    "startDateAd" TIMESTAMP(3) NOT NULL,
    "endDateAd" TIMESTAMP(3) NOT NULL,
    "startDateBs" VARCHAR(10) NOT NULL,
    "endDateBs" VARCHAR(10) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeLevel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "streamId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "iemisGradeCode" TEXT,
    "gradeNumber" INTEGER,
    "evaluationType" "EvaluationType" NOT NULL DEFAULT 'PERCENTAGE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GradeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "academicYearId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "roomNumber" TEXT,
    "capacity" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "classTeacherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffProfile" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "employeeCode" TEXT,
    "iemisTeacherId" TEXT,
    "firstNameEn" TEXT NOT NULL,
    "firstNameNe" TEXT,
    "middleNameEn" TEXT,
    "middleNameNe" TEXT,
    "lastNameEn" TEXT NOT NULL,
    "lastNameNe" TEXT,
    "gender" "Gender",
    "casteEthnicityCode" TEXT,
    "casteEthnicity" TEXT,
    "staffCategory" "StaffCategory",
    "employmentType" "EmploymentType",
    "teachingLicenseNo" TEXT,
    "highestQualification" TEXT,
    "teacherTrainingStatus" "TeacherTrainingStatus",
    "panNumber" TEXT,
    "pfNumber" TEXT,
    "citNumber" TEXT,
    "ssfNumber" TEXT,
    "bankAccountNo" TEXT,
    "maritalStatusForTax" "MaritalStatusForTax",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StaffProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeSubject" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "creditHours" INTEGER,
    "theoryCreditHours" INTEGER,
    "internalCreditHours" INTEGER,
    "theoryFullMarks" DECIMAL(6,2),
    "theoryPassMarks" DECIMAL(6,2),
    "internalFullMarks" DECIMAL(6,2),
    "internalPassMarks" DECIMAL(6,2),
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GradeSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "admissionNo" TEXT NOT NULL,
    "iemisStudentId" VARCHAR(20),
    "nebRegistrationNo" TEXT,
    "symbolNo" TEXT,
    "firstNameEn" TEXT NOT NULL,
    "firstNameNe" TEXT NOT NULL,
    "middleNameEn" TEXT,
    "middleNameNe" TEXT,
    "lastNameEn" TEXT NOT NULL,
    "lastNameNe" TEXT NOT NULL,
    "dobAd" TIMESTAMP(3) NOT NULL,
    "dobBs" VARCHAR(10) NOT NULL,
    "gender" "Gender" NOT NULL,
    "casteEthnicityCode" TEXT NOT NULL,
    "casteEthnicity" TEXT NOT NULL,
    "disabilityType" "DisabilityType" NOT NULL DEFAULT 'NONE',
    "motherTongue" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "birthCertificateNo" TEXT NOT NULL,
    "nationalIdNin" TEXT NOT NULL,
    "hadEcdExperience" BOOLEAN NOT NULL DEFAULT false,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "entityType" "AddressEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "format" "AddressFormat" NOT NULL,
    "provinceCode" TEXT,
    "provinceNe" TEXT,
    "provinceEn" TEXT,
    "districtCode" TEXT,
    "districtNe" TEXT,
    "districtEn" TEXT,
    "municipalityCode" TEXT,
    "municipalityNe" TEXT,
    "municipalityEn" TEXT,
    "ward" INTEGER,
    "toleNe" TEXT,
    "toleEn" TEXT,
    "zoneCode" TEXT,
    "zoneNe" TEXT,
    "zoneEn" TEXT,
    "vdcCode" TEXT,
    "vdcNe" TEXT,
    "vdcEn" TEXT,
    "village" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "occupation" TEXT,
    "citizenshipDetails" JSONB,
    "nationalIdNin" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGuardian" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "relationship" "GuardianRelationship" NOT NULL DEFAULT 'GUARDIAN',
    "otherRelationship" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentGuardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEnrollment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "rollNo" SMALLINT NOT NULL,
    "houseName" TEXT,
    "enrollmentStatus" "EnrollmentStatus" NOT NULL DEFAULT 'NEW_ADMISSION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferCertificate" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "issueDateAd" TIMESTAMP(3) NOT NULL,
    "issueDateBs" VARCHAR(10) NOT NULL,
    "tcNumber" TEXT NOT NULL,
    "destinationIemisCode" TEXT,
    "characterRemark" TEXT NOT NULL,
    "leavingReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TransferCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingScale" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GradingScale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingScaleItem" (
    "id" TEXT NOT NULL,
    "gradingScaleId" TEXT NOT NULL,
    "minPercentage" DECIMAL(5,2) NOT NULL,
    "maxPercentage" DECIMAL(5,2) NOT NULL,
    "letterGrade" TEXT NOT NULL,
    "gradePoint" DECIMAL(3,2) NOT NULL,
    "descriptorEn" TEXT,
    "descriptorNp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingScaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradingScaleId" TEXT,
    "name" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL DEFAULT 'TERMINAL',
    "termWeightage" DECIMAL(5,2),
    "startDateAd" TIMESTAMP(3) NOT NULL,
    "endDateAd" TIMESTAMP(3) NOT NULL,
    "startDateBs" VARCHAR(10) NOT NULL,
    "endDateBs" VARCHAR(10) NOT NULL,
    "resultPublishDateAd" TIMESTAMP(3),
    "resultPublishDateBs" VARCHAR(10),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamSchedule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "gradeSubjectId" TEXT NOT NULL,
    "examDateAd" TIMESTAMP(3) NOT NULL,
    "examDateBs" VARCHAR(10) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "theoryFullMarks" DECIMAL(6,2),
    "theoryPassMarks" DECIMAL(6,2),
    "internalFullMarks" DECIMAL(6,2),
    "internalPassMarks" DECIMAL(6,2),
    "creditHours" INTEGER,
    "theoryCreditHours" INTEGER,
    "internalCreditHours" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExamSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamMark" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examScheduleId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "theoryMarksObtained" DECIMAL(5,2),
    "isTheoryAbsent" BOOLEAN NOT NULL DEFAULT false,
    "internalMarksObtained" DECIMAL(5,2),
    "isInternalAbsent" BOOLEAN NOT NULL DEFAULT false,
    "internalBreakdown" JSONB,
    "theoryGrade" VARCHAR(3),
    "theoryGp" DECIMAL(3,2),
    "internalGrade" VARCHAR(3),
    "internalGp" DECIMAL(3,2),
    "finalSubjectGrade" VARCHAR(3),
    "finalSubjectGp" DECIMAL(3,2),
    "enteredByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamMark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentExamSummary" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "totalMarksObtained" DECIMAL(8,2),
    "percentage" DECIMAL(5,2),
    "gpa" DECIMAL(3,2),
    "finalGrade" TEXT,
    "rankInSection" INTEGER,
    "rankInGrade" INTEGER,
    "totalAttendanceDays" INTEGER,
    "presentDays" INTEGER,
    "classTeacherRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentExamSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalYear" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDateAd" TIMESTAMP(3) NOT NULL,
    "startDateBs" VARCHAR(10) NOT NULL,
    "endDateAd" TIMESTAMP(3) NOT NULL,
    "endDateBs" VARCHAR(10) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FiscalYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeHead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "frequency" "FeeFrequency" NOT NULL,
    "isTaxable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeHead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassFeeStructure" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "gradeLevelId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "applicableBsMonths" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "fiscalYearId" TEXT,

    CONSTRAINT "ClassFeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipScheme" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iemisScholarshipType" "IemisScholarshipType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ScholarshipScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentScholarship" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "scholarshipSchemeId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentScholarship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeInvoice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "issueDateAd" TIMESTAMP(3) NOT NULL,
    "issueDateBs" VARCHAR(10) NOT NULL,
    "dueDateBs" VARCHAR(10) NOT NULL,
    "billedUpToBsMonth" INTEGER,
    "subtotalAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "previousDuesBroughtForward" DECIMAL(12,2) NOT NULL,
    "netPayableAmount" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL,
    "status" "FeeInvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "printCount" INTEGER NOT NULL DEFAULT 0,
    "isSyncedToIrd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeeInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeInvoiceItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "feeHeadId" TEXT NOT NULL,
    "bsMonth" INTEGER,
    "description" TEXT NOT NULL,
    "grossAmount" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL,
    "netAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeePayment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "receiptNumber" TEXT NOT NULL,
    "paymentDateAd" TIMESTAMP(3) NOT NULL,
    "paymentDateBs" VARCHAR(10) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL,
    "paymentMethod" "FeePaymentMethod" NOT NULL,
    "status" "FeePaymentStatus" NOT NULL DEFAULT 'SUCCESS',
    "gatewayTransactionId" TEXT,
    "gatewayResponsePayload" JSONB,
    "collectedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditNote" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "creditNoteNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "approvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherSubjectAllocation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TeacherSubjectAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRun" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "bsYear" SMALLINT NOT NULL,
    "bsMonth" SMALLINT NOT NULL,
    "status" "PayrollRunStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PayrollRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalarySlip" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "payrollRunId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "basicSalary" DECIMAL(12,2) NOT NULL,
    "gradeAllowance" DECIMAL(12,2) NOT NULL,
    "dearnessAllowance" DECIMAL(12,2) NOT NULL,
    "employerPfSsfContribution" DECIMAL(12,2) NOT NULL,
    "employeePfSsfDeduction" DECIMAL(12,2) NOT NULL,
    "citDeduction" DECIMAL(12,2) NOT NULL,
    "salaryAdvanceDeduction" DECIMAL(12,2) NOT NULL,
    "sstTax1Percent" DECIMAL(12,2) NOT NULL,
    "tdsIncomeTax" DECIMAL(12,2) NOT NULL,
    "netPayable" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SalarySlip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicCalendarEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "dateAd" TIMESTAMP(3) NOT NULL,
    "dateBs" VARCHAR(10) NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleNe" TEXT NOT NULL,
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AcademicCalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDailyAttendance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "dateAd" TIMESTAMP(3) NOT NULL,
    "dateBs" VARCHAR(10) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "source" TEXT,
    "markedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentDailyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetableSlot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "dayOfWeek" SMALLINT NOT NULL,
    "periodNo" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TimetableSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportVehicle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "type" "TransportVehicleType" NOT NULL DEFAULT 'BUS',
    "capacity" INTEGER,
    "driverStaffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TransportVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportRoute" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionNe" TEXT,
    "fare" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TransportRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportStop" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "arrivalTime" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TransportStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTransport" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "stopId" TEXT,
    "vehicleId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StudentTransport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryBook" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleNe" TEXT NOT NULL,
    "authorEn" TEXT,
    "authorNe" TEXT,
    "isbn" TEXT,
    "category" TEXT,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "availableCopies" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LibraryBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIssue" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "issueDateAd" TIMESTAMP(3) NOT NULL,
    "issueDateBs" VARCHAR(10),
    "dueDateAd" TIMESTAMP(3) NOT NULL,
    "dueDateBs" VARCHAR(10),
    "returnDateAd" TIMESTAMP(3),
    "returnDateBs" VARCHAR(10),
    "fineAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "BookIssueStatus" NOT NULL DEFAULT 'ISSUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BookIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT NOT NULL,
    "type" "HostelType" NOT NULL DEFAULT 'MIXED',
    "capacity" INTEGER,
    "wardenStaffId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelRoom" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "floor" INTEGER,
    "capacity" INTEGER,
    "roomType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HostelRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelAllocation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "hostelId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "recipientType" "NotificationRecipientType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "principalType" TEXT NOT NULL DEFAULT 'platform',
    "tenantId" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "action" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "statusCode" INTEGER,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentSequence" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fiscalYearId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '',
    "padding" INTEGER NOT NULL DEFAULT 5,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_email_key" ON "PlatformUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_phone_key" ON "PlatformUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_invitationToken_key" ON "PlatformUser"("invitationToken");

-- CreateIndex
CREATE INDEX "PlatformUser_status_idx" ON "PlatformUser"("status");

-- CreateIndex
CREATE INDEX "PlatformUser_deletedAt_idx" ON "PlatformUser"("deletedAt");

-- CreateIndex
CREATE INDEX "PlatformUser_createdAt_idx" ON "PlatformUser"("createdAt");

-- CreateIndex
CREATE INDEX "PlatformRole_deletedAt_idx" ON "PlatformRole"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformPermission_code_key" ON "PlatformPermission"("code");

-- CreateIndex
CREATE INDEX "PlatformRolePermission_permissionId_idx" ON "PlatformRolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "PlatformUserRole_roleId_idx" ON "PlatformUserRole"("roleId");

-- CreateIndex
CREATE INDEX "PlatformUserPermission_permissionId_idx" ON "PlatformUserPermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_code_key" ON "Feature"("code");

-- CreateIndex
CREATE INDEX "Feature_isActive_idx" ON "Feature"("isActive");

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "Feature"("category");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON "SubscriptionPlan"("code");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isActive_idx" ON "SubscriptionPlan"("isActive");

-- CreateIndex
CREATE INDEX "SubscriptionPlan_sortOrder_idx" ON "SubscriptionPlan"("sortOrder");

-- CreateIndex
CREATE INDEX "PlanFeature_featureId_idx" ON "PlanFeature"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_panVatNumber_key" ON "Organization"("panVatNumber");

-- CreateIndex
CREATE INDEX "Organization_createdByPlatformUserId_idx" ON "Organization"("createdByPlatformUserId");

-- CreateIndex
CREATE INDEX "Organization_resellerPartnerId_idx" ON "Organization"("resellerPartnerId");

-- CreateIndex
CREATE INDEX "Organization_status_idx" ON "Organization"("status");

-- CreateIndex
CREATE INDEX "Organization_provinceCode_districtCode_municipalityCode_idx" ON "Organization"("provinceCode", "districtCode", "municipalityCode");

-- CreateIndex
CREATE INDEX "Organization_deletedAt_idx" ON "Organization"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_iemisCode_key" ON "Tenant"("iemisCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_schoolCode_key" ON "Tenant"("schoolCode");

-- CreateIndex
CREATE INDEX "Tenant_organizationId_idx" ON "Tenant"("organizationId");

-- CreateIndex
CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");

-- CreateIndex
CREATE INDEX "Tenant_schoolType_idx" ON "Tenant"("schoolType");

-- CreateIndex
CREATE INDEX "Tenant_provinceCode_districtCode_municipalityCode_idx" ON "Tenant"("provinceCode", "districtCode", "municipalityCode");

-- CreateIndex
CREATE INDEX "Tenant_deletedAt_idx" ON "Tenant"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "Role_tenantId_idx" ON "Role"("tenantId");

-- CreateIndex
CREATE INDEX "Role_deletedAt_idx" ON "Role"("deletedAt");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE INDEX "TenantUser_userId_idx" ON "TenantUser"("userId");

-- CreateIndex
CREATE INDEX "TenantUser_status_idx" ON "TenantUser"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TenantUser_tenantId_userId_key" ON "TenantUser"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "TenantUserRole_roleId_idx" ON "TenantUserRole"("roleId");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "Subscription"("planId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_endDate_idx" ON "Subscription"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- CreateIndex
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");

-- CreateIndex
CREATE INDEX "Invoice_subscriptionId_idx" ON "Invoice"("subscriptionId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "AcademicYear_tenantId_idx" ON "AcademicYear"("tenantId");

-- CreateIndex
CREATE INDEX "AcademicYear_isCurrent_idx" ON "AcademicYear"("isCurrent");

-- CreateIndex
CREATE INDEX "AcademicYear_deletedAt_idx" ON "AcademicYear"("deletedAt");

-- CreateIndex
CREATE INDEX "Stream_tenantId_idx" ON "Stream"("tenantId");

-- CreateIndex
CREATE INDEX "Stream_deletedAt_idx" ON "Stream"("deletedAt");

-- CreateIndex
CREATE INDEX "GradeLevel_tenantId_idx" ON "GradeLevel"("tenantId");

-- CreateIndex
CREATE INDEX "GradeLevel_streamId_idx" ON "GradeLevel"("streamId");

-- CreateIndex
CREATE INDEX "GradeLevel_deletedAt_idx" ON "GradeLevel"("deletedAt");

-- CreateIndex
CREATE INDEX "GradeLevel_tenantId_deletedAt_idx" ON "GradeLevel"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "GradeLevel_tenantId_gradeNumber_idx" ON "GradeLevel"("tenantId", "gradeNumber");

-- CreateIndex
CREATE INDEX "Section_tenantId_idx" ON "Section"("tenantId");

-- CreateIndex
CREATE INDEX "Section_gradeLevelId_idx" ON "Section"("gradeLevelId");

-- CreateIndex
CREATE INDEX "Section_academicYearId_idx" ON "Section"("academicYearId");

-- CreateIndex
CREATE INDEX "Section_classTeacherId_idx" ON "Section"("classTeacherId");

-- CreateIndex
CREATE INDEX "Section_deletedAt_idx" ON "Section"("deletedAt");

-- CreateIndex
CREATE INDEX "Section_tenantId_deletedAt_idx" ON "Section"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Section_tenantId_gradeLevelId_academicYearId_nameEn_idx" ON "Section"("tenantId", "gradeLevelId", "academicYearId", "nameEn");

-- CreateIndex
CREATE INDEX "StaffProfile_tenantId_idx" ON "StaffProfile"("tenantId");

-- CreateIndex
CREATE INDEX "StaffProfile_deletedAt_idx" ON "StaffProfile"("deletedAt");

-- CreateIndex
CREATE INDEX "StaffProfile_tenantId_deletedAt_idx" ON "StaffProfile"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "StaffProfile_tenantId_employeeCode_idx" ON "StaffProfile"("tenantId", "employeeCode");

-- CreateIndex
CREATE INDEX "Subject_tenantId_idx" ON "Subject"("tenantId");

-- CreateIndex
CREATE INDEX "Subject_deletedAt_idx" ON "Subject"("deletedAt");

-- CreateIndex
CREATE INDEX "Subject_tenantId_deletedAt_idx" ON "Subject"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Subject_tenantId_code_idx" ON "Subject"("tenantId", "code");

-- CreateIndex
CREATE INDEX "GradeSubject_tenantId_idx" ON "GradeSubject"("tenantId");

-- CreateIndex
CREATE INDEX "GradeSubject_gradeLevelId_idx" ON "GradeSubject"("gradeLevelId");

-- CreateIndex
CREATE INDEX "GradeSubject_subjectId_idx" ON "GradeSubject"("subjectId");

-- CreateIndex
CREATE INDEX "GradeSubject_deletedAt_idx" ON "GradeSubject"("deletedAt");

-- CreateIndex
CREATE INDEX "GradeSubject_tenantId_deletedAt_idx" ON "GradeSubject"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "GradeSubject_tenantId_gradeLevelId_subjectId_idx" ON "GradeSubject"("tenantId", "gradeLevelId", "subjectId");

-- CreateIndex
CREATE INDEX "Student_tenantId_idx" ON "Student"("tenantId");

-- CreateIndex
CREATE INDEX "Student_userId_idx" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Student_deletedAt_idx" ON "Student"("deletedAt");

-- CreateIndex
CREATE INDEX "Student_tenantId_deletedAt_idx" ON "Student"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Student_tenantId_admissionNo_idx" ON "Student"("tenantId", "admissionNo");

-- CreateIndex
CREATE INDEX "Address_tenantId_idx" ON "Address"("tenantId");

-- CreateIndex
CREATE INDEX "Address_entityType_entityId_idx" ON "Address"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Address_type_idx" ON "Address"("type");

-- CreateIndex
CREATE INDEX "Address_deletedAt_idx" ON "Address"("deletedAt");

-- CreateIndex
CREATE INDEX "Guardian_tenantId_idx" ON "Guardian"("tenantId");

-- CreateIndex
CREATE INDEX "Guardian_userId_idx" ON "Guardian"("userId");

-- CreateIndex
CREATE INDEX "Guardian_deletedAt_idx" ON "Guardian"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentGuardian_guardianId_idx" ON "StudentGuardian"("guardianId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGuardian_studentId_guardianId_key" ON "StudentGuardian"("studentId", "guardianId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_idx" ON "StudentEnrollment"("tenantId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_studentId_idx" ON "StudentEnrollment"("tenantId", "studentId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_academicYearId_idx" ON "StudentEnrollment"("tenantId", "academicYearId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_gradeLevelId_idx" ON "StudentEnrollment"("tenantId", "gradeLevelId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_sectionId_idx" ON "StudentEnrollment"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_deletedAt_idx" ON "StudentEnrollment"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "StudentEnrollment_tenantId_sectionId_rollNo_idx" ON "StudentEnrollment"("tenantId", "sectionId", "rollNo");

-- CreateIndex
CREATE INDEX "TransferCertificate_tenantId_idx" ON "TransferCertificate"("tenantId");

-- CreateIndex
CREATE INDEX "TransferCertificate_studentId_idx" ON "TransferCertificate"("studentId");

-- CreateIndex
CREATE INDEX "TransferCertificate_deletedAt_idx" ON "TransferCertificate"("deletedAt");

-- CreateIndex
CREATE INDEX "TransferCertificate_tenantId_deletedAt_idx" ON "TransferCertificate"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "TransferCertificate_tenantId_tcNumber_idx" ON "TransferCertificate"("tenantId", "tcNumber");

-- CreateIndex
CREATE INDEX "GradingScale_tenantId_idx" ON "GradingScale"("tenantId");

-- CreateIndex
CREATE INDEX "GradingScale_deletedAt_idx" ON "GradingScale"("deletedAt");

-- CreateIndex
CREATE INDEX "GradingScaleItem_gradingScaleId_idx" ON "GradingScaleItem"("gradingScaleId");

-- CreateIndex
CREATE UNIQUE INDEX "GradingScaleItem_gradingScaleId_letterGrade_key" ON "GradingScaleItem"("gradingScaleId", "letterGrade");

-- CreateIndex
CREATE INDEX "Exam_tenantId_idx" ON "Exam"("tenantId");

-- CreateIndex
CREATE INDEX "Exam_academicYearId_idx" ON "Exam"("academicYearId");

-- CreateIndex
CREATE INDEX "Exam_deletedAt_idx" ON "Exam"("deletedAt");

-- CreateIndex
CREATE INDEX "Exam_tenantId_deletedAt_idx" ON "Exam"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamSchedule_tenantId_idx" ON "ExamSchedule"("tenantId");

-- CreateIndex
CREATE INDEX "ExamSchedule_examId_idx" ON "ExamSchedule"("examId");

-- CreateIndex
CREATE INDEX "ExamSchedule_gradeSubjectId_idx" ON "ExamSchedule"("gradeSubjectId");

-- CreateIndex
CREATE INDEX "ExamSchedule_deletedAt_idx" ON "ExamSchedule"("deletedAt");

-- CreateIndex
CREATE INDEX "ExamSchedule_tenantId_deletedAt_idx" ON "ExamSchedule"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ExamSchedule_examId_examDateAd_idx" ON "ExamSchedule"("examId", "examDateAd");

-- CreateIndex
CREATE INDEX "ExamMark_tenantId_idx" ON "ExamMark"("tenantId");

-- CreateIndex
CREATE INDEX "ExamMark_tenantId_enrollmentId_idx" ON "ExamMark"("tenantId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamMark_examScheduleId_enrollmentId_key" ON "ExamMark"("examScheduleId", "enrollmentId");

-- CreateIndex
CREATE INDEX "StudentExamSummary_tenantId_idx" ON "StudentExamSummary"("tenantId");

-- CreateIndex
CREATE INDEX "StudentExamSummary_enrollmentId_idx" ON "StudentExamSummary"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExamSummary_examId_enrollmentId_key" ON "StudentExamSummary"("examId", "enrollmentId");

-- CreateIndex
CREATE INDEX "FiscalYear_tenantId_idx" ON "FiscalYear"("tenantId");

-- CreateIndex
CREATE INDEX "FiscalYear_deletedAt_idx" ON "FiscalYear"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeHead_tenantId_idx" ON "FeeHead"("tenantId");

-- CreateIndex
CREATE INDEX "FeeHead_deletedAt_idx" ON "FeeHead"("deletedAt");

-- CreateIndex
CREATE INDEX "FeeHead_tenantId_deletedAt_idx" ON "FeeHead"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FeeHead_tenantId_nameEn_idx" ON "FeeHead"("tenantId", "nameEn");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_tenantId_idx" ON "ClassFeeStructure"("tenantId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_academicYearId_idx" ON "ClassFeeStructure"("academicYearId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_gradeLevelId_idx" ON "ClassFeeStructure"("gradeLevelId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_feeHeadId_idx" ON "ClassFeeStructure"("feeHeadId");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_deletedAt_idx" ON "ClassFeeStructure"("deletedAt");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_tenantId_deletedAt_idx" ON "ClassFeeStructure"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "ClassFeeStructure_academicYearId_gradeLevelId_feeHeadId_idx" ON "ClassFeeStructure"("academicYearId", "gradeLevelId", "feeHeadId");

-- CreateIndex
CREATE INDEX "ScholarshipScheme_tenantId_idx" ON "ScholarshipScheme"("tenantId");

-- CreateIndex
CREATE INDEX "ScholarshipScheme_deletedAt_idx" ON "ScholarshipScheme"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentScholarship_tenantId_idx" ON "StudentScholarship"("tenantId");

-- CreateIndex
CREATE INDEX "StudentScholarship_enrollmentId_idx" ON "StudentScholarship"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentScholarship_enrollmentId_feeHeadId_key" ON "StudentScholarship"("enrollmentId", "feeHeadId");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_idx" ON "FeeInvoice"("tenantId");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_enrollmentId_idx" ON "FeeInvoice"("tenantId", "enrollmentId");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_deletedAt_idx" ON "FeeInvoice"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_status_idx" ON "FeeInvoice"("tenantId", "status");

-- CreateIndex
CREATE INDEX "FeeInvoice_tenantId_fiscalYearId_enrollmentId_idx" ON "FeeInvoice"("tenantId", "fiscalYearId", "enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FeeInvoice_tenantId_fiscalYearId_invoiceNumber_key" ON "FeeInvoice"("tenantId", "fiscalYearId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "FeeInvoiceItem_tenantId_idx" ON "FeeInvoiceItem"("tenantId");

-- CreateIndex
CREATE INDEX "FeeInvoiceItem_invoiceId_idx" ON "FeeInvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "FeeInvoiceItem_tenantId_invoiceId_idx" ON "FeeInvoiceItem"("tenantId", "invoiceId");

-- CreateIndex
CREATE INDEX "FeePayment_tenantId_idx" ON "FeePayment"("tenantId");

-- CreateIndex
CREATE INDEX "FeePayment_fiscalYearId_idx" ON "FeePayment"("fiscalYearId");

-- CreateIndex
CREATE INDEX "FeePayment_enrollmentId_idx" ON "FeePayment"("enrollmentId");

-- CreateIndex
CREATE INDEX "FeePayment_invoiceId_idx" ON "FeePayment"("invoiceId");

-- CreateIndex
CREATE INDEX "FeePayment_deletedAt_idx" ON "FeePayment"("deletedAt");

-- CreateIndex
CREATE INDEX "FeePayment_tenantId_deletedAt_idx" ON "FeePayment"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "FeePayment_tenantId_status_idx" ON "FeePayment"("tenantId", "status");

-- CreateIndex
CREATE INDEX "CreditNote_tenantId_idx" ON "CreditNote"("tenantId");

-- CreateIndex
CREATE INDEX "CreditNote_invoiceId_idx" ON "CreditNote"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditNote_tenantId_creditNoteNumber_key" ON "CreditNote"("tenantId", "creditNoteNumber");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_tenantId_idx" ON "TeacherSubjectAllocation"("tenantId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_academicYearId_idx" ON "TeacherSubjectAllocation"("academicYearId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_staffId_idx" ON "TeacherSubjectAllocation"("staffId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_sectionId_idx" ON "TeacherSubjectAllocation"("sectionId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_subjectId_idx" ON "TeacherSubjectAllocation"("subjectId");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_deletedAt_idx" ON "TeacherSubjectAllocation"("deletedAt");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_tenantId_deletedAt_idx" ON "TeacherSubjectAllocation"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "TeacherSubjectAllocation_academicYearId_staffId_sectionId_s_idx" ON "TeacherSubjectAllocation"("academicYearId", "staffId", "sectionId", "subjectId");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_idx" ON "PayrollRun"("tenantId");

-- CreateIndex
CREATE INDEX "PayrollRun_fiscalYearId_idx" ON "PayrollRun"("fiscalYearId");

-- CreateIndex
CREATE INDEX "PayrollRun_deletedAt_idx" ON "PayrollRun"("deletedAt");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_deletedAt_idx" ON "PayrollRun"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "PayrollRun_tenantId_fiscalYearId_bsYear_bsMonth_idx" ON "PayrollRun"("tenantId", "fiscalYearId", "bsYear", "bsMonth");

-- CreateIndex
CREATE INDEX "SalarySlip_tenantId_idx" ON "SalarySlip"("tenantId");

-- CreateIndex
CREATE INDEX "SalarySlip_payrollRunId_idx" ON "SalarySlip"("payrollRunId");

-- CreateIndex
CREATE INDEX "SalarySlip_staffId_idx" ON "SalarySlip"("staffId");

-- CreateIndex
CREATE INDEX "SalarySlip_deletedAt_idx" ON "SalarySlip"("deletedAt");

-- CreateIndex
CREATE INDEX "SalarySlip_tenantId_deletedAt_idx" ON "SalarySlip"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "SalarySlip_payrollRunId_staffId_idx" ON "SalarySlip"("payrollRunId", "staffId");

-- CreateIndex
CREATE INDEX "AcademicCalendarEvent_tenantId_idx" ON "AcademicCalendarEvent"("tenantId");

-- CreateIndex
CREATE INDEX "AcademicCalendarEvent_academicYearId_idx" ON "AcademicCalendarEvent"("academicYearId");

-- CreateIndex
CREATE INDEX "AcademicCalendarEvent_deletedAt_idx" ON "AcademicCalendarEvent"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentDailyAttendance_tenantId_idx" ON "StudentDailyAttendance"("tenantId");

-- CreateIndex
CREATE INDEX "StudentDailyAttendance_tenantId_sectionId_idx" ON "StudentDailyAttendance"("tenantId", "sectionId");

-- CreateIndex
CREATE INDEX "StudentDailyAttendance_tenantId_deletedAt_idx" ON "StudentDailyAttendance"("tenantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDailyAttendance_tenantId_enrollmentId_dateAd_key" ON "StudentDailyAttendance"("tenantId", "enrollmentId", "dateAd");

-- CreateIndex
CREATE INDEX "TimetableSlot_tenantId_idx" ON "TimetableSlot"("tenantId");

-- CreateIndex
CREATE INDEX "TimetableSlot_sectionId_idx" ON "TimetableSlot"("sectionId");

-- CreateIndex
CREATE INDEX "TimetableSlot_staffId_idx" ON "TimetableSlot"("staffId");

-- CreateIndex
CREATE INDEX "TimetableSlot_deletedAt_idx" ON "TimetableSlot"("deletedAt");

-- CreateIndex
CREATE INDEX "TimetableSlot_tenantId_deletedAt_idx" ON "TimetableSlot"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "TimetableSlot_tenantId_staffId_dayOfWeek_periodNo_idx" ON "TimetableSlot"("tenantId", "staffId", "dayOfWeek", "periodNo");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableSlot_tenantId_sectionId_dayOfWeek_periodNo_key" ON "TimetableSlot"("tenantId", "sectionId", "dayOfWeek", "periodNo");

-- CreateIndex
CREATE INDEX "TransportVehicle_tenantId_idx" ON "TransportVehicle"("tenantId");

-- CreateIndex
CREATE INDEX "TransportVehicle_deletedAt_idx" ON "TransportVehicle"("deletedAt");

-- CreateIndex
CREATE INDEX "TransportVehicle_tenantId_deletedAt_idx" ON "TransportVehicle"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "TransportVehicle_tenantId_vehicleNumber_idx" ON "TransportVehicle"("tenantId", "vehicleNumber");

-- CreateIndex
CREATE INDEX "TransportRoute_tenantId_idx" ON "TransportRoute"("tenantId");

-- CreateIndex
CREATE INDEX "TransportRoute_deletedAt_idx" ON "TransportRoute"("deletedAt");

-- CreateIndex
CREATE INDEX "TransportStop_tenantId_idx" ON "TransportStop"("tenantId");

-- CreateIndex
CREATE INDEX "TransportStop_routeId_idx" ON "TransportStop"("routeId");

-- CreateIndex
CREATE INDEX "TransportStop_deletedAt_idx" ON "TransportStop"("deletedAt");

-- CreateIndex
CREATE INDEX "TransportStop_tenantId_deletedAt_idx" ON "TransportStop"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "TransportStop_routeId_sequence_idx" ON "TransportStop"("routeId", "sequence");

-- CreateIndex
CREATE INDEX "StudentTransport_tenantId_idx" ON "StudentTransport"("tenantId");

-- CreateIndex
CREATE INDEX "StudentTransport_enrollmentId_idx" ON "StudentTransport"("enrollmentId");

-- CreateIndex
CREATE INDEX "StudentTransport_deletedAt_idx" ON "StudentTransport"("deletedAt");

-- CreateIndex
CREATE INDEX "StudentTransport_tenantId_deletedAt_idx" ON "StudentTransport"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "LibraryBook_tenantId_idx" ON "LibraryBook"("tenantId");

-- CreateIndex
CREATE INDEX "LibraryBook_deletedAt_idx" ON "LibraryBook"("deletedAt");

-- CreateIndex
CREATE INDEX "LibraryBook_tenantId_deletedAt_idx" ON "LibraryBook"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "LibraryBook_tenantId_isbn_idx" ON "LibraryBook"("tenantId", "isbn");

-- CreateIndex
CREATE INDEX "BookIssue_tenantId_idx" ON "BookIssue"("tenantId");

-- CreateIndex
CREATE INDEX "BookIssue_bookId_idx" ON "BookIssue"("bookId");

-- CreateIndex
CREATE INDEX "BookIssue_studentId_idx" ON "BookIssue"("studentId");

-- CreateIndex
CREATE INDEX "BookIssue_deletedAt_idx" ON "BookIssue"("deletedAt");

-- CreateIndex
CREATE INDEX "Hostel_tenantId_idx" ON "Hostel"("tenantId");

-- CreateIndex
CREATE INDEX "Hostel_deletedAt_idx" ON "Hostel"("deletedAt");

-- CreateIndex
CREATE INDEX "HostelRoom_tenantId_idx" ON "HostelRoom"("tenantId");

-- CreateIndex
CREATE INDEX "HostelRoom_hostelId_idx" ON "HostelRoom"("hostelId");

-- CreateIndex
CREATE INDEX "HostelRoom_deletedAt_idx" ON "HostelRoom"("deletedAt");

-- CreateIndex
CREATE INDEX "HostelRoom_tenantId_deletedAt_idx" ON "HostelRoom"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "HostelRoom_tenantId_hostelId_roomNumber_idx" ON "HostelRoom"("tenantId", "hostelId", "roomNumber");

-- CreateIndex
CREATE INDEX "HostelAllocation_tenantId_idx" ON "HostelAllocation"("tenantId");

-- CreateIndex
CREATE INDEX "HostelAllocation_hostelId_idx" ON "HostelAllocation"("hostelId");

-- CreateIndex
CREATE INDEX "HostelAllocation_roomId_idx" ON "HostelAllocation"("roomId");

-- CreateIndex
CREATE INDEX "HostelAllocation_enrollmentId_idx" ON "HostelAllocation"("enrollmentId");

-- CreateIndex
CREATE INDEX "HostelAllocation_deletedAt_idx" ON "HostelAllocation"("deletedAt");

-- CreateIndex
CREATE INDEX "HostelAllocation_tenantId_deletedAt_idx" ON "HostelAllocation"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "Notification_tenantId_idx" ON "Notification"("tenantId");

-- CreateIndex
CREATE INDEX "Notification_recipientType_recipientId_idx" ON "Notification"("recipientType", "recipientId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_deletedAt_idx" ON "Notification"("deletedAt");

-- CreateIndex
CREATE INDEX "Notification_recipientType_recipientId_isRead_idx" ON "Notification"("recipientType", "recipientId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_tenantId_deletedAt_idx" ON "Notification"("tenantId", "deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_method_idx" ON "AuditLog"("method");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "DocumentSequence_tenantId_idx" ON "DocumentSequence"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentSequence_tenantId_fiscalYearId_kind_key" ON "DocumentSequence"("tenantId", "fiscalYearId", "kind");

-- AddForeignKey
ALTER TABLE "PlatformUser" ADD CONSTRAINT "PlatformUser_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformRolePermission" ADD CONSTRAINT "PlatformRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "PlatformRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformRolePermission" ADD CONSTRAINT "PlatformRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "PlatformPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserRole" ADD CONSTRAINT "PlatformUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserRole" ADD CONSTRAINT "PlatformUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "PlatformRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserRole" ADD CONSTRAINT "PlatformUserRole_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserPermission" ADD CONSTRAINT "PlatformUserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "PlatformUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserPermission" ADD CONSTRAINT "PlatformUserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "PlatformPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformUserPermission" ADD CONSTRAINT "PlatformUserPermission_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdByPlatformUserId_fkey" FOREIGN KEY ("createdByPlatformUserId") REFERENCES "PlatformUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_resellerPartnerId_fkey" FOREIGN KEY ("resellerPartnerId") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUser" ADD CONSTRAINT "TenantUser_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUser" ADD CONSTRAINT "TenantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUserRole" ADD CONSTRAINT "TenantUserRole_tenantUserId_fkey" FOREIGN KEY ("tenantUserId") REFERENCES "TenantUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUserRole" ADD CONSTRAINT "TenantUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_assignedByPlatformUserId_fkey" FOREIGN KEY ("assignedByPlatformUserId") REFERENCES "PlatformUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeLevel" ADD CONSTRAINT "GradeLevel_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES "StaffProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffProfile" ADD CONSTRAINT "StaffProfile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSubject" ADD CONSTRAINT "GradeSubject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSubject" ADD CONSTRAINT "GradeSubject_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSubject" ADD CONSTRAINT "GradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGuardian" ADD CONSTRAINT "StudentGuardian_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEnrollment" ADD CONSTRAINT "StudentEnrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferCertificate" ADD CONSTRAINT "TransferCertificate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferCertificate" ADD CONSTRAINT "TransferCertificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingScale" ADD CONSTRAINT "GradingScale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingScaleItem" ADD CONSTRAINT "GradingScaleItem_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES "GradingScale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES "GradingScale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSchedule" ADD CONSTRAINT "ExamSchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSchedule" ADD CONSTRAINT "ExamSchedule_gradeSubjectId_fkey" FOREIGN KEY ("gradeSubjectId") REFERENCES "GradeSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES "ExamSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamMark" ADD CONSTRAINT "ExamMark_enteredByUserId_fkey" FOREIGN KEY ("enteredByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExamSummary" ADD CONSTRAINT "StudentExamSummary_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExamSummary" ADD CONSTRAINT "StudentExamSummary_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalYear" ADD CONSTRAINT "FiscalYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeHead" ADD CONSTRAINT "FeeHead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES "GradeLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassFeeStructure" ADD CONSTRAINT "ClassFeeStructure_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipScheme" ADD CONSTRAINT "ScholarshipScheme_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_scholarshipSchemeId_fkey" FOREIGN KEY ("scholarshipSchemeId") REFERENCES "ScholarshipScheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScholarship" ADD CONSTRAINT "StudentScholarship_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeInvoiceItem" ADD CONSTRAINT "FeeInvoiceItem_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES "FeeHead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_collectedByUserId_fkey" FOREIGN KEY ("collectedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "FeeInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditNote" ADD CONSTRAINT "CreditNote_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherSubjectAllocation" ADD CONSTRAINT "TeacherSubjectAllocation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRun" ADD CONSTRAINT "PayrollRun_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES "FiscalYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES "PayrollRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicCalendarEvent" ADD CONSTRAINT "AcademicCalendarEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicCalendarEvent" ADD CONSTRAINT "AcademicCalendarEvent_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDailyAttendance" ADD CONSTRAINT "StudentDailyAttendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDailyAttendance" ADD CONSTRAINT "StudentDailyAttendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDailyAttendance" ADD CONSTRAINT "StudentDailyAttendance_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDailyAttendance" ADD CONSTRAINT "StudentDailyAttendance_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "StaffProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportVehicle" ADD CONSTRAINT "TransportVehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportVehicle" ADD CONSTRAINT "TransportVehicle_driverStaffId_fkey" FOREIGN KEY ("driverStaffId") REFERENCES "StaffProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRoute" ADD CONSTRAINT "TransportRoute_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRoute" ADD CONSTRAINT "TransportRoute_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "TransportVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportStop" ADD CONSTRAINT "TransportStop_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportStop" ADD CONSTRAINT "TransportStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "TransportRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "TransportRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "TransportStop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTransport" ADD CONSTRAINT "StudentTransport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "TransportVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryBook" ADD CONSTRAINT "LibraryBook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "LibraryBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIssue" ADD CONSTRAINT "BookIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_wardenStaffId_fkey" FOREIGN KEY ("wardenStaffId") REFERENCES "StaffProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelRoom" ADD CONSTRAINT "HostelRoom_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelRoom" ADD CONSTRAINT "HostelRoom_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "Hostel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HostelRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "StudentEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Soft-delete aware unique constraints and business-rule checks (see prisma/sql/partial-unique-indexes.sql)
-- Soft-delete aware unique constraints.
--
-- Prisma's schema language cannot express partial (WHERE) unique indexes, so
-- they live here as raw SQL. This is the established convention for this
-- project: a record that has been soft-deleted must not block a new record
-- with the same natural key from being created.
--
-- Every index below has a matching non-unique index in schema.prisma so that
-- Prisma still knows how to query the column.

CREATE UNIQUE INDEX "Organization_panVatNumber_active_key" ON "Organization"("panVatNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "AcademicYear_tenantId_name_active_key" ON "AcademicYear"("tenantId", "name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Stream_tenantId_code_active_key" ON "Stream"("tenantId", "code") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Role_tenantId_name_active_key" ON "Role"("tenantId", "name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "PlatformRole_name_active_key" ON "PlatformRole"("name") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Student_tenantId_admissionNo_active_key" ON "Student"("tenantId", "admissionNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "StudentEnrollment_tenantId_studentId_academicYearId_active_key" ON "StudentEnrollment"("tenantId", "studentId", "academicYearId") WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX "Subject_tenantId_code_active_key" ON "Subject"("tenantId", "code") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "GradeSubject_tenantId_gradeLevelId_subjectId_active_key" ON "GradeSubject"("tenantId", "gradeLevelId", "subjectId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "Section_tenantId_gradeLevelId_academicYearId_nameEn_active_key" ON "Section"("tenantId", "gradeLevelId", "academicYearId", "nameEn") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "StudentEnrollment_tenantId_sectionId_rollNo_active_key" ON "StudentEnrollment"("tenantId", "sectionId", "rollNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TransferCertificate_tenantId_tcNumber_active_key" ON "TransferCertificate"("tenantId", "tcNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeeHead_tenantId_nameEn_active_key" ON "FeeHead"("tenantId", "nameEn") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "ClassFeeStructure_academicYearId_gradeLevelId_feeHeadId_active_key" ON "ClassFeeStructure"("academicYearId", "gradeLevelId", "feeHeadId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeePayment_tenantId_receiptNumber_active_key" ON "FeePayment"("tenantId", "receiptNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FeePayment_tenantId_gatewayTransactionId_active_key" ON "FeePayment"("tenantId", "gatewayTransactionId") WHERE "deletedAt" IS NULL AND "gatewayTransactionId" IS NOT NULL;
CREATE UNIQUE INDEX "PayrollRun_tenantId_fiscalYearId_bsYear_bsMonth_active_key" ON "PayrollRun"("tenantId", "fiscalYearId", "bsYear", "bsMonth") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "SalarySlip_payrollRunId_staffId_active_key" ON "SalarySlip"("payrollRunId", "staffId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TeacherSubjectAllocation_academicYearId_staffId_sectionId_subjectId_active_key" ON "TeacherSubjectAllocation"("academicYearId", "staffId", "sectionId", "subjectId") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TimetableSlot_tenantId_staffId_dayOfWeek_periodNo_active_key" ON "TimetableSlot"("tenantId", "staffId", "dayOfWeek", "periodNo") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "TransportVehicle_tenantId_vehicleNumber_active_key" ON "TransportVehicle"("tenantId", "vehicleNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "HostelRoom_tenantId_hostelId_roomNumber_active_key" ON "HostelRoom"("tenantId", "hostelId", "roomNumber") WHERE "deletedAt" IS NULL;
CREATE UNIQUE INDEX "LibraryBook_tenantId_isbn_active_key" ON "LibraryBook"("tenantId", "isbn") WHERE "deletedAt" IS NULL AND "isbn" IS NOT NULL;
CREATE UNIQUE INDEX "HostelAllocation_tenantId_enrollmentId_active_key" ON "HostelAllocation"("tenantId", "enrollmentId") WHERE "deletedAt" IS NULL AND "status" = 'ACTIVE';
CREATE UNIQUE INDEX "StudentTransport_tenantId_enrollmentId_active_key" ON "StudentTransport"("tenantId", "enrollmentId") WHERE "deletedAt" IS NULL AND "status" = 'ACTIVE';

-- A tenant may only have one "current" academic year and one "active"
-- fiscal year. Prisma cannot express these as partial unique indexes either.
CREATE UNIQUE INDEX "AcademicYear_tenantId_isCurrent_active_key" ON "AcademicYear"("tenantId") WHERE "isCurrent" = true AND "deletedAt" IS NULL;
CREATE UNIQUE INDEX "FiscalYear_tenantId_isActive_active_key" ON "FiscalYear"("tenantId") WHERE "isActive" = true AND "deletedAt" IS NULL;

-- Business-rule guards that Prisma cannot express.
-- A grade band must not have min > max.
ALTER TABLE "GradingScaleItem"
  ADD CONSTRAINT "GradingScaleItem_min_max_check" CHECK ("minPercentage" <= "maxPercentage");
-- A student may not be enrolled in the same section twice with the same roll number.
ALTER TABLE "StudentEnrollment"
  ADD CONSTRAINT "StudentEnrollment_rollNo_check" CHECK ("rollNo" > 0);
-- Fee amounts may never be negative.
ALTER TABLE "FeeInvoiceItem"
  ADD CONSTRAINT "FeeInvoiceItem_amounts_check" CHECK ("grossAmount" >= 0 AND "discountAmount" >= 0 AND "netAmount" >= 0);
ALTER TABLE "FeePayment"
  ADD CONSTRAINT "FeePayment_amountPaid_check" CHECK ("amountPaid" >= 0);
-- Marks may never be negative.
ALTER TABLE "ExamMark"
  ADD CONSTRAINT "ExamMark_marks_check" CHECK (
    ("theoryMarksObtained" IS NULL OR "theoryMarksObtained" >= 0)
    AND ("internalMarksObtained" IS NULL OR "internalMarksObtained" >= 0)
  );
-- Book copies cannot exceed the total.
ALTER TABLE "LibraryBook"
  ADD CONSTRAINT "LibraryBook_copies_check" CHECK ("totalCopies" >= 0 AND "availableCopies" >= 0 AND "availableCopies" <= "totalCopies");
