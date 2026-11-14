--
-- PostgreSQL database dump
--

\restrict AgqcEXdiSZVxGLglvQYIeyFJZsNRqKCbiqoaxYTA9BFcJ83qy353cOhaOHfzrKK

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AddressEntityType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."AddressEntityType" AS ENUM (
    'STUDENT',
    'STAFF',
    'GUARDIAN',
    'USER',
    'TENANT',
    'ORGANIZATION',
    'PLATFORM_USER'
);


ALTER TYPE public."AddressEntityType" OWNER TO johndoe;

--
-- Name: AddressFormat; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."AddressFormat" AS ENUM (
    'PROVINCIAL',
    'ZONAL'
);


ALTER TYPE public."AddressFormat" OWNER TO johndoe;

--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."AddressType" AS ENUM (
    'PERMANENT',
    'TEMPORARY'
);


ALTER TYPE public."AddressType" OWNER TO johndoe;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'ON_LEAVE'
);


ALTER TYPE public."AttendanceStatus" OWNER TO johndoe;

--
-- Name: BillingCycle; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."BillingCycle" AS ENUM (
    'MONTHLY',
    'YEARLY',
    'ONE_TIME'
);


ALTER TYPE public."BillingCycle" OWNER TO johndoe;

--
-- Name: BookIssueStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."BookIssueStatus" AS ENUM (
    'ISSUED',
    'RETURNED',
    'OVERDUE',
    'LOST'
);


ALTER TYPE public."BookIssueStatus" OWNER TO johndoe;

--
-- Name: DisabilityType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."DisabilityType" AS ENUM (
    'NONE',
    'PHYSICAL',
    'MENTAL',
    'DEAF',
    'BLIND',
    'LOW_VISION',
    'DEAF_BLIND',
    'SPEECH',
    'INTELLECTUAL',
    'AUTISM',
    'MULTIPLE'
);


ALTER TYPE public."DisabilityType" OWNER TO johndoe;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FLAT_AMOUNT'
);


ALTER TYPE public."DiscountType" OWNER TO johndoe;

--
-- Name: EmploymentType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."EmploymentType" AS ENUM (
    'GOVT_PERMANENT',
    'GOVT_TEMPORARY',
    'RAHAT_GRANT',
    'LOCAL_LEVEL_GRANT',
    'PRIVATE_SOURCE',
    'ECD_FACILITATOR'
);


ALTER TYPE public."EmploymentType" OWNER TO johndoe;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'NEW_ADMISSION',
    'PROMOTED',
    'REPEATED',
    'TRANSFERRED_IN',
    'TRANSFERRED_OUT',
    'DROPOUT',
    'GRADUATED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO johndoe;

--
-- Name: EvaluationType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."EvaluationType" AS ENUM (
    'PERCENTAGE',
    'GPA',
    'LETTER',
    'CGPA'
);


ALTER TYPE public."EvaluationType" OWNER TO johndoe;

--
-- Name: ExamStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."ExamStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'LOCKED'
);


ALTER TYPE public."ExamStatus" OWNER TO johndoe;

--
-- Name: FeeFrequency; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."FeeFrequency" AS ENUM (
    'MONTHLY_BS',
    'ONE_TIME',
    'TERM_WISE',
    'ANNUAL',
    'AD_HOC'
);


ALTER TYPE public."FeeFrequency" OWNER TO johndoe;

--
-- Name: FeeInvoiceStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."FeeInvoiceStatus" AS ENUM (
    'UNPAID',
    'PARTIALLY_PAID',
    'PAID',
    'VOIDED_BY_CREDIT_NOTE'
);


ALTER TYPE public."FeeInvoiceStatus" OWNER TO johndoe;

--
-- Name: FeePaymentMethod; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."FeePaymentMethod" AS ENUM (
    'CASH',
    'ESEWA',
    'KHALTI',
    'FONEPAY_QR',
    'CONNECT_IPS',
    'BANK_VOUCHER',
    'CHEQUE'
);


ALTER TYPE public."FeePaymentMethod" OWNER TO johndoe;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO johndoe;

--
-- Name: GuardianRelationship; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."GuardianRelationship" AS ENUM (
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'OTHER',
    'GRANDFATHER',
    'GRANDMOTHER'
);


ALTER TYPE public."GuardianRelationship" OWNER TO johndoe;

--
-- Name: HostelType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."HostelType" AS ENUM (
    'BOYS',
    'GIRLS',
    'MIXED'
);


ALTER TYPE public."HostelType" OWNER TO johndoe;

--
-- Name: IemisScholarshipType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."IemisScholarshipType" AS ENUM (
    'DALIT',
    'JANAJATI',
    'MARTYR_CHILD',
    'CONFLICT_VICTIM',
    'POOR_TALENTED',
    'DISABILITY',
    'MUNICIPAL_QUOTA',
    'SCHOOL_INTERNAL'
);


ALTER TYPE public."IemisScholarshipType" OWNER TO johndoe;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'ISSUED',
    'PAID',
    'OVERDUE',
    'VOID',
    'REFUNDED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO johndoe;

--
-- Name: MaritalStatusForTax; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."MaritalStatusForTax" AS ENUM (
    'SINGLE',
    'MARRIED'
);


ALTER TYPE public."MaritalStatusForTax" OWNER TO johndoe;

--
-- Name: NotificationRecipientType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."NotificationRecipientType" AS ENUM (
    'USER',
    'PLATFORM_USER'
);


ALTER TYPE public."NotificationRecipientType" OWNER TO johndoe;

--
-- Name: OrganizationStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."OrganizationStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."OrganizationStatus" OWNER TO johndoe;

--
-- Name: OrganizationType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."OrganizationType" AS ENUM (
    'TRUST',
    'FOUNDATION',
    'COMPANY',
    'NGO',
    'GOVERNMENT',
    'COOPERATIVE',
    'SCHOOL_GROUP',
    'OTHER'
);


ALTER TYPE public."OrganizationType" OWNER TO johndoe;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'BANK_TRANSFER',
    'ESEWA',
    'KHALTI',
    'CARD',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO johndoe;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO johndoe;

--
-- Name: PayrollRunStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."PayrollRunStatus" AS ENUM (
    'DRAFT',
    'APPROVED',
    'DISBURSED'
);


ALTER TYPE public."PayrollRunStatus" OWNER TO johndoe;

--
-- Name: PlatformUserStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."PlatformUserStatus" AS ENUM (
    'INVITED',
    'ACTIVE',
    'SUSPENDED',
    'DEACTIVATED'
);


ALTER TYPE public."PlatformUserStatus" OWNER TO johndoe;

--
-- Name: SchoolType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."SchoolType" AS ENUM (
    'COMMUNITY',
    'INSTITUTIONAL_PRIVATE',
    'GUTHI',
    'COOPERATIVE',
    'RELIGIOUS'
);


ALTER TYPE public."SchoolType" OWNER TO johndoe;

--
-- Name: StaffCategory; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."StaffCategory" AS ENUM (
    'TEACHING',
    'NON_TEACHING_ADMIN',
    'SUPPORT_DRIVER_HELPER'
);


ALTER TYPE public."StaffCategory" OWNER TO johndoe;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'TRIAL',
    'ACTIVE',
    'PAST_DUE',
    'CANCELLED',
    'EXPIRED',
    'SUSPENDED'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO johndoe;

--
-- Name: TeacherTrainingStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."TeacherTrainingStatus" AS ENUM (
    'TPD_COMPLETED',
    'PARTIAL',
    'UNTRAINED'
);


ALTER TYPE public."TeacherTrainingStatus" OWNER TO johndoe;

--
-- Name: TenantStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."TenantStatus" AS ENUM (
    'ONBOARDING',
    'ACTIVE',
    'SUSPENDED',
    'INACTIVE'
);


ALTER TYPE public."TenantStatus" OWNER TO johndoe;

--
-- Name: TransportVehicleType; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."TransportVehicleType" AS ENUM (
    'BUS',
    'MICROBUS',
    'VAN',
    'OTHER'
);


ALTER TYPE public."TransportVehicleType" OWNER TO johndoe;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: johndoe
--

CREATE TYPE public."UserStatus" AS ENUM (
    'PENDING_VERIFICATION',
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public."UserStatus" OWNER TO johndoe;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AcademicCalendarEvent; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."AcademicCalendarEvent" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "dateAd" timestamp(3) without time zone NOT NULL,
    "dateBs" character varying(10) NOT NULL,
    "isHoliday" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "titleEn" text NOT NULL,
    "titleNe" text NOT NULL
);


ALTER TABLE public."AcademicCalendarEvent" OWNER TO johndoe;

--
-- Name: AcademicYear; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."AcademicYear" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "bsYear" smallint NOT NULL,
    "startDateAd" timestamp(3) without time zone NOT NULL,
    "endDateAd" timestamp(3) without time zone NOT NULL,
    "startDateBs" character varying(10) NOT NULL,
    "endDateBs" character varying(10) NOT NULL,
    "isCurrent" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."AcademicYear" OWNER TO johndoe;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    type public."AddressType" NOT NULL,
    format public."AddressFormat" NOT NULL,
    "provinceCode" text,
    "provinceNe" text,
    "provinceEn" text,
    "districtCode" text,
    "districtNe" text,
    "districtEn" text,
    "municipalityCode" text,
    "municipalityNe" text,
    "municipalityEn" text,
    ward integer,
    "toleNe" text,
    "toleEn" text,
    "zoneCode" text,
    "zoneNe" text,
    "zoneEn" text,
    "vdcCode" text,
    "vdcNe" text,
    "vdcEn" text,
    village text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "entityId" text NOT NULL,
    "entityType" public."AddressEntityType" NOT NULL,
    latitude double precision,
    longitude double precision
);


ALTER TABLE public."Address" OWNER TO johndoe;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    method text NOT NULL,
    path text NOT NULL,
    action text,
    resource text,
    "resourceId" text,
    "statusCode" integer,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO johndoe;

--
-- Name: BookIssue; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."BookIssue" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "bookId" text NOT NULL,
    "studentId" text NOT NULL,
    "issueDateAd" timestamp(3) without time zone NOT NULL,
    "issueDateBs" character varying(10),
    "dueDateAd" timestamp(3) without time zone NOT NULL,
    "dueDateBs" character varying(10),
    "returnDateAd" timestamp(3) without time zone,
    "returnDateBs" character varying(10),
    "fineAmount" numeric(10,2) DEFAULT 0 NOT NULL,
    status public."BookIssueStatus" DEFAULT 'ISSUED'::public."BookIssueStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."BookIssue" OWNER TO johndoe;

--
-- Name: ClassFeeStructure; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."ClassFeeStructure" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "gradeLevelId" text NOT NULL,
    "feeHeadId" text NOT NULL,
    amount numeric(10,2) NOT NULL,
    "applicableBsMonths" integer[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "fiscalYearId" text
);


ALTER TABLE public."ClassFeeStructure" OWNER TO johndoe;

--
-- Name: CreditNote; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."CreditNote" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "invoiceId" text NOT NULL,
    "creditNoteNumber" text NOT NULL,
    reason text NOT NULL,
    amount numeric(12,2) NOT NULL,
    "approvedByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CreditNote" OWNER TO johndoe;

--
-- Name: Exam; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Exam" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "gradingScaleId" text,
    name text NOT NULL,
    "termWeightage" numeric(5,2),
    "startDateAd" timestamp(3) without time zone NOT NULL,
    "endDateAd" timestamp(3) without time zone NOT NULL,
    "startDateBs" character varying(10) NOT NULL,
    "endDateBs" character varying(10) NOT NULL,
    "resultPublishDateAd" timestamp(3) without time zone,
    "resultPublishDateBs" character varying(10),
    "isPublished" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Exam" OWNER TO johndoe;

--
-- Name: ExamMark; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."ExamMark" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examScheduleId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "theoryMarksObtained" numeric(5,2),
    "isTheoryAbsent" boolean DEFAULT false NOT NULL,
    "internalMarksObtained" numeric(5,2),
    "isInternalAbsent" boolean DEFAULT false NOT NULL,
    "internalBreakdown" jsonb,
    "theoryGrade" character varying(3),
    "theoryGp" numeric(3,2),
    "internalGrade" character varying(3),
    "internalGp" numeric(3,2),
    "finalSubjectGrade" character varying(3),
    "finalSubjectGp" numeric(3,2),
    "enteredByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamMark" OWNER TO johndoe;

--
-- Name: ExamSchedule; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."ExamSchedule" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "gradeSubjectId" text NOT NULL,
    "examDateAd" timestamp(3) without time zone NOT NULL,
    "examDateBs" character varying(10) NOT NULL,
    "startTime" text,
    "endTime" text,
    "theoryFullMarks" numeric(6,2),
    "theoryPassMarks" numeric(6,2),
    "internalFullMarks" numeric(6,2),
    "internalPassMarks" numeric(6,2),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "creditHours" integer,
    "internalCreditHours" integer,
    "theoryCreditHours" integer
);


ALTER TABLE public."ExamSchedule" OWNER TO johndoe;

--
-- Name: Feature; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Feature" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Feature" OWNER TO johndoe;

--
-- Name: FeeHead; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."FeeHead" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    frequency public."FeeFrequency" NOT NULL,
    "isTaxable" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."FeeHead" OWNER TO johndoe;

--
-- Name: FeeInvoice; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."FeeInvoice" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "fiscalYearId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "issueDateAd" timestamp(3) without time zone NOT NULL,
    "issueDateBs" character varying(10) NOT NULL,
    "dueDateBs" character varying(10) NOT NULL,
    "billedUpToBsMonth" integer,
    "subtotalAmount" numeric(12,2) NOT NULL,
    "discountAmount" numeric(12,2) NOT NULL,
    "previousDuesBroughtForward" numeric(12,2) NOT NULL,
    "netPayableAmount" numeric(12,2) NOT NULL,
    "paidAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "balanceDue" numeric(12,2) NOT NULL,
    status public."FeeInvoiceStatus" DEFAULT 'UNPAID'::public."FeeInvoiceStatus" NOT NULL,
    "printCount" integer DEFAULT 0 NOT NULL,
    "isSyncedToIrd" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."FeeInvoice" OWNER TO johndoe;

--
-- Name: FeeInvoiceItem; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."FeeInvoiceItem" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "invoiceId" text NOT NULL,
    "feeHeadId" text NOT NULL,
    "bsMonth" integer,
    description text NOT NULL,
    "grossAmount" numeric(12,2) NOT NULL,
    "discountAmount" numeric(12,2) NOT NULL,
    "netAmount" numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FeeInvoiceItem" OWNER TO johndoe;

--
-- Name: FeePayment; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."FeePayment" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "fiscalYearId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "invoiceId" text,
    "receiptNumber" text NOT NULL,
    "paymentDateAd" timestamp(3) without time zone NOT NULL,
    "paymentDateBs" character varying(10) NOT NULL,
    "amountPaid" numeric(10,2) NOT NULL,
    "paymentMethod" public."FeePaymentMethod" NOT NULL,
    "gatewayTransactionId" text,
    "gatewayResponsePayload" jsonb,
    "collectedByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."FeePayment" OWNER TO johndoe;

--
-- Name: FiscalYear; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."FiscalYear" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "startDateAd" timestamp(3) without time zone NOT NULL,
    "startDateBs" character varying(10) NOT NULL,
    "endDateAd" timestamp(3) without time zone NOT NULL,
    "endDateBs" character varying(10) NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."FiscalYear" OWNER TO johndoe;

--
-- Name: GradeLevel; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."GradeLevel" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "streamId" text,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    "iemisGradeCode" text,
    "evaluationType" public."EvaluationType" DEFAULT 'PERCENTAGE'::public."EvaluationType" NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."GradeLevel" OWNER TO johndoe;

--
-- Name: GradeSubject; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."GradeSubject" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "gradeLevelId" text NOT NULL,
    "subjectId" text NOT NULL,
    "isOptional" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "creditHours" integer,
    "internalCreditHours" integer,
    "internalFullMarks" numeric(6,2),
    "internalPassMarks" numeric(6,2),
    "theoryCreditHours" integer,
    "theoryFullMarks" numeric(6,2),
    "theoryPassMarks" numeric(6,2)
);


ALTER TABLE public."GradeSubject" OWNER TO johndoe;

--
-- Name: GradingScale; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."GradingScale" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."GradingScale" OWNER TO johndoe;

--
-- Name: GradingScaleItem; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."GradingScaleItem" (
    id text NOT NULL,
    "gradingScaleId" text NOT NULL,
    "minPercentage" numeric(5,2) NOT NULL,
    "maxPercentage" numeric(5,2) NOT NULL,
    "letterGrade" text NOT NULL,
    "gradePoint" numeric(3,2) NOT NULL,
    "descriptorEn" text,
    "descriptorNp" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GradingScaleItem" OWNER TO johndoe;

--
-- Name: Guardian; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Guardian" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "nameEn" text NOT NULL,
    "nameNe" text,
    phone text,
    email text,
    occupation text,
    "nationalIdNin" text,
    "photoUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "citizenshipDetails" jsonb
);


ALTER TABLE public."Guardian" OWNER TO johndoe;

--
-- Name: Hostel; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Hostel" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    type public."HostelType" DEFAULT 'MIXED'::public."HostelType" NOT NULL,
    capacity integer,
    "wardenStaffId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Hostel" OWNER TO johndoe;

--
-- Name: HostelAllocation; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."HostelAllocation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "hostelId" text NOT NULL,
    "roomId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."HostelAllocation" OWNER TO johndoe;

--
-- Name: HostelRoom; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."HostelRoom" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "hostelId" text NOT NULL,
    "roomNumber" text NOT NULL,
    floor integer,
    capacity integer,
    "roomType" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."HostelRoom" OWNER TO johndoe;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "subscriptionId" text,
    number text NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text DEFAULT 'NPR'::text NOT NULL,
    status public."InvoiceStatus" DEFAULT 'ISSUED'::public."InvoiceStatus" NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "paidAt" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO johndoe;

--
-- Name: LibraryBook; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."LibraryBook" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    isbn text,
    category text,
    "totalCopies" integer DEFAULT 1 NOT NULL,
    "availableCopies" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "authorEn" text,
    "authorNe" text,
    "titleEn" text NOT NULL,
    "titleNe" text NOT NULL
);


ALTER TABLE public."LibraryBook" OWNER TO johndoe;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "tenantId" text,
    "recipientType" public."NotificationRecipientType" NOT NULL,
    "recipientId" text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Notification" OWNER TO johndoe;

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Organization" (
    id text NOT NULL,
    "panVatNumber" text,
    "createdByPlatformUserId" text NOT NULL,
    "resellerPartnerId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "contactPersonEmail" text,
    "contactPersonName" text NOT NULL,
    "contactPersonPhone" text NOT NULL,
    email text NOT NULL,
    "fiscalYearStartMonth" integer DEFAULT 7 NOT NULL,
    "isTaxExempt" boolean DEFAULT false NOT NULL,
    "logoUrl" text,
    "nameEn" text NOT NULL,
    notes text,
    "organizationType" public."OrganizationType" DEFAULT 'OTHER'::public."OrganizationType" NOT NULL,
    phone text NOT NULL,
    "registrationNumber" text,
    "shortName" text,
    status public."OrganizationStatus" DEFAULT 'ACTIVE'::public."OrganizationStatus" NOT NULL,
    timezone text DEFAULT 'Asia/Kathmandu'::text NOT NULL,
    "wardNumber" integer NOT NULL,
    website text,
    "establishedDateAd" timestamp(3) without time zone,
    "establishedDateBs" character varying(10),
    "nameNe" text NOT NULL,
    "addressEn" text,
    "addressNe" text,
    "districtCode" text NOT NULL,
    "districtEn" text,
    "districtNe" text NOT NULL,
    "municipalityCode" text NOT NULL,
    "municipalityEn" text,
    "municipalityNe" text NOT NULL,
    "provinceCode" text NOT NULL,
    "provinceEn" text,
    "provinceNe" text NOT NULL,
    "toleEn" text,
    "toleNe" text
);


ALTER TABLE public."Organization" OWNER TO johndoe;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    amount numeric(12,2) NOT NULL,
    currency text DEFAULT 'NPR'::text NOT NULL,
    method public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "transactionRef" text,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO johndoe;

--
-- Name: PayrollRun; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PayrollRun" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "fiscalYearId" text NOT NULL,
    "bsYear" smallint NOT NULL,
    "bsMonth" smallint NOT NULL,
    status public."PayrollRunStatus" DEFAULT 'DRAFT'::public."PayrollRunStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."PayrollRun" OWNER TO johndoe;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO johndoe;

--
-- Name: PlanFeature; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlanFeature" (
    "planId" text NOT NULL,
    "featureId" text NOT NULL,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "limit" integer,
    config jsonb
);


ALTER TABLE public."PlanFeature" OWNER TO johndoe;

--
-- Name: PlatformPermission; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformPermission" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    category text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PlatformPermission" OWNER TO johndoe;

--
-- Name: PlatformRole; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformRole" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."PlatformRole" OWNER TO johndoe;

--
-- Name: PlatformRolePermission; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformRolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PlatformRolePermission" OWNER TO johndoe;

--
-- Name: PlatformUser; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformUser" (
    id text NOT NULL,
    email text NOT NULL,
    phone text,
    "passwordHash" text,
    status public."PlatformUserStatus" DEFAULT 'INVITED'::public."PlatformUserStatus" NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone,
    "phoneVerifiedAt" timestamp(3) without time zone,
    "twoFactorEnabled" boolean DEFAULT false NOT NULL,
    "twoFactorSecret" text,
    "lastLoginAt" timestamp(3) without time zone,
    "lastLoginIp" text,
    "failedLoginAttempts" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "passwordChangedAt" timestamp(3) without time zone,
    "mustChangePassword" boolean DEFAULT false NOT NULL,
    "invitedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "invitationAcceptedAt" timestamp(3) without time zone,
    "invitationExpiresAt" timestamp(3) without time zone,
    "invitationToken" text,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenHash" text,
    address text,
    "firstNameEn" text NOT NULL,
    "firstNameNe" text NOT NULL,
    "lastNameEn" text NOT NULL,
    "lastNameNe" text NOT NULL,
    "middleNameEn" text,
    "middleNameNe" text
);


ALTER TABLE public."PlatformUser" OWNER TO johndoe;

--
-- Name: PlatformUserPermission; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformUserPermission" (
    "userId" text NOT NULL,
    "permissionId" text NOT NULL,
    granted boolean DEFAULT true NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "grantedById" text
);


ALTER TABLE public."PlatformUserPermission" OWNER TO johndoe;

--
-- Name: PlatformUserRole; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."PlatformUserRole" (
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "assignedById" text
);


ALTER TABLE public."PlatformUserRole" OWNER TO johndoe;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Role" OWNER TO johndoe;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO johndoe;

--
-- Name: SalarySlip; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."SalarySlip" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "payrollRunId" text NOT NULL,
    "staffId" text NOT NULL,
    "basicSalary" numeric(12,2) NOT NULL,
    "gradeAllowance" numeric(12,2) NOT NULL,
    "dearnessAllowance" numeric(12,2) NOT NULL,
    "employerPfSsfContribution" numeric(12,2) NOT NULL,
    "employeePfSsfDeduction" numeric(12,2) NOT NULL,
    "citDeduction" numeric(12,2) NOT NULL,
    "salaryAdvanceDeduction" numeric(12,2) NOT NULL,
    "sstTax1Percent" numeric(12,2) NOT NULL,
    "tdsIncomeTax" numeric(12,2) NOT NULL,
    "netPayable" numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."SalarySlip" OWNER TO johndoe;

--
-- Name: ScholarshipScheme; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."ScholarshipScheme" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    name text NOT NULL,
    "iemisScholarshipType" public."IemisScholarshipType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ScholarshipScheme" OWNER TO johndoe;

--
-- Name: Section; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Section" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "gradeLevelId" text NOT NULL,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    capacity integer,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "academicYearId" text,
    "classTeacherId" text,
    "roomNumber" text
);


ALTER TABLE public."Section" OWNER TO johndoe;

--
-- Name: StaffProfile; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StaffProfile" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "firstNameEn" text NOT NULL,
    "firstNameNe" text,
    "lastNameEn" text NOT NULL,
    "lastNameNe" text,
    "employeeCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "bankAccountNo" text,
    "casteEthnicity" text,
    "casteEthnicityCode" text,
    "citNumber" text,
    "employmentType" public."EmploymentType",
    gender public."Gender",
    "highestQualification" text,
    "iemisTeacherId" text,
    "maritalStatusForTax" public."MaritalStatusForTax",
    "middleNameEn" text,
    "middleNameNe" text,
    "panNumber" text,
    "pfNumber" text,
    "ssfNumber" text,
    "staffCategory" public."StaffCategory",
    "teacherTrainingStatus" public."TeacherTrainingStatus",
    "teachingLicenseNo" text
);


ALTER TABLE public."StaffProfile" OWNER TO johndoe;

--
-- Name: Stream; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Stream" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    code text NOT NULL,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Stream" OWNER TO johndoe;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text,
    "admissionNo" text NOT NULL,
    "iemisStudentId" character varying(20),
    "nebRegistrationNo" text,
    "symbolNo" text,
    "firstNameEn" text NOT NULL,
    "middleNameEn" text,
    "lastNameEn" text NOT NULL,
    "dobAd" timestamp(3) without time zone NOT NULL,
    "dobBs" character varying(10) NOT NULL,
    gender public."Gender" NOT NULL,
    "disabilityType" public."DisabilityType" DEFAULT 'NONE'::public."DisabilityType" NOT NULL,
    "motherTongue" text NOT NULL,
    "bloodGroup" text,
    "birthCertificateNo" text NOT NULL,
    "nationalIdNin" text NOT NULL,
    "hadEcdExperience" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "firstNameNe" text NOT NULL,
    "lastNameNe" text NOT NULL,
    "middleNameNe" text,
    "casteEthnicityCode" text NOT NULL,
    "casteEthnicity" text NOT NULL,
    "photoUrl" text
);


ALTER TABLE public."Student" OWNER TO johndoe;

--
-- Name: StudentDailyAttendance; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentDailyAttendance" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "sectionId" text NOT NULL,
    "dateAd" timestamp(3) without time zone NOT NULL,
    "dateBs" character varying(10) NOT NULL,
    status public."AttendanceStatus" NOT NULL,
    "checkInTime" text,
    "checkOutTime" text,
    source text,
    "markedByUserId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."StudentDailyAttendance" OWNER TO johndoe;

--
-- Name: StudentEnrollment; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentEnrollment" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "gradeLevelId" text NOT NULL,
    "sectionId" text NOT NULL,
    "rollNo" smallint NOT NULL,
    "houseName" text,
    "enrollmentStatus" public."EnrollmentStatus" DEFAULT 'NEW_ADMISSION'::public."EnrollmentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."StudentEnrollment" OWNER TO johndoe;

--
-- Name: StudentExamSummary; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentExamSummary" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "examId" text NOT NULL,
    "totalMarksObtained" numeric(8,2),
    percentage numeric(5,2),
    gpa numeric(3,2),
    "finalGrade" text,
    "rankInSection" integer,
    "rankInGrade" integer,
    "totalAttendanceDays" integer,
    "presentDays" integer,
    "classTeacherRemarks" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "enrollmentId" text NOT NULL
);


ALTER TABLE public."StudentExamSummary" OWNER TO johndoe;

--
-- Name: StudentGuardian; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentGuardian" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "guardianId" text NOT NULL,
    relationship public."GuardianRelationship" DEFAULT 'GUARDIAN'::public."GuardianRelationship" NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "otherRelationship" text
);


ALTER TABLE public."StudentGuardian" OWNER TO johndoe;

--
-- Name: StudentScholarship; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentScholarship" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "scholarshipSchemeId" text NOT NULL,
    "feeHeadId" text NOT NULL,
    "discountType" public."DiscountType" NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudentScholarship" OWNER TO johndoe;

--
-- Name: StudentTransport; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."StudentTransport" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "routeId" text NOT NULL,
    "stopId" text,
    "vehicleId" text,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."StudentTransport" OWNER TO johndoe;

--
-- Name: Subject; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Subject" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    code text NOT NULL,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Subject" OWNER TO johndoe;

--
-- Name: Subscription; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Subscription" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "planId" text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "trialEndsAt" timestamp(3) without time zone,
    "cancelledAt" timestamp(3) without time zone,
    "autoRenew" boolean DEFAULT true NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "assignedByPlatformUserId" text
);


ALTER TABLE public."Subscription" OWNER TO johndoe;

--
-- Name: SubscriptionPlan; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."SubscriptionPlan" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    currency text DEFAULT 'NPR'::text NOT NULL,
    "billingCycle" public."BillingCycle" NOT NULL,
    "trialDays" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SubscriptionPlan" OWNER TO johndoe;

--
-- Name: TeacherSubjectAllocation; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TeacherSubjectAllocation" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "academicYearId" text NOT NULL,
    "staffId" text NOT NULL,
    "sectionId" text NOT NULL,
    "subjectId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TeacherSubjectAllocation" OWNER TO johndoe;

--
-- Name: Tenant; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."Tenant" (
    id text NOT NULL,
    "organizationId" text,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL,
    subdomain text NOT NULL,
    "iemisCode" character varying(15) NOT NULL,
    "schoolType" public."SchoolType" NOT NULL,
    "provinceCode" text NOT NULL,
    "provinceNe" text NOT NULL,
    "provinceEn" text NOT NULL,
    "districtCode" text NOT NULL,
    "districtNe" text NOT NULL,
    "districtEn" text NOT NULL,
    "municipalityCode" text NOT NULL,
    "municipalityNe" text NOT NULL,
    "municipalityEn" text NOT NULL,
    "wardNumber" integer NOT NULL,
    "toleEn" text NOT NULL,
    "toleNe" text NOT NULL,
    "addressEn" text NOT NULL,
    "addressNe" text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    website text,
    "logoUrl" text,
    "establishedDateAd" timestamp(3) without time zone NOT NULL,
    "establishedDateBs" character varying(10) NOT NULL,
    status public."TenantStatus" DEFAULT 'ONBOARDING'::public."TenantStatus" NOT NULL,
    "createdByPlatformUserId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    "motoEn" text NOT NULL,
    "motoNe" text NOT NULL,
    "panVatNumber" text NOT NULL,
    "registrationNumber" text NOT NULL,
    "schoolCode" text NOT NULL
);


ALTER TABLE public."Tenant" OWNER TO johndoe;

--
-- Name: TenantUser; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TenantUser" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "userId" text NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leftAt" timestamp(3) without time zone
);


ALTER TABLE public."TenantUser" OWNER TO johndoe;

--
-- Name: TenantUserRole; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TenantUserRole" (
    "tenantUserId" text NOT NULL,
    "roleId" text NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TenantUserRole" OWNER TO johndoe;

--
-- Name: TimetableSlot; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TimetableSlot" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "sectionId" text NOT NULL,
    "dayOfWeek" smallint NOT NULL,
    "periodNo" integer NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "subjectId" text NOT NULL,
    "staffId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TimetableSlot" OWNER TO johndoe;

--
-- Name: TransferCertificate; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TransferCertificate" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "studentId" text NOT NULL,
    "issueDateAd" timestamp(3) without time zone NOT NULL,
    "issueDateBs" character varying(10) NOT NULL,
    "tcNumber" text NOT NULL,
    "destinationIemisCode" text,
    "characterRemark" text NOT NULL,
    "leavingReason" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TransferCertificate" OWNER TO johndoe;

--
-- Name: TransportRoute; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TransportRoute" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "vehicleId" text,
    fare numeric(10,2),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "descriptionEn" text,
    "descriptionNe" text,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL
);


ALTER TABLE public."TransportRoute" OWNER TO johndoe;

--
-- Name: TransportStop; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TransportStop" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "routeId" text NOT NULL,
    sequence integer NOT NULL,
    "arrivalTime" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    latitude double precision,
    longitude double precision,
    "nameEn" text NOT NULL,
    "nameNe" text NOT NULL
);


ALTER TABLE public."TransportStop" OWNER TO johndoe;

--
-- Name: TransportVehicle; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."TransportVehicle" (
    id text NOT NULL,
    "tenantId" text NOT NULL,
    "vehicleNumber" text NOT NULL,
    type public."TransportVehicleType" DEFAULT 'BUS'::public."TransportVehicleType" NOT NULL,
    capacity integer,
    "driverStaffId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TransportVehicle" OWNER TO johndoe;

--
-- Name: User; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text,
    phone text,
    "passwordHash" text,
    status public."UserStatus" DEFAULT 'PENDING_VERIFICATION'::public."UserStatus" NOT NULL,
    "profilePhotoUrl" text,
    "lastLoginAt" timestamp(3) without time zone,
    "refreshTokenHash" text,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "firstNameEn" text NOT NULL,
    "firstNameNe" text NOT NULL,
    "lastNameEn" text NOT NULL,
    "lastNameNe" text NOT NULL
);


ALTER TABLE public."User" OWNER TO johndoe;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: johndoe
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO johndoe;

--
-- Data for Name: AcademicCalendarEvent; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."AcademicCalendarEvent" (id, "tenantId", "academicYearId", "dateAd", "dateBs", "isHoliday", "createdAt", "updatedAt", "deletedAt", "titleEn", "titleNe") FROM stdin;
\.


--
-- Data for Name: AcademicYear; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."AcademicYear" (id, "tenantId", name, "bsYear", "startDateAd", "endDateAd", "startDateBs", "endDateBs", "isCurrent", "createdAt", "updatedAt", "deletedAt") FROM stdin;
805c785d-65c9-4f3f-b041-af11bc6081f6	c1bcb482-346d-41c2-952e-815e45722e63	2083	2083	2026-04-14 00:00:00	2027-04-13 00:00:00	2083-01-01	2083-12-30	f	2026-10-18 06:35:30.123	2026-10-18 06:35:34.155	2026-10-18 06:35:34.153
7361fd0a-c455-429d-a676-8c205060f936	c1bcb482-346d-41c2-952e-815e45722e63	2083	2083	2026-04-14 00:00:00	2027-04-13 00:00:00	2083-01-01	2083-12-30	t	2026-10-18 06:35:37.455	2026-10-18 06:35:37.455	\N
88029dce-6b33-4488-a5fb-52ffe4470934	7170125a-3952-4270-b29e-024dbfb4e19a	Hemant	2083	2026-04-28 00:00:00	2027-04-13 00:00:00	2083-01-15	2083-12-30	f	2026-10-21 13:07:19.282	2026-10-21 13:07:25.551	2026-10-21 13:07:25.542
ac5adb3a-fc51-45c4-b47b-14f14a604451	c1bcb482-346d-41c2-952e-815e45722e63	2081/82	2081	2024-04-13 00:00:00	2025-04-12 00:00:00	2081-01-01	2081-12-31	f	2026-11-14 07:21:18.879	2026-11-14 07:21:18.879	\N
0b27b905-2bc8-413e-9ae5-dc037d3ec33a	7170125a-3952-4270-b29e-024dbfb4e19a	2083 BS	2083	2026-04-14 00:00:00	2027-04-13 00:00:00	2083-01-01	2083-12-30	t	2026-10-21 12:45:23.402	2026-11-14 07:24:31.754	\N
\.


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Address" (id, "tenantId", type, format, "provinceCode", "provinceNe", "provinceEn", "districtCode", "districtNe", "districtEn", "municipalityCode", "municipalityNe", "municipalityEn", ward, "toleNe", "toleEn", "zoneCode", "zoneNe", "zoneEn", "vdcCode", "vdcNe", "vdcEn", village, "createdAt", "updatedAt", "deletedAt", "entityId", "entityType", latitude, longitude) FROM stdin;
edc38c7e-0fb5-4030-80c5-007f075f5976	c1bcb482-346d-41c2-952e-815e45722e63	PERMANENT	PROVINCIAL	3	बागमती प्रदेश	Bagmati Province	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	Kathmandu Metropolitan City	1	नयाँ बानेश्वर	New Baneshwor	\N	\N	\N	\N	\N	\N	\N	2026-10-18 07:35:01.051	2026-10-18 07:35:01.051	\N		STUDENT	\N	\N
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."AuditLog" (id, "userId", method, path, action, resource, "resourceId", "statusCode", "ipAddress", "createdAt") FROM stdin;
37405827-0875-4363-9b6e-bed3d78d3f12	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	POST	/platform/roles	\N	\N	\N	201	::ffff:192.168.65.1	2026-10-20 10:40:46.14
f589724f-dd04-4830-aeae-acae101517cd	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	POST	/platform/permissions	\N	\N	\N	400	::ffff:192.168.65.1	2026-10-20 10:43:13.141
77105d22-af26-46c2-814a-765452951819	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	POST	/platform/tenants/352aed64-a8fc-4693-b0d9-64a60b6fc60a/users	\N	\N	\N	201	::ffff:172.20.0.1	2026-10-21 12:00:28.846
\.


--
-- Data for Name: BookIssue; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."BookIssue" (id, "tenantId", "bookId", "studentId", "issueDateAd", "issueDateBs", "dueDateAd", "dueDateBs", "returnDateAd", "returnDateBs", "fineAmount", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ClassFeeStructure; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."ClassFeeStructure" (id, "tenantId", "academicYearId", "gradeLevelId", "feeHeadId", amount, "applicableBsMonths", "createdAt", "updatedAt", "deletedAt", "fiscalYearId") FROM stdin;
\.


--
-- Data for Name: CreditNote; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."CreditNote" (id, "tenantId", "invoiceId", "creditNoteNumber", reason, amount, "approvedByUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Exam" (id, "tenantId", "academicYearId", "gradingScaleId", name, "termWeightage", "startDateAd", "endDateAd", "startDateBs", "endDateBs", "resultPublishDateAd", "resultPublishDateBs", "isPublished", "isLocked", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ExamMark; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."ExamMark" (id, "tenantId", "examScheduleId", "enrollmentId", "theoryMarksObtained", "isTheoryAbsent", "internalMarksObtained", "isInternalAbsent", "internalBreakdown", "theoryGrade", "theoryGp", "internalGrade", "internalGp", "finalSubjectGrade", "finalSubjectGp", "enteredByUserId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamSchedule; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."ExamSchedule" (id, "tenantId", "examId", "gradeSubjectId", "examDateAd", "examDateBs", "startTime", "endTime", "theoryFullMarks", "theoryPassMarks", "internalFullMarks", "internalPassMarks", "createdAt", "updatedAt", "deletedAt", "creditHours", "internalCreditHours", "theoryCreditHours") FROM stdin;
\.


--
-- Data for Name: Feature; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Feature" (id, code, name, description, category, "isActive", "createdAt", "updatedAt") FROM stdin;
0370baf5-aa92-4799-9ae9-930ec649c763	parent.portal	Parent portal	Parent self-service portal	portal	t	2026-10-17 19:50:42.008	2026-10-18 14:32:07.75
85882b84-525a-4e10-b2c5-96395ed58898	mobile.app	Mobile app access	Mobile app for parents/students	portal	t	2026-10-17 19:50:42.009	2026-10-18 14:32:07.75
6fa57720-14c0-40f2-8388-691c1e9fcf14	custom.branding	Custom branding	Custom school branding	branding	t	2026-10-17 19:50:42.01	2026-10-18 14:32:07.751
096369d6-567f-462a-a9ff-d5f271a3b258	priority.support	Priority support	Priority customer support	support	t	2026-10-17 19:50:42.012	2026-10-18 14:32:07.752
bb0c89b8-866c-48ff-b829-ea9cde21113f	api.access	API access	Access to public API	integration	t	2026-10-17 19:50:42.013	2026-10-18 14:32:07.752
5ee5672d-9f55-49c9-ab66-ad2f7334ca3c	library.management	Library management	Manage school library	academics	t	2026-10-17 19:53:06.796	2026-10-17 19:53:06.796
8ff74ab4-612c-48b2-8571-e1db941db120	students.limit	Student limit	Maximum number of students	limits	t	2026-10-17 19:50:41.996	2026-10-18 14:32:07.744
bd61a5a7-6f30-4196-832f-0f19ae82fa57	teachers.limit	Teacher limit	Maximum number of teachers	limits	t	2026-10-17 19:50:41.999	2026-10-18 14:32:07.746
f7a96376-7d09-492a-9f92-97cf9ebaf689	storage.gb	Storage (GB)	File storage quota	limits	t	2026-10-17 19:50:42	2026-10-18 14:32:07.746
da718b15-623f-4bca-8987-15868624cb02	sms.notifications	SMS notifications	Send SMS to parents	communication	t	2026-10-17 19:50:42.001	2026-10-18 14:32:07.747
0ec75d70-4664-48b6-8c3a-277614a07171	email.notifications	Email notifications	Send email notifications	communication	t	2026-10-17 19:50:42.002	2026-10-18 14:32:07.747
7442ddd4-b4b8-4876-804f-bda5a0293660	report.cards	Report cards	Generate report cards	academics	t	2026-10-17 19:50:42.003	2026-10-18 14:32:07.748
457fae5c-61d1-43dd-842f-aa846f897667	attendance.tracking	Attendance tracking	Track student attendance	academics	t	2026-10-17 19:50:42.005	2026-10-18 14:32:07.748
a4940b18-4798-4398-bc3d-4d14fa5b9f29	fee.management	Fee management	Manage fees and invoices	finance	t	2026-10-17 19:50:42.006	2026-10-18 14:32:07.749
bab0c99f-73be-4d38-9fe7-2f1b77aae239	online.payments	Online payments	Accept online payments	finance	t	2026-10-17 19:50:42.007	2026-10-18 14:32:07.749
\.


--
-- Data for Name: FeeHead; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."FeeHead" (id, "tenantId", "nameEn", "nameNe", frequency, "isTaxable", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: FeeInvoice; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."FeeInvoice" (id, "tenantId", "fiscalYearId", "academicYearId", "enrollmentId", "invoiceNumber", "issueDateAd", "issueDateBs", "dueDateBs", "billedUpToBsMonth", "subtotalAmount", "discountAmount", "previousDuesBroughtForward", "netPayableAmount", "paidAmount", "balanceDue", status, "printCount", "isSyncedToIrd", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: FeeInvoiceItem; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."FeeInvoiceItem" (id, "tenantId", "invoiceId", "feeHeadId", "bsMonth", description, "grossAmount", "discountAmount", "netAmount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeePayment; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."FeePayment" (id, "tenantId", "fiscalYearId", "enrollmentId", "invoiceId", "receiptNumber", "paymentDateAd", "paymentDateBs", "amountPaid", "paymentMethod", "gatewayTransactionId", "gatewayResponsePayload", "collectedByUserId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: FiscalYear; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."FiscalYear" (id, "tenantId", name, "startDateAd", "startDateBs", "endDateAd", "endDateBs", "isActive", "createdAt", "updatedAt", "deletedAt") FROM stdin;
9ebbaad2-0257-43db-9c4e-343426ad4f59	c1bcb482-346d-41c2-952e-815e45722e63	FY 2081/82	2024-07-16 00:00:00	2081-04-01	2025-08-16 00:00:00	2082-04-31	f	2026-11-14 07:21:18.855	2026-11-14 07:21:18.855	\N
\.


--
-- Data for Name: GradeLevel; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."GradeLevel" (id, "tenantId", "streamId", "nameEn", "nameNe", "iemisGradeCode", "evaluationType", "sortOrder", "createdAt", "updatedAt", "deletedAt") FROM stdin;
2656ed87-8c28-4ea0-a9ea-fa719f60fd7f	c1bcb482-346d-41c2-952e-815e45722e63	\N	Grade 11 Updated	कक्षा ११	11	PERCENTAGE	11	2026-10-18 06:48:39.547	2026-10-18 06:58:17.188	\N
e09b1e90-0ab1-491f-9769-5c82a73f4cce	7170125a-3952-4270-b29e-024dbfb4e19a	\N	LKG	LKG	\N	PERCENTAGE	2	2026-10-21 13:44:35.867	2026-10-21 13:44:35.867	\N
943101c8-8c2e-4967-93d2-e249126fa562	c1bcb482-346d-41c2-952e-815e45722e63	\N	Grade 5	कक्षा ५	\N	PERCENTAGE	0	2026-11-14 07:21:18.9	2026-11-14 07:21:18.9	\N
\.


--
-- Data for Name: GradeSubject; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."GradeSubject" (id, "tenantId", "gradeLevelId", "subjectId", "isOptional", "sortOrder", "createdAt", "updatedAt", "deletedAt", "creditHours", "internalCreditHours", "internalFullMarks", "internalPassMarks", "theoryCreditHours", "theoryFullMarks", "theoryPassMarks") FROM stdin;
\.


--
-- Data for Name: GradingScale; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."GradingScale" (id, "tenantId", name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: GradingScaleItem; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."GradingScaleItem" (id, "gradingScaleId", "minPercentage", "maxPercentage", "letterGrade", "gradePoint", "descriptorEn", "descriptorNp", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Guardian; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Guardian" (id, "tenantId", "userId", "nameEn", "nameNe", phone, email, occupation, "nationalIdNin", "photoUrl", "createdAt", "updatedAt", "deletedAt", "citizenshipDetails") FROM stdin;
49bc2d5b-227e-4017-af34-0cdf8139fba6	c1bcb482-346d-41c2-952e-815e45722e63	\N	Ram Sharma	राम शर्मा	+977-9800000000	ram@example.com	Engineer	NIN-001	\N	2026-10-18 07:36:46.672	2026-10-18 07:36:46.672	\N	{"number": "123", "issuedDateBs": "2060-01-01", "issuedDistrictEn": "Kathmandu", "issuedDistrictNe": "काठमाडौं"}
\.


--
-- Data for Name: Hostel; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Hostel" (id, "tenantId", "nameEn", "nameNe", type, capacity, "wardenStaffId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: HostelAllocation; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."HostelAllocation" (id, "tenantId", "hostelId", "roomId", "enrollmentId", "startDate", "endDate", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: HostelRoom; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."HostelRoom" (id, "tenantId", "hostelId", "roomNumber", floor, capacity, "roomType", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Invoice" (id, "tenantId", "subscriptionId", number, amount, currency, status, "issueDate", "dueDate", "paidAt", notes, "createdAt", "updatedAt") FROM stdin;
e6d6a7b5-e5c3-4637-89d5-bd7f399239aa	352aed64-a8fc-4693-b0d9-64a60b6fc60a	\N	INV-001	1500.00	NPR	PAID	2026-10-18 06:12:28.537	2026-02-10 00:00:00	2026-10-18 06:12:59.395	\N	2026-10-18 06:12:28.537	2026-10-18 06:12:59.397
\.


--
-- Data for Name: LibraryBook; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."LibraryBook" (id, "tenantId", isbn, category, "totalCopies", "availableCopies", "createdAt", "updatedAt", "deletedAt", "authorEn", "authorNe", "titleEn", "titleNe") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Notification" (id, "tenantId", "recipientType", "recipientId", title, message, type, "isRead", "readAt", metadata, "createdAt", "updatedAt", "deletedAt") FROM stdin;
e9a854be-afcd-4cf2-922a-76de9ee31772	\N	PLATFORM_USER	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	New tenant created	Demo School has been created.	SUCCESS	t	2026-10-18 14:36:52.536	\N	2026-10-18 14:32:07.902	2026-10-18 14:36:52.538	\N
691a83a5-ebeb-4449-8c5b-fbe178dca053	\N	PLATFORM_USER	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	Welcome to School SaaS	Your platform is ready. Start by onboarding schools.	INFO	t	2026-10-18 14:37:07.352	\N	2026-10-18 14:32:07.902	2026-10-18 14:37:07.352	\N
3baa7bdc-e746-4905-838a-72be9264281c	\N	PLATFORM_USER	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	Subscription expiring	A school subscription will expire soon.	WARNING	t	2026-10-18 14:37:15.56	\N	2026-10-18 14:32:07.902	2026-10-18 14:37:15.56	\N
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Organization" (id, "panVatNumber", "createdByPlatformUserId", "resellerPartnerId", "createdAt", "updatedAt", "deletedAt", "contactPersonEmail", "contactPersonName", "contactPersonPhone", email, "fiscalYearStartMonth", "isTaxExempt", "logoUrl", "nameEn", notes, "organizationType", phone, "registrationNumber", "shortName", status, timezone, "wardNumber", website, "establishedDateAd", "establishedDateBs", "nameNe", "addressEn", "addressNe", "districtCode", "districtEn", "districtNe", "municipalityCode", "municipalityEn", "municipalityNe", "provinceCode", "provinceEn", "provinceNe", "toleEn", "toleNe") FROM stdin;
04ec215a-556f-4a94-ab71-5dc10093cb34	PAN1792304530	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	\N	2026-10-18 06:22:11.125	2026-10-18 06:22:11.125	\N	\N	C	+977-9	o@t.com	7	f	\N	Smoke Org	\N	FOUNDATION	+977-1-1	\N	\N	ACTIVE	Asia/Kathmandu	1	\N	\N	\N	स्मोक ओर्ग	Addr	ठेगाना	27	Kathmandu	काठमाडौं	2701	KMC	काठमाडौं महानगरपालिका	3	Bagmati	बागमती	T	ट
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Payment" (id, "invoiceId", amount, currency, method, status, "transactionRef", "paidAt", "createdAt", "updatedAt") FROM stdin;
8c529ef2-0507-460f-9a01-5562bfedb083	e6d6a7b5-e5c3-4637-89d5-bd7f399239aa	1500.00	NPR	ESEWA	SUCCESS	\N	\N	2026-10-18 06:12:59.39	2026-10-18 06:12:59.39
\.


--
-- Data for Name: PayrollRun; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PayrollRun" (id, "tenantId", "fiscalYearId", "bsYear", "bsMonth", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Permission" (id, code, name, description, category, "createdAt", "updatedAt") FROM stdin;
e309a291-0301-4f5f-a337-06701e165285	fee_invoices.manage	Manage fee invoices	\N	billing	2026-10-18 08:03:24.567	2026-10-18 14:32:07.785
5d0cfa46-0066-4c79-87d4-ee732359ee6b	teachers.delete	Delete teachers	\N	teachers	2026-10-17 20:54:02.341	2026-10-18 14:32:07.776
081233de-2419-4445-89eb-03646274096b	students.create	Create students	\N	students	2026-10-17 20:54:02.338	2026-10-18 14:32:07.773
0506c67c-ac84-4bc8-869f-053e59ac9e85	grading_scales.read	Read grading scales	\N	academic	2026-10-18 07:48:16.078	2026-10-18 14:32:07.791
9588fb83-f395-4be6-82df-c777de86136c	enrollments.read	Read enrollments	\N	enrollments	2026-10-18 07:39:13.308	2026-10-18 14:32:07.808
09b1acab-8b07-4eb4-be34-b6e7b5f938be	subjects.manage	Manage subjects	\N	academic	2026-10-18 07:00:02.979	2026-10-18 14:32:07.792
456de1b9-e6c4-40bf-a6a4-bd0f1f9085ce	grade_subjects.read	Read grade subjects	\N	academic	2026-10-18 07:00:02.98	2026-10-18 14:32:07.792
9cd28482-c780-429e-84c7-ba3f1159f3ba	roles.manage	Manage roles	\N	roles	2026-10-17 20:55:00.894	2026-10-18 14:32:07.77
26bbe5a2-44f6-496e-bb1a-0f9979e4e606	streams.read	Read streams	\N	academic	2026-10-18 06:44:22.64	2026-10-18 14:32:07.793
831423cb-f26d-4f7c-8196-f9bcb1915a4e	grade_levels.manage	Manage grade levels	\N	academic	2026-10-18 06:44:22.642	2026-10-18 14:32:07.795
8e534cec-e1a4-42c7-80c6-0b93f2887d5e	grading_scales.manage	Manage grading scales	\N	academic	2026-10-18 07:48:16.078	2026-10-18 14:32:07.791
5bc9ed96-b616-44c0-bd4a-42eaff2b37e9	fee_payments.read	Read fee payments	\N	billing	2026-10-18 08:03:24.568	2026-10-18 14:32:07.785
59f99fb9-55d0-4286-a1ab-65ed667203cc	guardians.manage	Manage guardians	\N	guardians	2026-10-18 07:26:13.459	2026-10-18 14:32:07.809
ddee707b-abf5-4276-b229-554683e1de80	fees.read	Read fees	\N	fees	2026-10-17 20:54:02.342	2026-10-18 14:32:07.783
462c251e-01ca-48bd-bcfe-0d5434efb597	fees.manage	Manage fees	\N	fees	2026-10-17 20:54:02.343	2026-10-18 14:32:07.783
1899983a-8c23-4161-a2a0-97353062892c	credit_notes.read	Read credit notes	\N	billing	2026-10-18 08:03:24.569	2026-10-18 14:32:07.786
a21a8d55-da15-4831-9641-04a5756c6fa2	staff.read	Read staff profiles	\N	staff	2026-10-18 06:44:22.643	2026-10-18 14:32:07.796
8d3c6b45-6f55-4101-b616-2333dd7fea5f	sections.read	Read sections	\N	academic	2026-10-18 06:44:22.642	2026-10-18 14:32:07.795
bfbce1fb-11c7-48f9-af6a-2af5b60eb37d	students.manage	Manage students	\N	students	2026-10-18 07:26:13.458	2026-10-18 14:32:07.806
b904b7b3-7d5d-4a03-97c7-77c259ba9b07	students.update	Update students	\N	students	2026-10-17 20:54:02.338	2026-10-18 14:32:07.773
c3cb9fad-f2b1-4be3-96ea-aa53d84d1a55	reports.read	Read reports	\N	reports	2026-10-17 20:54:02.344	2026-10-18 14:32:07.788
45999b81-b24a-43f0-bc05-3c7c34576573	staff.manage	Manage staff profiles	\N	staff	2026-10-18 06:44:22.643	2026-10-18 14:32:07.797
4ee93789-b66a-4216-9bec-be58d63836aa	permissions.read	Read permissions	\N	permissions	2026-10-17 20:55:00.895	2026-10-18 14:32:07.77
94805b15-5c26-491e-a50f-df7f033a9504	streams.manage	Manage streams	\N	academic	2026-10-18 06:44:22.641	2026-10-18 14:32:07.794
fa74aa5f-55f7-4d62-8ae3-3ad8aeff179c	teachers.read	Read teachers	\N	teachers	2026-10-17 20:54:02.339	2026-10-18 14:32:07.775
351f495c-c6e7-41f9-b252-0e58d6e4de01	exams.read	Read exams	\N	exams	2026-10-17 20:54:02.343	2026-10-18 14:32:07.782
f894c6fe-78cc-41dc-b9a8-aa54b6011850	academic_years.read	Read academic years	\N	academic	2026-10-18 06:28:58.654	2026-10-18 14:32:07.789
14a8ee1a-1195-4239-b28d-04bd126b485e	teachers.create	Create teachers	\N	teachers	2026-10-17 20:54:02.34	2026-10-18 14:32:07.775
8c32ec3d-f886-447e-9ad2-66bc7efdc90a	tenant_users.read	Read tenant users	\N	tenant_users	2026-10-17 20:55:00.896	2026-10-18 14:32:07.771
34c49114-b81d-4be8-8ebe-dd96709cb1f7	tenant_users.manage	Manage tenant users	\N	tenant_users	2026-10-17 20:55:00.896	2026-10-18 14:32:07.772
42f98219-b59c-4198-a3ae-b32c0d4a8d91	students.read	Read students	\N	students	2026-10-17 20:54:02.337	2026-10-18 14:32:07.806
1e2ab7a3-20b4-4b76-8a2c-b2a4cdcc639c	enrollments.manage	Manage enrollments	\N	enrollments	2026-10-18 07:39:13.308	2026-10-18 14:32:07.808
ee41dc00-4868-4dce-80c8-10c30863b0cf	transfer_certificates.read	Read transfer certificates	\N	certificates	2026-10-18 07:42:01.185	2026-10-18 14:32:07.807
54bf8723-0b50-44c0-9838-79a1b4b7b98f	grade_subjects.manage	Manage grade subjects	\N	academic	2026-10-18 07:00:02.98	2026-10-18 14:32:07.793
18d6ff31-adaa-45f8-a083-46a054a88f3f	grade_levels.read	Read grade levels	\N	academic	2026-10-18 06:44:22.641	2026-10-18 14:32:07.794
b3f0b5d8-e13e-4067-a006-eeb60e0abe6b	guardians.read	Read guardians	\N	guardians	2026-10-18 07:26:13.459	2026-10-18 14:32:07.809
0d511f1e-24e2-4131-8689-af7b1e041e6b	addresses.read	Read addresses	\N	addresses	2026-10-18 07:26:13.46	2026-10-18 14:32:07.81
8ff4525c-0f27-46d3-a917-6ad96c2075d8	attendance.read	Read attendance	\N	attendance	2026-10-17 20:54:02.341	2026-10-18 14:32:07.776
6450aa53-b8b2-49b7-a293-5f4ff7990404	addresses.manage	Manage addresses	\N	addresses	2026-10-18 07:26:13.46	2026-10-18 14:32:07.811
b39a0dc5-488c-4df0-b3f6-2b5f3ef42c79	roles.read	Read roles	\N	roles	2026-10-17 20:55:00.893	2026-10-18 14:32:07.769
fa2d7178-7c42-4183-b9df-e2bb473a5303	scholarships.read	Read scholarships	\N	scholarships	2026-10-18 07:59:54.211	2026-10-18 14:32:07.787
99f75ee9-b2f9-4e5c-9b07-a41332f59cb4	transfer_certificates.manage	Manage transfer certificates	\N	certificates	2026-10-18 07:42:01.186	2026-10-18 14:32:07.807
eb028522-9771-4ae4-a28e-7c9d6bce7d3b	students.delete	Delete students	\N	students	2026-10-17 20:54:02.339	2026-10-18 14:32:07.774
e1f0e4a5-b57f-4c52-87a6-f603e16db2df	teachers.update	Update teachers	\N	teachers	2026-10-17 20:54:02.34	2026-10-18 14:32:07.776
9c583ae4-7860-4072-a314-eee1a3462bf1	exams.manage	Manage exams	\N	exams	2026-10-17 20:54:02.343	2026-10-18 14:32:07.782
6a1fcd63-d1b8-48b6-a251-f9711cab4087	academic_years.manage	Manage academic years	\N	academic	2026-10-18 06:28:58.655	2026-10-18 14:32:07.789
9f93faa1-1c04-4850-9b13-24e2116ea747	attendance.manage	Manage attendance	\N	attendance	2026-10-17 20:54:02.342	2026-10-18 14:32:07.777
fe9e820a-efa9-4c08-94a1-9199a3bf0156	fee_invoices.read	Read fee invoices	\N	billing	2026-10-18 08:03:24.567	2026-10-18 14:32:07.784
2da87ed7-6ee3-48c7-84d3-b0747d172714	scholarships.manage	Manage scholarships	\N	scholarships	2026-10-18 07:59:54.211	2026-10-18 14:32:07.788
b0055deb-4ab5-425b-b5a1-d0be155b0cfc	sections.manage	Manage sections	\N	academic	2026-10-18 06:44:22.643	2026-10-18 14:32:07.796
f155f2f5-7367-47ba-9c99-e95e9146a1f7	subjects.read	Read subjects	\N	academic	2026-10-18 07:00:02.978	2026-10-18 14:32:07.792
79e16582-303e-4afb-a478-47042e20a872	fee_payments.manage	Manage fee payments	\N	billing	2026-10-18 08:03:24.568	2026-10-18 14:32:07.786
090875c6-f1b8-4058-8a53-ebf9ac838769	permissions.manage	Manage permissions	\N	permissions	2026-10-17 20:55:00.895	2026-10-18 14:32:07.771
49e4a00a-235a-4be0-a72a-705643e09491	hostel.manage	Manage hostel	\N	hostel	2026-10-18 08:39:02.037	2026-10-18 14:32:07.801
4cb130b1-b84b-44c1-851e-ef446f3cd2fa	library.read	Read library	\N	library	2026-10-18 08:28:39.851	2026-10-18 14:32:07.802
80304a3a-92d9-4a3e-853a-019049838361	library.manage	Manage library	\N	library	2026-10-18 08:28:39.852	2026-10-18 14:32:07.802
46be964c-1caf-4fdf-a33b-830235fb7743	transport.read	Read transport	\N	transport	2026-10-18 08:23:51.522	2026-10-18 14:32:07.803
5e838ff9-8648-491f-84e7-eaaa937423ae	transport.manage	Manage transport	\N	transport	2026-10-18 08:23:51.523	2026-10-18 14:32:07.804
a9740959-a95c-4f8d-915c-7f832bad4c48	hr.read	Read HR data	\N	hr	2026-10-18 08:10:18.374	2026-10-18 14:32:07.805
32e2c362-4524-41bc-a1bd-a9522933f69d	hr.manage	Manage HR data	\N	hr	2026-10-18 08:10:18.375	2026-10-18 14:32:07.805
f3f08c28-fcf6-4601-ae4e-9f0cc23ee949	credit_notes.manage	Manage credit notes	\N	billing	2026-10-18 08:03:24.571	2026-10-18 14:32:07.787
6bdf578f-0ce6-4d38-824a-bf4ccb0a6bc5	academic_calendar.read	Read academic calendar	\N	academic	2026-10-18 08:15:35.694	2026-10-18 14:32:07.79
9091efec-f7a9-49fc-9334-e9bf741094e1	academic_calendar.manage	Manage academic calendar	\N	academic	2026-10-18 08:15:35.696	2026-10-18 14:32:07.79
d4c7cba7-a27c-43d8-8576-0b7e1a01d80c	notifications.read	Read notifications	\N	notifications	2026-10-18 14:30:26.498	2026-10-18 14:32:07.797
a05762d2-fd39-46ad-8e44-5a1e45731c8d	notifications.manage	Manage notifications	\N	notifications	2026-10-18 14:30:26.506	2026-10-18 14:32:07.798
e3eec2fa-7685-448f-b631-c25bac669d3c	hostel.read	Read hostel	\N	hostel	2026-10-18 08:39:02.036	2026-10-18 14:32:07.799
\.


--
-- Data for Name: PlanFeature; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlanFeature" ("planId", "featureId", "isEnabled", "limit", config) FROM stdin;
37c4537b-724e-41ec-aece-1296a0f6d1dc	8ff74ab4-612c-48b2-8571-e1db941db120	t	200	\N
37c4537b-724e-41ec-aece-1296a0f6d1dc	bd61a5a7-6f30-4196-832f-0f19ae82fa57	t	20	\N
37c4537b-724e-41ec-aece-1296a0f6d1dc	f7a96376-7d09-492a-9f92-97cf9ebaf689	t	5	\N
37c4537b-724e-41ec-aece-1296a0f6d1dc	0ec75d70-4664-48b6-8c3a-277614a07171	t	\N	\N
37c4537b-724e-41ec-aece-1296a0f6d1dc	457fae5c-61d1-43dd-842f-aa846f897667	t	\N	\N
37c4537b-724e-41ec-aece-1296a0f6d1dc	a4940b18-4798-4398-bc3d-4d14fa5b9f29	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	8ff74ab4-612c-48b2-8571-e1db941db120	t	800	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	bd61a5a7-6f30-4196-832f-0f19ae82fa57	t	60	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	f7a96376-7d09-492a-9f92-97cf9ebaf689	t	25	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	da718b15-623f-4bca-8987-15868624cb02	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	0ec75d70-4664-48b6-8c3a-277614a07171	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	7442ddd4-b4b8-4876-804f-bda5a0293660	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	457fae5c-61d1-43dd-842f-aa846f897667	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	a4940b18-4798-4398-bc3d-4d14fa5b9f29	t	\N	\N
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	0370baf5-aa92-4799-9ae9-930ec649c763	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	8ff74ab4-612c-48b2-8571-e1db941db120	t	3000	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	bd61a5a7-6f30-4196-832f-0f19ae82fa57	t	200	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	f7a96376-7d09-492a-9f92-97cf9ebaf689	t	100	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	da718b15-623f-4bca-8987-15868624cb02	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	0ec75d70-4664-48b6-8c3a-277614a07171	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	7442ddd4-b4b8-4876-804f-bda5a0293660	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	457fae5c-61d1-43dd-842f-aa846f897667	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	a4940b18-4798-4398-bc3d-4d14fa5b9f29	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	bab0c99f-73be-4d38-9fe7-2f1b77aae239	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	0370baf5-aa92-4799-9ae9-930ec649c763	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	85882b84-525a-4e10-b2c5-96395ed58898	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	6fa57720-14c0-40f2-8388-691c1e9fcf14	t	\N	\N
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	096369d6-567f-462a-a9ff-d5f271a3b258	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	8ff74ab4-612c-48b2-8571-e1db941db120	t	10000	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	bd61a5a7-6f30-4196-832f-0f19ae82fa57	t	500	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	f7a96376-7d09-492a-9f92-97cf9ebaf689	t	500	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	da718b15-623f-4bca-8987-15868624cb02	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	0ec75d70-4664-48b6-8c3a-277614a07171	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	7442ddd4-b4b8-4876-804f-bda5a0293660	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	457fae5c-61d1-43dd-842f-aa846f897667	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	a4940b18-4798-4398-bc3d-4d14fa5b9f29	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	bab0c99f-73be-4d38-9fe7-2f1b77aae239	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	0370baf5-aa92-4799-9ae9-930ec649c763	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	85882b84-525a-4e10-b2c5-96395ed58898	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	6fa57720-14c0-40f2-8388-691c1e9fcf14	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	096369d6-567f-462a-a9ff-d5f271a3b258	t	\N	\N
594e65ba-8a9a-4eaa-805e-c20f509b5608	bb0c89b8-866c-48ff-b829-ea9cde21113f	t	\N	\N
\.


--
-- Data for Name: PlatformPermission; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformPermission" (id, code, name, description, category, "createdAt", "updatedAt") FROM stdin;
73076806-454a-41ec-9cf2-37bb8019ea65	platform_users.update	Update platform users	\N	platform_users	2026-10-17 19:12:56.968	2026-10-18 14:32:07.563
a8845bcf-629a-43e9-9af4-dbddae5a8c95	e2e.read.debug	E2E Read	\N	e2e	2026-10-17 19:15:52.773	2026-10-17 19:15:52.773
c2793824-3d39-40bc-827d-c730094b2e4d	platform_users.delete	Delete platform users	\N	platform_users	2026-10-17 19:12:56.969	2026-10-18 14:32:07.565
3559a8ed-b637-408b-bb54-3d7c558932e1	settings.read	Read settings	\N	settings	2026-10-17 19:12:56.976	2026-10-18 14:32:07.575
cda8a69e-e102-4e6b-a687-cb655a193175	settings.manage	Manage settings	\N	settings	2026-10-17 19:12:56.977	2026-10-18 14:32:07.575
1c8307a1-bc9f-4803-818d-a1a14a28d552	e2e.read.debugx	E2E Read	\N	e2e	2026-10-17 19:16:17.202	2026-10-17 19:16:17.202
950ced72-59a2-4fcf-b228-b33d3a5cbf21	organizations.read	Read organizations	\N	organizations	2026-10-17 20:01:02.398	2026-10-18 14:32:07.576
e2a25cd4-7a4c-452c-90ba-ea8ead75cc6c	organizations.manage	Manage organizations	\N	organizations	2026-10-17 20:01:02.399	2026-10-18 14:32:07.577
8d625fe0-7611-4a16-95d5-278ca83e1262	e2e.read.nctavbuo	E2E Read	\N	e2e	2026-10-17 19:16:27.261	2026-10-17 19:16:27.261
ff442ab0-f7db-4178-ae50-a6c14dd8fc59	tenants.read	Read tenants	\N	tenants	2026-10-17 20:38:32.173	2026-10-18 14:32:07.577
d7a12269-65bf-41ac-a026-df99a09dde93	e2e.read.tctupjte	E2E Read	\N	e2e	2026-10-17 19:16:35.207	2026-10-17 19:16:35.207
29874dfc-36bf-4e0b-b16e-fe1d958f43cd	tenants.manage	Manage tenants	\N	tenants	2026-10-17 20:38:32.174	2026-10-18 14:32:07.578
12115f8e-0996-40c3-a94b-f384dd3ec48d	e2e.read.jdzczewl	E2E Read	\N	e2e	2026-10-17 19:16:40.834	2026-10-17 19:16:40.834
9b26acc8-d674-4aad-ae31-882f082d88c3	tenant_users.read	Read tenant users	\N	tenant_users	2026-10-17 20:55:28.315	2026-10-18 14:32:07.578
8305e0db-8b5e-48a3-80d3-82cc6e8be2a6	e2e.read.ztngdlvq	E2E Read	\N	e2e	2026-10-17 19:16:43.471	2026-10-17 19:16:43.471
9929c191-d059-4f6e-8c9c-327a4a1fb508	tenant_users.manage	Manage tenant users	\N	tenant_users	2026-10-17 20:55:28.315	2026-10-18 14:32:07.579
0f1e01ea-5d04-49ad-8cbf-e26abdb0a55c	e2e.read.shtzyhsx	E2E Read	\N	e2e	2026-10-17 19:16:46.771	2026-10-17 19:16:46.771
7cb014f2-efce-4f21-9eda-fb0160b44e41	academic_years.read	Read academic years	\N	academic	2026-10-18 06:28:58.489	2026-10-18 14:32:07.579
435512cd-09a8-43dd-8d75-3dbfc99e8a8c	e2e.read.skfoeqtu	E2E Read	\N	e2e	2026-10-17 19:17:01.719	2026-10-17 19:17:01.719
4b030bf2-d640-45e9-b29d-43fa4b58fdc1	academic_years.manage	Manage academic years	\N	academic	2026-10-18 06:28:58.49	2026-10-18 14:32:07.58
5d55295e-21a2-4bd9-995e-16cf083de6b6	e2e.read.lxziupll	E2E Read	\N	e2e	2026-10-17 19:17:04.38	2026-10-17 19:17:04.38
c41c194a-32af-4c34-b308-4c094bab246c	fees.read	Read fees	\N	fees	2026-10-18 07:59:53.993	2026-10-18 14:32:07.583
8fec6b08-480b-4c4b-afdf-a113b0b29c70	e2e.read.ywnhbmil	E2E Read	\N	e2e	2026-10-17 19:17:08.814	2026-10-17 19:17:08.814
4fd3db70-191c-4389-a013-7023e8f31290	streams.read	Read streams	\N	academic	2026-10-18 06:44:22.445	2026-10-18 14:32:07.59
8f6adc5a-8649-433f-8cce-0f95746954b7	streams.manage	Manage streams	\N	academic	2026-10-18 06:44:22.446	2026-10-18 14:32:07.59
f9c73374-4917-4132-aff4-0e67fb0acea0	grade_levels.read	Read grade levels	\N	academic	2026-10-18 06:44:22.446	2026-10-18 14:32:07.593
6a39d3a1-698b-428c-b632-1a4ee6237e28	grade_levels.manage	Manage grade levels	\N	academic	2026-10-18 06:44:22.447	2026-10-18 14:32:07.593
3fda8144-59f4-41dc-9597-ce0a5daf4914	sections.read	Read sections	\N	academic	2026-10-18 06:44:22.447	2026-10-18 14:32:07.594
7dd9a5d0-2a45-4177-8099-52d899ee5749	sections.manage	Manage sections	\N	academic	2026-10-18 06:44:22.448	2026-10-18 14:32:07.595
2cc3ad50-b644-4c17-b972-fabf9a82f553	staff.read	Read staff profiles	\N	staff	2026-10-18 06:44:22.449	2026-10-18 14:32:07.595
47f23ee8-dc9b-42fe-b8e1-84ae0d4e8e0e	e2e.read.kilrlqyc	E2E Read	\N	e2e	2026-10-17 19:17:31.114	2026-10-17 19:17:31.114
3e7ebfed-9698-4efc-89d1-083d7e0cc06e	staff.manage	Manage staff profiles	\N	staff	2026-10-18 06:44:22.449	2026-10-18 14:32:07.596
8469f007-8e3f-4f51-b3ce-e574f4ad8b0a	transfer_certificates.read	Read transfer certificates	\N	certificates	2026-10-18 07:42:01.003	2026-10-18 14:32:07.608
3a85382f-bdf3-4b51-83b9-6acbde76b7d6	enrollments.read	Read enrollments	\N	enrollments	2026-10-18 07:39:13.138	2026-10-18 14:32:07.61
9117f8d6-523d-40f3-893c-86fde22cc0c0	schools.create	Create schools	\N	schools	2026-10-17 19:12:56.958	2026-10-18 14:32:07.545
a4ffa51c-5289-4731-b23a-e61b7f186f59	schools.update	Update schools	\N	schools	2026-10-17 19:12:56.96	2026-10-18 14:32:07.547
630b18aa-56d7-48ed-8571-d2679e4969e6	schools.delete	Delete schools	\N	schools	2026-10-17 19:12:56.962	2026-10-18 14:32:07.554
47880d9f-b0be-4683-b464-fc79d6249425	reports.read	Read reports	Can view reports	reports	2026-10-17 19:33:35.708	2026-10-17 19:33:35.708
0ccd645b-682e-4d77-b750-3d3e564c427f	subscriptions.read	Read subscriptions	\N	subscriptions	2026-10-17 19:12:56.963	2026-10-18 14:32:07.556
8a08588d-a17f-444c-91b2-a776447a0af5	smoke.perm.test	Smoke Perm	\N	smoke	2026-10-18 06:22:28.578	2026-10-18 06:22:28.578
465f4f32-a692-4bed-ab19-97e196ec7193	subscriptions.manage	Manage subscriptions	\N	subscriptions	2026-10-17 19:12:56.964	2026-10-18 14:32:07.558
d2c66917-16f3-49b4-93a3-a8a5b88dd9dc	subscriptions.cancel	Cancel subscriptions	\N	subscriptions	2026-10-17 19:12:56.965	2026-10-18 14:32:07.559
17ea1296-3c16-4449-ae2c-3577add8a542	platform_users.read	Read platform users	\N	platform_users	2026-10-17 19:12:56.966	2026-10-18 14:32:07.561
49293a8e-0c9f-4b41-adb3-10b60695a382	platform_users.create	Create platform users	\N	platform_users	2026-10-17 19:12:56.967	2026-10-18 14:32:07.562
bb14074b-64fb-4a65-b762-c7db2b370ebc	roles.read	Read roles	\N	roles	2026-10-17 19:12:56.97	2026-10-18 14:32:07.566
323da819-cb5f-401f-bd0b-ec9fe416b282	roles.manage	Manage roles	Updated description	roles	2026-10-17 19:12:56.971	2026-10-18 14:32:07.567
149e9169-2d69-4975-a2cf-335ea2183b32	permissions.read	Read permissions	\N	permissions	2026-10-17 19:12:56.972	2026-10-18 14:32:07.568
3142cabe-0722-46d0-85db-40d7d7adcbfb	permissions.manage	Manage permissions	\N	permissions	2026-10-17 19:38:07.377	2026-10-18 14:32:07.569
be392922-b6eb-43e6-8558-40c50c838299	support.manage	Manage support cases	\N	support	2026-10-17 19:12:56.973	2026-10-18 14:32:07.571
91c3f5bb-6764-4632-befd-a4bde1272e0a	support.read	Read support cases	\N	support	2026-10-17 19:12:56.973	2026-10-18 14:32:07.57
cc720d60-529a-460e-9007-732fbb0a0c4b	billing.read	Read billing	\N	billing	2026-10-17 19:12:56.975	2026-10-18 14:32:07.573
5b4a3bef-49ff-4ccf-bfec-f196a09f4901	support.impersonate	Impersonate tenant users	\N	support	2026-10-17 19:12:56.974	2026-10-18 14:32:07.572
c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	audit.read	Read audit logs	\N	audit	2026-10-17 19:12:56.976	2026-10-18 14:32:07.574
34595455-c374-49d0-8855-740faac83082	billing.manage	Manage billing	\N	billing	2026-10-17 19:12:56.975	2026-10-18 14:32:07.574
e43d1039-0b86-4ee5-a55f-f97eb23e6c71	enrollments.manage	Manage enrollments	\N	enrollments	2026-10-18 07:39:13.139	2026-10-18 14:32:07.61
8d3eba58-3e3c-4e93-bbe8-17b2beb06012	schools.suspend	Suspend schools	\N	schools	2026-10-17 19:12:56.961	2026-10-18 14:32:07.552
2b6addcf-52f9-4a36-9154-03be2215adfc	e2e.read.igkufpfl	E2E Read	\N	e2e	2026-10-18 06:52:31.002	2026-10-18 06:52:31.002
f9afe6a6-3a0b-453e-96f5-6ea149c9b946	e2e.read.ayiweehc	E2E Read	\N	e2e	2026-10-18 06:52:35.314	2026-10-18 06:52:35.314
bc4082b5-ce7d-418f-9f37-ce27caa4e5c5	e2e.read.xfblzvle	E2E Read	\N	e2e	2026-10-18 06:52:40.649	2026-10-18 06:52:40.649
3fb00a7a-4bcd-4213-93fd-a326005bf182	e2e.read.ujasgeve	E2E Read	\N	e2e	2026-10-18 06:52:44.94	2026-10-18 06:52:44.94
6ecbdb76-f34b-4299-82d4-870bedc6bdff	e2e.read.ngzuhzwe	E2E Read	\N	e2e	2026-10-18 06:52:49.003	2026-10-18 06:52:49.003
02666702-346e-4aeb-902e-e8c31143c917	fee_payments.read	Read fee payments	\N	billing	2026-10-18 08:03:24.378	2026-10-18 14:32:07.585
08adfec1-a1f1-43fb-9eb0-f8a2806493de	fee_payments.manage	Manage fee payments	\N	billing	2026-10-18 08:03:24.378	2026-10-18 14:32:07.585
0cbe04f8-3224-4557-8753-3ed1a2d36935	credit_notes.read	Read credit notes	\N	billing	2026-10-18 08:03:24.379	2026-10-18 14:32:07.586
e5ee1294-377e-435e-b5d9-ff2f7795428c	credit_notes.manage	Manage credit notes	\N	billing	2026-10-18 08:03:24.379	2026-10-18 14:32:07.587
bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	schools.read	Read schools	\N	schools	2026-10-17 19:12:56.929	2026-10-18 14:32:07.499
c2620c95-5ec5-4633-851d-b8942dc782b8	scholarships.read	Read scholarships	\N	scholarships	2026-10-18 07:59:53.994	2026-10-18 14:32:07.587
006f0ff8-a3c6-4a08-bd9c-4f8f62560bb3	scholarships.manage	Manage scholarships	\N	scholarships	2026-10-18 07:59:53.995	2026-10-18 14:32:07.588
e40dbe18-8734-408f-b0e6-37f204673138	grading_scales.read	Read grading scales	\N	academic	2026-10-18 07:48:15.893	2026-10-18 14:32:07.588
7a2497fa-4027-49f4-840a-daee57a473d1	grading_scales.manage	Manage grading scales	\N	academic	2026-10-18 07:48:15.894	2026-10-18 14:32:07.589
82ab5181-7eba-4c06-bf6e-e4e95c5c4c6e	notifications.read	Read notifications	\N	notifications	2026-10-18 14:30:26.273	2026-10-18 14:32:07.596
5b9ba827-2fc9-4416-8006-fa006790e443	notifications.manage	Manage notifications	\N	notifications	2026-10-18 14:30:26.276	2026-10-18 14:32:07.597
7bdd6ed8-1276-4756-9888-126db150d520	transport.read	Read transport	\N	transport	2026-10-18 08:23:51.337	2026-10-18 14:32:07.602
c6037b66-702f-49c0-9559-02fae1d970b5	transport.manage	Manage transport	\N	transport	2026-10-18 08:23:51.338	2026-10-18 14:32:07.603
3b09f467-abf6-41e4-a98d-90187d209b71	hostel.read	Read hostel	\N	hostel	2026-10-18 08:39:01.843	2026-10-18 14:32:07.599
67b022ea-650f-4986-ae84-cb8d9aba50fd	hr.read	Read HR data	\N	hr	2026-10-18 08:10:18.185	2026-10-18 14:32:07.604
c70ff1f4-7ad6-4e63-afe0-83a0b6e80c5c	hr.manage	Manage HR data	\N	hr	2026-10-18 08:10:18.186	2026-10-18 14:32:07.604
f1b2c0b7-01ff-43d0-ad79-ca5bbc245371	subjects.read	Read subjects	\N	academic	2026-10-18 06:59:43.832	2026-10-18 14:32:07.605
7d862f73-6d9e-4e1e-8b6a-19b1f6710fa0	subjects.manage	Manage subjects	\N	academic	2026-10-18 06:59:43.833	2026-10-18 14:32:07.605
f5848da9-d72a-4652-9c99-892c9dbdbebb	grade_subjects.read	Read grade subjects	\N	academic	2026-10-18 06:59:43.834	2026-10-18 14:32:07.606
f80072c7-89c9-4e71-bc7b-6a1c53c0bd02	grade_subjects.manage	Manage grade subjects	\N	academic	2026-10-18 06:59:43.834	2026-10-18 14:32:07.606
16f6413c-212f-4b8b-8751-aa61da13727f	students.read	Read students	\N	students	2026-10-18 07:26:13.27	2026-10-18 14:32:07.607
4b12a40a-ecb9-4cf2-81fe-6f09591d945a	students.manage	Manage students	\N	students	2026-10-18 07:26:13.271	2026-10-18 14:32:07.607
9fb1c5ce-c535-42c6-8748-ff170b55e0a8	transfer_certificates.manage	Manage transfer certificates	\N	certificates	2026-10-18 07:42:01.004	2026-10-18 14:32:07.609
218f561f-bfba-4e73-a9d4-e1cb6d5b2a2d	guardians.read	Read guardians	\N	guardians	2026-10-18 07:26:13.271	2026-10-18 14:32:07.611
3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	academic_calendar.read	Read academic calendar	\N	academic	2026-10-18 08:15:35.496	2026-10-18 14:32:07.58
414d4653-48f4-4c36-8d4f-399018bb04c5	academic_calendar.manage	Manage academic calendar	\N	academic	2026-10-18 08:15:35.497	2026-10-18 14:32:07.581
044699e5-8950-481d-8498-3cebe24643e9	guardians.manage	Manage guardians	\N	guardians	2026-10-18 07:26:13.272	2026-10-18 14:32:07.611
914abdcd-ae6f-4834-abb6-78890442f3f6	addresses.read	Read addresses	\N	addresses	2026-10-18 07:26:13.272	2026-10-18 14:32:07.612
936caf9e-57bb-427d-9cec-9692d979ec14	exams.read	Read exams	\N	exams	2026-10-18 07:53:41.562	2026-10-18 14:32:07.582
f7230a4c-e7a5-4e64-a11c-01aa5c3c05a8	exams.manage	Manage exams	\N	exams	2026-10-18 07:53:41.564	2026-10-18 14:32:07.582
053254be-1881-4160-8dd1-a676d5f82bef	addresses.manage	Manage addresses	\N	addresses	2026-10-18 07:26:13.273	2026-10-18 14:32:07.612
34fb8bc4-4ec5-4a5b-88bf-d6dee959c316	fees.manage	Manage fees	\N	fees	2026-10-18 07:59:53.994	2026-10-18 14:32:07.583
d5b37ee7-948f-43eb-aa3c-a80abb84642b	fee_invoices.read	Read fee invoices	\N	billing	2026-10-18 08:03:24.377	2026-10-18 14:32:07.584
b309d981-39c2-49f8-894c-b90d74e0858f	hostel.manage	Manage hostel	\N	hostel	2026-10-18 08:39:01.843	2026-10-18 14:32:07.6
4faee74f-a64e-4ac1-a229-e3f66e47a48a	fee_invoices.manage	Manage fee invoices	\N	billing	2026-10-18 08:03:24.377	2026-10-18 14:32:07.584
81fe47e4-e9f7-40e5-8da2-3f5aaad9e603	library.read	Read library	\N	library	2026-10-18 08:28:39.661	2026-10-18 14:32:07.601
c3423766-ddcb-4b54-8896-3a52baa476e1	library.manage	Manage library	\N	library	2026-10-18 08:28:39.662	2026-10-18 14:32:07.602
\.


--
-- Data for Name: PlatformRole; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformRole" (id, name, description, "isSystem", "createdAt", "updatedAt", "deletedAt") FROM stdin;
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	Support Engineer	Handles support cases and can impersonate tenant users.	t	2026-10-17 19:12:56.998	2026-10-18 14:32:07.649	\N
45be0e93-3c29-436a-9fad-04d2fb2bebf7	Billing Admin	Manages billing and subscriptions.	t	2026-10-17 19:12:57	2026-10-18 14:32:07.652	\N
cef413dc-b45f-4e56-9096-3de122ca7136	Smoke Role 1792304548	\N	f	2026-10-18 06:22:28.615	2026-10-18 06:22:28.615	\N
b0c81a07-a173-4c0a-a615-9edb49d4da09	E2E Role 1792310184995	\N	f	2026-10-18 07:56:25.476	2026-10-18 07:56:25.573	2026-10-18 07:56:25.573
d06a46d7-223c-4cd6-95d4-0b43063d0910	E2E Role 1792310694386	\N	f	2026-10-18 08:04:54.858	2026-10-18 08:04:54.958	2026-10-18 08:04:54.958
516b394e-c1ea-4c72-8510-621d85e34b58	Sales Partner	Onboards schools in an assigned region.	t	2026-10-17 19:12:57.002	2026-10-18 14:32:07.655	\N
b5b17afd-07e7-47dd-b977-81c7d90c01ee	E2E Role 1792310698483	\N	f	2026-10-18 08:04:58.963	2026-10-18 08:04:59.064	2026-10-18 08:04:59.064
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	Auditor	Read-only access to platform data.	t	2026-10-17 19:12:57.003	2026-10-18 14:32:07.658	\N
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	Platform Admin	Manages schools, subscriptions and platform users.	t	2026-10-17 19:12:56.994	2026-10-18 14:32:07.639	\N
da1e4863-3783-4a67-91bf-3880941072fa	test	test	t	2026-10-19 19:22:08.77	2026-10-19 19:23:10.595	\N
c060dd1e-2825-4d5d-adcb-5f72a1fc5238	E2E Role 1792264650967	\N	f	2026-10-17 19:17:31.185	2026-10-17 19:17:31.185	\N
2b85825e-9b44-4669-9d28-17965a22e3c5	E2E Role 1792306350567	\N	f	2026-10-18 06:52:31.045	2026-10-18 06:52:31.143	2026-10-18 06:52:31.142
5f8c3970-19fb-4c33-aa4a-03aa7b6c3b02	Audit Test Role	\N	f	2026-10-20 10:40:46.134	2026-10-20 10:40:46.134	\N
a53f9072-632b-4eb9-98ff-3c8342c2728c	E2E Role 1792306354913	\N	f	2026-10-18 06:52:35.352	2026-10-18 06:52:35.446	2026-10-18 06:52:35.446
86b026d8-60af-4409-9667-de5b14c9d31c	E2E Role 1792306360249	\N	f	2026-10-18 06:52:40.679	2026-10-18 06:52:40.769	2026-10-18 06:52:40.768
05aa903f-c676-46af-b695-d563eb680449	E2E Role 1792306364532	\N	f	2026-10-18 06:52:44.976	2026-10-18 06:52:45.066	2026-10-18 06:52:45.066
c6ff50b3-afbb-49b9-bef6-1ee4f6c75a6e	E2E Role 1792306368606	\N	f	2026-10-18 06:52:49.042	2026-10-18 06:52:49.133	2026-10-18 06:52:49.133
e6ba163a-b642-47cf-9006-8033024c7cc6	E2E Role 1792306377813	\N	f	2026-10-18 06:52:58.246	2026-10-18 06:52:58.344	2026-10-18 06:52:58.343
e4bfdfb9-076f-43d9-9b7c-525df523b1c9	E2E Role 1792306828749	\N	f	2026-10-18 07:00:29.244	2026-10-18 07:00:29.354	2026-10-18 07:00:29.354
6ed850dc-fac9-4b6c-95e2-db2c7dae2970	E2E Role 1792306833916	\N	f	2026-10-18 07:00:34.702	2026-10-18 07:00:34.864	2026-10-18 07:00:34.864
68dab0e2-2d78-44cc-beb1-dd52df3086ce	E2E Role 1792306839143	\N	f	2026-10-18 07:00:39.575	2026-10-18 07:00:39.681	2026-10-18 07:00:39.68
238fe057-6cc0-4953-9ff3-5e8276018a4c	E2E Role 1792309740899	\N	f	2026-10-18 07:49:01.368	2026-10-18 07:49:01.471	2026-10-18 07:49:01.471
777b8e65-1719-4e9f-bb93-27d412f4b583	E2E Role 1792309224243	\N	f	2026-10-18 07:40:24.723	2026-10-18 07:40:24.828	2026-10-18 07:40:24.828
35bc1956-4a49-4134-906f-de707d99a3cd	E2E Role 1792309229003	\N	f	2026-10-18 07:40:29.461	2026-10-18 07:40:29.56	2026-10-18 07:40:29.559
8c2c63bf-e539-4c31-80d9-ab741b8f6f7c	E2E Role 1792309233390	\N	f	2026-10-18 07:40:33.826	2026-10-18 07:40:33.919	2026-10-18 07:40:33.919
6cfadc30-8202-48d3-b160-d9722b8a61c6	E2E Role 1792309745268	\N	f	2026-10-18 07:49:05.89	2026-10-18 07:49:06.038	2026-10-18 07:49:06.038
21047eff-3799-404c-aee3-88bd3a650e03	E2E Role 1792309749994	\N	f	2026-10-18 07:49:10.481	2026-10-18 07:49:10.605	2026-10-18 07:49:10.605
905ca1b8-d8bf-4395-ad8a-99d80b5f0e7b	E2E Role 1792310702873	\N	f	2026-10-18 08:05:03.344	2026-10-18 08:05:03.442	2026-10-18 08:05:03.442
a4ff1fcc-4af0-4ff5-9d4c-470607f473d0	E2E Role 1792308452614	\N	f	2026-10-18 07:27:33.227	2026-10-18 07:27:33.35	2026-10-18 07:27:33.35
4b6a6797-00bc-413c-bf4e-317f80f62999	E2E Role 1792308456880	\N	f	2026-10-18 07:27:37.328	2026-10-18 07:27:37.426	2026-10-18 07:27:37.425
fc70b716-f959-4baa-b7a2-bce96f830751	E2E Role 1792306613282	\N	f	2026-10-18 06:56:53.74	2026-10-18 06:56:53.834	2026-10-18 06:56:53.834
2e020dc0-5193-47dc-b2ce-f759e1772807	E2E Role 1792306617748	\N	f	2026-10-18 06:56:58.181	2026-10-18 06:56:58.277	2026-10-18 06:56:58.277
2201174d-c67e-4ae0-ba48-ffa3316f719e	E2E Role 1792306621421	\N	f	2026-10-18 06:57:01.858	2026-10-18 06:57:01.952	2026-10-18 06:57:01.952
0946a242-f5b9-4698-aed4-b25d4157b9fd	E2E Role 1792310749630	\N	f	2026-10-18 08:05:50.112	2026-10-18 08:05:50.216	2026-10-18 08:05:50.215
ef1d35e4-d364-47fc-b25d-4869eb027c25	E2E Role 1792309353067	\N	f	2026-10-18 07:42:33.53	2026-10-18 07:42:33.632	2026-10-18 07:42:33.631
c00d8fbc-6314-43e0-92fe-9d18363e4ef0	E2E Role 1792309357637	\N	f	2026-10-18 07:42:38.098	2026-10-18 07:42:38.196	2026-10-18 07:42:38.195
4e750e86-75c3-4ef4-b255-94c68f40b9b1	E2E Role 1792308461128	\N	f	2026-10-18 07:27:41.631	2026-10-18 07:27:41.747	2026-10-18 07:27:41.747
97128eac-89c7-4e9d-bc8d-ba1cc145a37b	E2E Role 1792308844456	\N	f	2026-10-18 07:34:04.913	2026-10-18 07:34:05.015	2026-10-18 07:34:05.015
1516d4e4-9397-4d42-b643-cd23c2e5b924	E2E Role 1792308848932	\N	f	2026-10-18 07:34:09.375	2026-10-18 07:34:09.473	2026-10-18 07:34:09.472
6e45bccf-ee86-4c43-9445-059509f62429	E2E Role 1792308853006	\N	f	2026-10-18 07:34:13.452	2026-10-18 07:34:13.549	2026-10-18 07:34:13.549
69a16273-b6e2-4fb9-8b47-3477f7df7960	E2E Role 1792310117458	\N	f	2026-10-18 07:55:17.914	2026-10-18 07:55:18.011	2026-10-18 07:55:18.01
6eaaa4c8-9230-4d27-b29d-4342b91839f9	E2E Role 1792309362104	\N	f	2026-10-18 07:42:42.581	2026-10-18 07:42:42.679	2026-10-18 07:42:42.679
87be325c-3370-4a80-a204-33ff71534270	E2E Role 1792310753709	\N	f	2026-10-18 08:05:54.2	2026-10-18 08:05:54.3	2026-10-18 08:05:54.299
87a2ba67-4e34-416e-9baf-40e0b90749bf	E2E Role 1792310474981	\N	f	2026-10-18 08:01:15.67	2026-10-18 08:01:15.781	2026-10-18 08:01:15.78
29ef2dbe-3dbc-4b12-bbd3-84a203563094	E2E Role 1792310479949	\N	f	2026-10-18 08:01:20.642	2026-10-18 08:01:20.778	2026-10-18 08:01:20.778
e3a38624-6e0d-41ad-84e3-d887d6009382	E2E Role 1792310121552	\N	f	2026-10-18 07:55:22	2026-10-18 07:55:22.096	2026-10-18 07:55:22.095
7ea300ea-e795-4ece-a928-1a094e9e09b8	E2E Role 1792310126334	\N	f	2026-10-18 07:55:26.783	2026-10-18 07:55:26.881	2026-10-18 07:55:26.881
9510f6c2-d0ef-430d-b5f8-8fb5652a3701	E2E Role 1792310147670	\N	f	2026-10-18 07:55:48.154	2026-10-18 07:55:48.252	2026-10-18 07:55:48.251
8fb3cc98-1649-44d6-9cfc-db11bb5b4ca9	E2E Role 1792310181054	\N	f	2026-10-18 07:56:21.568	2026-10-18 07:56:21.666	2026-10-18 07:56:21.666
cad10a73-8ee7-48ba-ad16-332f80053aa6	E2E Role 1792310484373	\N	f	2026-10-18 08:01:24.813	2026-10-18 08:01:24.908	2026-10-18 08:01:24.908
ab03cfdb-a530-4da1-a257-cd2f0763b869	E2E Role 1792310520322	\N	f	2026-10-18 08:02:00.79	2026-10-18 08:02:00.887	2026-10-18 08:02:00.887
286db9fe-b05c-46ce-a9fa-dd3c150a6927	E2E Role 1792310525557	\N	f	2026-10-18 08:02:06.055	2026-10-18 08:02:06.152	2026-10-18 08:02:06.152
382a66a0-67c8-45ba-828a-8a94127c1305	E2E Role 1792310529604	\N	f	2026-10-18 08:02:10.09	2026-10-18 08:02:10.187	2026-10-18 08:02:10.186
305e336d-263d-489e-8fc1-0ded705d7ee1	E2E Role 1792310758831	\N	f	2026-10-18 08:05:59.368	2026-10-18 08:05:59.478	2026-10-18 08:05:59.477
e0092b5d-0883-4023-8842-71a631184632	E2E Role 1792311083812	\N	f	2026-10-18 08:11:24.319	2026-10-18 08:11:24.419	2026-10-18 08:11:24.419
b1aa36f0-bf3d-4ed3-987c-390f70c54d3c	E2E Role 1792311088379	\N	f	2026-10-18 08:11:28.846	2026-10-18 08:11:28.951	2026-10-18 08:11:28.951
1e6bf3e5-3737-4817-9ab9-aa958d354a8c	E2E Role 1792310939912	\N	f	2026-10-18 08:09:00.454	2026-10-18 08:09:00.565	2026-10-18 08:09:00.565
21d3231b-315a-4c0a-82f3-88e6f3e425c1	E2E Role 1792310944659	\N	f	2026-10-18 08:09:05.195	2026-10-18 08:09:05.306	2026-10-18 08:09:05.305
161b3329-98e0-4c95-bfbf-3c36c3f81c00	E2E Role 1792310949740	\N	f	2026-10-18 08:09:10.301	2026-10-18 08:09:10.41	2026-10-18 08:09:10.409
92f08e96-ab60-4c76-b785-bb6903c773cf	E2E Role 1792311092796	\N	f	2026-10-18 08:11:33.278	2026-10-18 08:11:33.379	2026-10-18 08:11:33.379
a9c0fd84-5f04-47fe-a20a-5b17301327af	E2E Role 1792311117510	\N	f	2026-10-18 08:11:58.009	2026-10-18 08:11:58.108	2026-10-18 08:11:58.108
23b53d07-7746-4048-b25f-94d4bf9346dc	E2E Role 1792311121983	\N	f	2026-10-18 08:12:02.476	2026-10-18 08:12:02.576	2026-10-18 08:12:02.576
a74e7344-a8bf-4dfc-90de-310b74b1337b	E2E Role 1792311126042	\N	f	2026-10-18 08:12:06.544	2026-10-18 08:12:06.655	2026-10-18 08:12:06.655
0cbd7980-abb5-483a-afca-cfda4cb2ae35	E2E Role 1792311179119	\N	f	2026-10-18 08:12:59.634	2026-10-18 08:12:59.735	2026-10-18 08:12:59.735
b4d775ff-1177-428e-9b09-7f18ebd05f8d	E2E Role 1792311183970	\N	f	2026-10-18 08:13:04.488	2026-10-18 08:13:04.587	2026-10-18 08:13:04.586
9584fd40-0b3d-498f-beea-80c318020e20	E2E Role 1792311190278	\N	f	2026-10-18 08:13:10.773	2026-10-18 08:13:10.871	2026-10-18 08:13:10.87
4ae5d00b-1a0a-4225-a9ee-bf0f6ff7d85c	E2E Role 1792311231123	\N	f	2026-10-18 08:13:51.591	2026-10-18 08:13:51.695	2026-10-18 08:13:51.694
2f7c72a7-4319-4a36-b5c7-845b043935e8	E2E Role 1792311362710	\N	f	2026-10-18 08:16:03.227	2026-10-18 08:16:03.328	2026-10-18 08:16:03.328
0af577c2-01be-45eb-a91f-037d3f367416	E2E Role 1792311383152	\N	f	2026-10-18 08:16:23.661	2026-10-18 08:16:23.764	2026-10-18 08:16:23.763
da61b972-e3cc-4051-9963-b77013827e54	E2E Role 1792311919359	\N	f	2026-10-18 08:25:19.853	2026-10-18 08:25:19.955	2026-10-18 08:25:19.955
0a438ded-e142-40e8-9640-812c210de94c	E2E Role 1792311967235	\N	f	2026-10-18 08:26:07.866	2026-10-18 08:26:07.974	2026-10-18 08:26:07.973
2b50eee7-e637-4453-a43c-f016b73f9e38	E2E Role 1792312268746	\N	f	2026-10-18 08:31:09.238	2026-10-18 08:31:09.339	2026-10-18 08:31:09.339
30f30b85-7de2-4816-86de-38fed3ee61e3	E2E Role 1792312322701	\N	f	2026-10-18 08:32:03.201	2026-10-18 08:32:03.301	2026-10-18 08:32:03.301
b2ea4eb1-5a8b-40fd-a663-67563fabd574	E2E Role 1792312519891	\N	f	2026-10-18 08:35:20.382	2026-10-18 08:35:20.496	2026-10-18 08:35:20.496
23f8612b-088a-4207-8f26-2811fad9d3d9	E2E Role 1792312688649	\N	f	2026-10-18 08:38:09.284	2026-10-18 08:38:09.431	2026-10-18 08:38:09.43
b6b4d7bd-f45b-431a-82b2-6dcbce51d3e9	E2E Role 1792312823044	\N	f	2026-10-18 08:40:23.579	2026-10-18 08:40:23.685	2026-10-18 08:40:23.684
129aa0b0-934e-435e-a644-24e69c247d71	E2E Role 1792312938806	\N	f	2026-10-18 08:42:19.394	2026-10-18 08:42:19.544	2026-10-18 08:42:19.544
f5395cda-24b9-48bb-a0ad-56d656f9cd98	E2E Role 1792313030703	\N	f	2026-10-18 08:43:51.256	2026-10-18 08:43:51.376	2026-10-18 08:43:51.376
230fbc52-c388-405d-8555-55cd38588c20	E2E Role 1792333875850	\N	f	2026-10-18 14:31:16.367	2026-10-18 14:31:16.505	2026-10-18 14:31:16.504
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	Super Admin	Full access to the platform.	t	2026-10-17 19:12:56.983	2026-10-18 14:32:07.623	\N
729e1a43-f983-4a40-a6c5-bd3f6eaa79bb	E2E Role 1792333939806	\N	f	2026-10-18 14:32:20.307	2026-10-18 14:32:20.416	2026-10-18 14:32:20.415
87722514-377e-4cc5-bb32-f140ab2f5719	E2E Role 1792503298912	\N	f	2026-10-20 13:34:59.421	2026-10-20 13:34:59.576	2026-10-20 13:34:59.575
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	pwned-by-tenant	created by a TENANT token	f	2026-11-14 07:22:58.651	2026-11-14 07:23:52.341	2026-11-14 07:23:52.34
\.


--
-- Data for Name: PlatformRolePermission; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformRolePermission" ("roleId", "permissionId", "grantedAt") FROM stdin;
2b85825e-9b44-4669-9d28-17965a22e3c5	2b6addcf-52f9-4a36-9154-03be2215adfc	2026-10-18 06:52:31.045
86b026d8-60af-4409-9667-de5b14c9d31c	bc4082b5-ce7d-418f-9f37-ce27caa4e5c5	2026-10-18 06:52:40.679
c6ff50b3-afbb-49b9-bef6-1ee4f6c75a6e	6ecbdb76-f34b-4299-82d4-870bedc6bdff	2026-10-18 06:52:49.042
da1e4863-3783-4a67-91bf-3880941072fa	73076806-454a-41ec-9cf2-37bb8019ea65	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	a8845bcf-629a-43e9-9af4-dbddae5a8c95	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c2793824-3d39-40bc-827d-c730094b2e4d	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3559a8ed-b637-408b-bb54-3d7c558932e1	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	cda8a69e-e102-4e6b-a687-cb655a193175	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	1c8307a1-bc9f-4803-818d-a1a14a28d552	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	950ced72-59a2-4fcf-b228-b33d3a5cbf21	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	e2a25cd4-7a4c-452c-90ba-ea8ead75cc6c	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8d625fe0-7611-4a16-95d5-278ca83e1262	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	ff442ab0-f7db-4178-ae50-a6c14dd8fc59	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	d7a12269-65bf-41ac-a026-df99a09dde93	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	29874dfc-36bf-4e0b-b16e-fe1d958f43cd	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	12115f8e-0996-40c3-a94b-f384dd3ec48d	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	9b26acc8-d674-4aad-ae31-882f082d88c3	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8305e0db-8b5e-48a3-80d3-82cc6e8be2a6	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	9929c191-d059-4f6e-8c9c-327a4a1fb508	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	0f1e01ea-5d04-49ad-8cbf-e26abdb0a55c	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	7cb014f2-efce-4f21-9eda-fb0160b44e41	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	435512cd-09a8-43dd-8d75-3dbfc99e8a8c	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	4b030bf2-d640-45e9-b29d-43fa4b58fdc1	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	5d55295e-21a2-4bd9-995e-16cf083de6b6	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c41c194a-32af-4c34-b308-4c094bab246c	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8fec6b08-480b-4c4b-afdf-a113b0b29c70	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	4fd3db70-191c-4389-a013-7023e8f31290	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8f6adc5a-8649-433f-8cce-0f95746954b7	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f9c73374-4917-4132-aff4-0e67fb0acea0	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	6a39d3a1-698b-428c-b632-1a4ee6237e28	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3fda8144-59f4-41dc-9597-ce0a5daf4914	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	7dd9a5d0-2a45-4177-8099-52d899ee5749	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	2cc3ad50-b644-4c17-b972-fabf9a82f553	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	47f23ee8-dc9b-42fe-b8e1-84ae0d4e8e0e	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3e7ebfed-9698-4efc-89d1-083d7e0cc06e	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8469f007-8e3f-4f51-b3ce-e574f4ad8b0a	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3a85382f-bdf3-4b51-83b9-6acbde76b7d6	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	9117f8d6-523d-40f3-893c-86fde22cc0c0	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	a4ffa51c-5289-4731-b23a-e61b7f186f59	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	630b18aa-56d7-48ed-8571-d2679e4969e6	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	47880d9f-b0be-4683-b464-fc79d6249425	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8a08588d-a17f-444c-91b2-a776447a0af5	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	465f4f32-a692-4bed-ab19-97e196ec7193	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	d2c66917-16f3-49b4-93a3-a8a5b88dd9dc	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	17ea1296-3c16-4449-ae2c-3577add8a542	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	49293a8e-0c9f-4b41-adb3-10b60695a382	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	bb14074b-64fb-4a65-b762-c7db2b370ebc	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	323da819-cb5f-401f-bd0b-ec9fe416b282	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	149e9169-2d69-4975-a2cf-335ea2183b32	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3142cabe-0722-46d0-85db-40d7d7adcbfb	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	be392922-b6eb-43e6-8558-40c50c838299	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	91c3f5bb-6764-4632-befd-a4bde1272e0a	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	cc720d60-529a-460e-9007-732fbb0a0c4b	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	5b4a3bef-49ff-4ccf-bfec-f196a09f4901	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	34595455-c374-49d0-8855-740faac83082	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	e43d1039-0b86-4ee5-a55f-f97eb23e6c71	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	8d3eba58-3e3c-4e93-bbe8-17b2beb06012	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	2b6addcf-52f9-4a36-9154-03be2215adfc	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f9afe6a6-3a0b-453e-96f5-6ea149c9b946	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	bc4082b5-ce7d-418f-9f37-ce27caa4e5c5	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3fb00a7a-4bcd-4213-93fd-a326005bf182	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	6ecbdb76-f34b-4299-82d4-870bedc6bdff	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	02666702-346e-4aeb-902e-e8c31143c917	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	08adfec1-a1f1-43fb-9eb0-f8a2806493de	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	0cbe04f8-3224-4557-8753-3ed1a2d36935	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	e5ee1294-377e-435e-b5d9-ff2f7795428c	2026-10-19 19:23:10.646
c060dd1e-2825-4d5d-adcb-5f72a1fc5238	47f23ee8-dc9b-42fe-b8e1-84ae0d4e8e0e	2026-10-17 19:17:31.185
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	9117f8d6-523d-40f3-893c-86fde22cc0c0	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	a4ffa51c-5289-4731-b23a-e61b7f186f59	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	8d3eba58-3e3c-4e93-bbe8-17b2beb06012	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	630b18aa-56d7-48ed-8571-d2679e4969e6	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	465f4f32-a692-4bed-ab19-97e196ec7193	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	d2c66917-16f3-49b4-93a3-a8a5b88dd9dc	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	17ea1296-3c16-4449-ae2c-3577add8a542	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	49293a8e-0c9f-4b41-adb3-10b60695a382	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	73076806-454a-41ec-9cf2-37bb8019ea65	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c2793824-3d39-40bc-827d-c730094b2e4d	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	bb14074b-64fb-4a65-b762-c7db2b370ebc	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	323da819-cb5f-401f-bd0b-ec9fe416b282	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	149e9169-2d69-4975-a2cf-335ea2183b32	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3142cabe-0722-46d0-85db-40d7d7adcbfb	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	91c3f5bb-6764-4632-befd-a4bde1272e0a	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	be392922-b6eb-43e6-8558-40c50c838299	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	5b4a3bef-49ff-4ccf-bfec-f196a09f4901	2026-10-18 14:32:07.632
cef413dc-b45f-4e56-9096-3de122ca7136	8a08588d-a17f-444c-91b2-a776447a0af5	2026-10-18 06:22:28.615
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	cc720d60-529a-460e-9007-732fbb0a0c4b	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	34595455-c374-49d0-8855-740faac83082	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3559a8ed-b637-408b-bb54-3d7c558932e1	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	cda8a69e-e102-4e6b-a687-cb655a193175	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	950ced72-59a2-4fcf-b228-b33d3a5cbf21	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	e2a25cd4-7a4c-452c-90ba-ea8ead75cc6c	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	ff442ab0-f7db-4178-ae50-a6c14dd8fc59	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	29874dfc-36bf-4e0b-b16e-fe1d958f43cd	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	9b26acc8-d674-4aad-ae31-882f082d88c3	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	9929c191-d059-4f6e-8c9c-327a4a1fb508	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	7cb014f2-efce-4f21-9eda-fb0160b44e41	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	4b030bf2-d640-45e9-b29d-43fa4b58fdc1	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	414d4653-48f4-4c36-8d4f-399018bb04c5	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	936caf9e-57bb-427d-9cec-9692d979ec14	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	f7230a4c-e7a5-4e64-a11c-01aa5c3c05a8	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c41c194a-32af-4c34-b308-4c094bab246c	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	34fb8bc4-4ec5-4a5b-88bf-d6dee959c316	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	d5b37ee7-948f-43eb-aa3c-a80abb84642b	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	4faee74f-a64e-4ac1-a229-e3f66e47a48a	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	02666702-346e-4aeb-902e-e8c31143c917	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	08adfec1-a1f1-43fb-9eb0-f8a2806493de	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	0cbe04f8-3224-4557-8753-3ed1a2d36935	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	e5ee1294-377e-435e-b5d9-ff2f7795428c	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c2620c95-5ec5-4633-851d-b8942dc782b8	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	006f0ff8-a3c6-4a08-bd9c-4f8f62560bb3	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	e40dbe18-8734-408f-b0e6-37f204673138	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	7a2497fa-4027-49f4-840a-daee57a473d1	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	4fd3db70-191c-4389-a013-7023e8f31290	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	8f6adc5a-8649-433f-8cce-0f95746954b7	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	f9c73374-4917-4132-aff4-0e67fb0acea0	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	6a39d3a1-698b-428c-b632-1a4ee6237e28	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3fda8144-59f4-41dc-9597-ce0a5daf4914	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	7dd9a5d0-2a45-4177-8099-52d899ee5749	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	2cc3ad50-b644-4c17-b972-fabf9a82f553	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3e7ebfed-9698-4efc-89d1-083d7e0cc06e	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	82ab5181-7eba-4c06-bf6e-e4e95c5c4c6e	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	5b9ba827-2fc9-4416-8006-fa006790e443	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3b09f467-abf6-41e4-a98d-90187d209b71	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	b309d981-39c2-49f8-894c-b90d74e0858f	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	81fe47e4-e9f7-40e5-8da2-3f5aaad9e603	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c3423766-ddcb-4b54-8896-3a52baa476e1	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	7bdd6ed8-1276-4756-9888-126db150d520	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c6037b66-702f-49c0-9559-02fae1d970b5	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	67b022ea-650f-4986-ae84-cb8d9aba50fd	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	c70ff1f4-7ad6-4e63-afe0-83a0b6e80c5c	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	f1b2c0b7-01ff-43d0-ad79-ca5bbc245371	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	7d862f73-6d9e-4e1e-8b6a-19b1f6710fa0	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	f5848da9-d72a-4652-9c99-892c9dbdbebb	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	f80072c7-89c9-4e71-bc7b-6a1c53c0bd02	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	16f6413c-212f-4b8b-8751-aa61da13727f	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	4b12a40a-ecb9-4cf2-81fe-6f09591d945a	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	8469f007-8e3f-4f51-b3ce-e574f4ad8b0a	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	9fb1c5ce-c535-42c6-8748-ff170b55e0a8	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	3a85382f-bdf3-4b51-83b9-6acbde76b7d6	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	e43d1039-0b86-4ee5-a55f-f97eb23e6c71	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	218f561f-bfba-4e73-a9d4-e1cb6d5b2a2d	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	044699e5-8950-481d-8498-3cebe24643e9	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	914abdcd-ae6f-4834-abb6-78890442f3f6	2026-10-18 14:32:07.632
d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	053254be-1881-4160-8dd1-a676d5f82bef	2026-10-18 14:32:07.632
a53f9072-632b-4eb9-98ff-3c8342c2728c	f9afe6a6-3a0b-453e-96f5-6ea149c9b946	2026-10-18 06:52:35.352
05aa903f-c676-46af-b695-d563eb680449	3fb00a7a-4bcd-4213-93fd-a326005bf182	2026-10-18 06:52:44.976
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-10-18 14:32:07.65
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	91c3f5bb-6764-4632-befd-a4bde1272e0a	2026-10-18 14:32:07.65
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	be392922-b6eb-43e6-8558-40c50c838299	2026-10-18 14:32:07.65
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	5b4a3bef-49ff-4ccf-bfec-f196a09f4901	2026-10-18 14:32:07.65
b11ab225-c11b-46a7-9d43-2fa3fbec4f70	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-10-18 14:32:07.65
45be0e93-3c29-436a-9fad-04d2fb2bebf7	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-10-18 14:32:07.653
45be0e93-3c29-436a-9fad-04d2fb2bebf7	465f4f32-a692-4bed-ab19-97e196ec7193	2026-10-18 14:32:07.653
45be0e93-3c29-436a-9fad-04d2fb2bebf7	d2c66917-16f3-49b4-93a3-a8a5b88dd9dc	2026-10-18 14:32:07.653
45be0e93-3c29-436a-9fad-04d2fb2bebf7	cc720d60-529a-460e-9007-732fbb0a0c4b	2026-10-18 14:32:07.653
45be0e93-3c29-436a-9fad-04d2fb2bebf7	34595455-c374-49d0-8855-740faac83082	2026-10-18 14:32:07.653
45be0e93-3c29-436a-9fad-04d2fb2bebf7	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-10-18 14:32:07.653
516b394e-c1ea-4c72-8510-621d85e34b58	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-10-18 14:32:07.656
516b394e-c1ea-4c72-8510-621d85e34b58	9117f8d6-523d-40f3-893c-86fde22cc0c0	2026-10-18 14:32:07.656
516b394e-c1ea-4c72-8510-621d85e34b58	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-10-18 14:32:07.656
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	17ea1296-3c16-4449-ae2c-3577add8a542	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	bb14074b-64fb-4a65-b762-c7db2b370ebc	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	149e9169-2d69-4975-a2cf-335ea2183b32	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	91c3f5bb-6764-4632-befd-a4bde1272e0a	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	cc720d60-529a-460e-9007-732fbb0a0c4b	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	3559a8ed-b637-408b-bb54-3d7c558932e1	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	950ced72-59a2-4fcf-b228-b33d3a5cbf21	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	ff442ab0-f7db-4178-ae50-a6c14dd8fc59	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	9b26acc8-d674-4aad-ae31-882f082d88c3	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	7cb014f2-efce-4f21-9eda-fb0160b44e41	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	936caf9e-57bb-427d-9cec-9692d979ec14	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	c41c194a-32af-4c34-b308-4c094bab246c	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	d5b37ee7-948f-43eb-aa3c-a80abb84642b	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	02666702-346e-4aeb-902e-e8c31143c917	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	0cbe04f8-3224-4557-8753-3ed1a2d36935	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	c2620c95-5ec5-4633-851d-b8942dc782b8	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	e40dbe18-8734-408f-b0e6-37f204673138	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	4fd3db70-191c-4389-a013-7023e8f31290	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	f9c73374-4917-4132-aff4-0e67fb0acea0	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	3fda8144-59f4-41dc-9597-ce0a5daf4914	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	2cc3ad50-b644-4c17-b972-fabf9a82f553	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	82ab5181-7eba-4c06-bf6e-e4e95c5c4c6e	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	3b09f467-abf6-41e4-a98d-90187d209b71	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	81fe47e4-e9f7-40e5-8da2-3f5aaad9e603	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	7bdd6ed8-1276-4756-9888-126db150d520	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	67b022ea-650f-4986-ae84-cb8d9aba50fd	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	f1b2c0b7-01ff-43d0-ad79-ca5bbc245371	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	f5848da9-d72a-4652-9c99-892c9dbdbebb	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	16f6413c-212f-4b8b-8751-aa61da13727f	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	8469f007-8e3f-4f51-b3ce-e574f4ad8b0a	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	3a85382f-bdf3-4b51-83b9-6acbde76b7d6	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	218f561f-bfba-4e73-a9d4-e1cb6d5b2a2d	2026-10-18 14:32:07.66
fdc3e9d1-275d-4a9a-a7b0-630b3fef9e12	914abdcd-ae6f-4834-abb6-78890442f3f6	2026-10-18 14:32:07.66
da1e4863-3783-4a67-91bf-3880941072fa	3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	2026-10-19 19:22:08.77
da1e4863-3783-4a67-91bf-3880941072fa	414d4653-48f4-4c36-8d4f-399018bb04c5	2026-10-19 19:22:08.77
da1e4863-3783-4a67-91bf-3880941072fa	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c2620c95-5ec5-4633-851d-b8942dc782b8	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	006f0ff8-a3c6-4a08-bd9c-4f8f62560bb3	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	e40dbe18-8734-408f-b0e6-37f204673138	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	7a2497fa-4027-49f4-840a-daee57a473d1	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	82ab5181-7eba-4c06-bf6e-e4e95c5c4c6e	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	5b9ba827-2fc9-4416-8006-fa006790e443	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	7bdd6ed8-1276-4756-9888-126db150d520	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c6037b66-702f-49c0-9559-02fae1d970b5	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	3b09f467-abf6-41e4-a98d-90187d209b71	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	67b022ea-650f-4986-ae84-cb8d9aba50fd	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c70ff1f4-7ad6-4e63-afe0-83a0b6e80c5c	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f1b2c0b7-01ff-43d0-ad79-ca5bbc245371	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	7d862f73-6d9e-4e1e-8b6a-19b1f6710fa0	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f5848da9-d72a-4652-9c99-892c9dbdbebb	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f80072c7-89c9-4e71-bc7b-6a1c53c0bd02	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	16f6413c-212f-4b8b-8751-aa61da13727f	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	4b12a40a-ecb9-4cf2-81fe-6f09591d945a	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	9fb1c5ce-c535-42c6-8748-ff170b55e0a8	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	218f561f-bfba-4e73-a9d4-e1cb6d5b2a2d	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	044699e5-8950-481d-8498-3cebe24643e9	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	914abdcd-ae6f-4834-abb6-78890442f3f6	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	936caf9e-57bb-427d-9cec-9692d979ec14	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	f7230a4c-e7a5-4e64-a11c-01aa5c3c05a8	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	053254be-1881-4160-8dd1-a676d5f82bef	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	34fb8bc4-4ec5-4a5b-88bf-d6dee959c316	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	d5b37ee7-948f-43eb-aa3c-a80abb84642b	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	b309d981-39c2-49f8-894c-b90d74e0858f	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	4faee74f-a64e-4ac1-a229-e3f66e47a48a	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	81fe47e4-e9f7-40e5-8da2-3f5aaad9e603	2026-10-19 19:23:10.646
da1e4863-3783-4a67-91bf-3880941072fa	c3423766-ddcb-4b54-8896-3a52baa476e1	2026-10-19 19:23:10.646
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	73076806-454a-41ec-9cf2-37bb8019ea65	2026-11-14 07:23:10.182
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	ff442ab0-f7db-4178-ae50-a6c14dd8fc59	2026-11-14 07:23:10.182
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	29874dfc-36bf-4e0b-b16e-fe1d958f43cd	2026-11-14 07:23:10.182
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	49293a8e-0c9f-4b41-adb3-10b60695a382	2026-11-14 07:23:10.182
ad79e4c1-65d8-4a8f-ab56-a502466dd99a	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-11-14 07:23:10.182
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	73076806-454a-41ec-9cf2-37bb8019ea65	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	a8845bcf-629a-43e9-9af4-dbddae5a8c95	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c2793824-3d39-40bc-827d-c730094b2e4d	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3559a8ed-b637-408b-bb54-3d7c558932e1	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	cda8a69e-e102-4e6b-a687-cb655a193175	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	1c8307a1-bc9f-4803-818d-a1a14a28d552	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	950ced72-59a2-4fcf-b228-b33d3a5cbf21	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	e2a25cd4-7a4c-452c-90ba-ea8ead75cc6c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8d625fe0-7611-4a16-95d5-278ca83e1262	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	ff442ab0-f7db-4178-ae50-a6c14dd8fc59	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	d7a12269-65bf-41ac-a026-df99a09dde93	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	29874dfc-36bf-4e0b-b16e-fe1d958f43cd	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	12115f8e-0996-40c3-a94b-f384dd3ec48d	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	9b26acc8-d674-4aad-ae31-882f082d88c3	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8305e0db-8b5e-48a3-80d3-82cc6e8be2a6	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	9929c191-d059-4f6e-8c9c-327a4a1fb508	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	0f1e01ea-5d04-49ad-8cbf-e26abdb0a55c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	7cb014f2-efce-4f21-9eda-fb0160b44e41	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	435512cd-09a8-43dd-8d75-3dbfc99e8a8c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	4b030bf2-d640-45e9-b29d-43fa4b58fdc1	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	5d55295e-21a2-4bd9-995e-16cf083de6b6	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c41c194a-32af-4c34-b308-4c094bab246c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8fec6b08-480b-4c4b-afdf-a113b0b29c70	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	4fd3db70-191c-4389-a013-7023e8f31290	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8f6adc5a-8649-433f-8cce-0f95746954b7	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f9c73374-4917-4132-aff4-0e67fb0acea0	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	6a39d3a1-698b-428c-b632-1a4ee6237e28	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3fda8144-59f4-41dc-9597-ce0a5daf4914	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	7dd9a5d0-2a45-4177-8099-52d899ee5749	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	2cc3ad50-b644-4c17-b972-fabf9a82f553	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	47f23ee8-dc9b-42fe-b8e1-84ae0d4e8e0e	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3e7ebfed-9698-4efc-89d1-083d7e0cc06e	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8469f007-8e3f-4f51-b3ce-e574f4ad8b0a	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3a85382f-bdf3-4b51-83b9-6acbde76b7d6	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	9117f8d6-523d-40f3-893c-86fde22cc0c0	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	a4ffa51c-5289-4731-b23a-e61b7f186f59	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	47880d9f-b0be-4683-b464-fc79d6249425	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	0ccd645b-682e-4d77-b750-3d3e564c427f	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8a08588d-a17f-444c-91b2-a776447a0af5	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	465f4f32-a692-4bed-ab19-97e196ec7193	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	d2c66917-16f3-49b4-93a3-a8a5b88dd9dc	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	17ea1296-3c16-4449-ae2c-3577add8a542	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	49293a8e-0c9f-4b41-adb3-10b60695a382	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	bb14074b-64fb-4a65-b762-c7db2b370ebc	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	323da819-cb5f-401f-bd0b-ec9fe416b282	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	149e9169-2d69-4975-a2cf-335ea2183b32	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3142cabe-0722-46d0-85db-40d7d7adcbfb	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	be392922-b6eb-43e6-8558-40c50c838299	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	91c3f5bb-6764-4632-befd-a4bde1272e0a	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	cc720d60-529a-460e-9007-732fbb0a0c4b	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	5b4a3bef-49ff-4ccf-bfec-f196a09f4901	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c73e50f0-3104-47bb-9fb8-2de6d41c0ee9	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	34595455-c374-49d0-8855-740faac83082	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	e43d1039-0b86-4ee5-a55f-f97eb23e6c71	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	8d3eba58-3e3c-4e93-bbe8-17b2beb06012	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	2b6addcf-52f9-4a36-9154-03be2215adfc	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f9afe6a6-3a0b-453e-96f5-6ea149c9b946	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	bc4082b5-ce7d-418f-9f37-ce27caa4e5c5	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3fb00a7a-4bcd-4213-93fd-a326005bf182	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	6ecbdb76-f34b-4299-82d4-870bedc6bdff	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	02666702-346e-4aeb-902e-e8c31143c917	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	08adfec1-a1f1-43fb-9eb0-f8a2806493de	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	0cbe04f8-3224-4557-8753-3ed1a2d36935	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	e5ee1294-377e-435e-b5d9-ff2f7795428c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	bf8c20d1-2d04-405f-aee7-3eb86c00b2f9	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c2620c95-5ec5-4633-851d-b8942dc782b8	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	006f0ff8-a3c6-4a08-bd9c-4f8f62560bb3	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	e40dbe18-8734-408f-b0e6-37f204673138	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	7a2497fa-4027-49f4-840a-daee57a473d1	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	82ab5181-7eba-4c06-bf6e-e4e95c5c4c6e	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	5b9ba827-2fc9-4416-8006-fa006790e443	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	7bdd6ed8-1276-4756-9888-126db150d520	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c6037b66-702f-49c0-9559-02fae1d970b5	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3b09f467-abf6-41e4-a98d-90187d209b71	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	67b022ea-650f-4986-ae84-cb8d9aba50fd	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c70ff1f4-7ad6-4e63-afe0-83a0b6e80c5c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f1b2c0b7-01ff-43d0-ad79-ca5bbc245371	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	7d862f73-6d9e-4e1e-8b6a-19b1f6710fa0	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f5848da9-d72a-4652-9c99-892c9dbdbebb	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f80072c7-89c9-4e71-bc7b-6a1c53c0bd02	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	16f6413c-212f-4b8b-8751-aa61da13727f	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	4b12a40a-ecb9-4cf2-81fe-6f09591d945a	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	9fb1c5ce-c535-42c6-8748-ff170b55e0a8	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	218f561f-bfba-4e73-a9d4-e1cb6d5b2a2d	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	414d4653-48f4-4c36-8d4f-399018bb04c5	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	044699e5-8950-481d-8498-3cebe24643e9	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	914abdcd-ae6f-4834-abb6-78890442f3f6	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	936caf9e-57bb-427d-9cec-9692d979ec14	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	f7230a4c-e7a5-4e64-a11c-01aa5c3c05a8	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	053254be-1881-4160-8dd1-a676d5f82bef	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	34fb8bc4-4ec5-4a5b-88bf-d6dee959c316	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	d5b37ee7-948f-43eb-aa3c-a80abb84642b	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	b309d981-39c2-49f8-894c-b90d74e0858f	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	4faee74f-a64e-4ac1-a229-e3f66e47a48a	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	81fe47e4-e9f7-40e5-8da2-3f5aaad9e603	2026-11-14 07:24:00.121
d6ea851e-36d6-49e7-8cb5-a352ecbc60f5	c3423766-ddcb-4b54-8896-3a52baa476e1	2026-11-14 07:24:00.121
\.


--
-- Data for Name: PlatformUser; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformUser" (id, email, phone, "passwordHash", status, "emailVerifiedAt", "phoneVerifiedAt", "twoFactorEnabled", "twoFactorSecret", "lastLoginAt", "lastLoginIp", "failedLoginAttempts", "lockedUntil", "passwordChangedAt", "mustChangePassword", "invitedById", "createdAt", "updatedAt", "deletedAt", "invitationAcceptedAt", "invitationExpiresAt", "invitationToken", "refreshTokenExpiresAt", "refreshTokenHash", address, "firstNameEn", "firstNameNe", "lastNameEn", "lastNameNe", "middleNameEn", "middleNameNe") FROM stdin;
94041df2-c6b1-49ec-953a-a48d9d01a057	hemant@gmail.com	9822813509	\N	ACTIVE	\N	\N	f	\N	\N	\N	0	\N	\N	f	\N	2026-10-19 19:00:55.191	2026-10-19 19:00:55.191	\N	\N	\N	\N	\N	\N	\N	Hemant	हेमन्त	Pandey	पाण्डे	\N	\N
8c431b6b-b2cb-4c68-836a-beaad0057df3	e2e-1792269373339@test.com	\N	\N	ACTIVE	\N	\N	f	\N	\N	\N	0	\N	\N	f	\N	2026-10-17 20:36:13.782	2026-10-19 19:15:21.493	\N	\N	\N	\N	\N	\N	\N	TestSave	ई२ई	User	प्रयोगकर्ता	\N	\N
b69239ae-1df8-47c7-aff5-81cc21c705a5	e2e-1792503298912@test.com	\N	\N	DEACTIVATED	\N	\N	f	\N	\N	\N	0	\N	\N	f	\N	2026-10-20 13:34:59.44	2026-10-20 13:34:59.557	2026-10-20 13:34:59.557	\N	\N	\N	\N	\N	\N	E2E	ई२ई	User	प्रयोगकर्ता	\N	\N
6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	superadmin@platform.local	\N	$2b$10$vCPrDklJJNqcVCynznqCaOquq8sZ8.KBSCKIiRHZKs0aztwzPbBWq	ACTIVE	\N	\N	f	\N	2026-11-14 07:20:30.896	\N	0	\N	\N	f	\N	2026-10-17 20:36:08.777	2026-11-14 07:20:30.967	\N	\N	\N	\N	2026-11-21 07:20:30.966	$2b$10$i.Y0IG2lqeHPchbmAVUZkuLMfNhE52/9mlto34qsweibIKORX0Gv6	\N	Platform	प्लेटफर्म	Super Admin	सुपर एडमिन	\N	\N
\.


--
-- Data for Name: PlatformUserPermission; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformUserPermission" ("userId", "permissionId", granted, "grantedAt", "grantedById") FROM stdin;
8c431b6b-b2cb-4c68-836a-beaad0057df3	47880d9f-b0be-4683-b464-fc79d6249425	f	2026-10-19 16:00:43.268	\N
8c431b6b-b2cb-4c68-836a-beaad0057df3	3f8a5e87-f5a6-4d0a-9a7d-a1bbcfd28f4c	f	2026-10-19 19:14:55.524	\N
8c431b6b-b2cb-4c68-836a-beaad0057df3	414d4653-48f4-4c36-8d4f-399018bb04c5	f	2026-10-19 19:14:55.526	\N
\.


--
-- Data for Name: PlatformUserRole; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."PlatformUserRole" ("userId", "roleId", "assignedAt", "assignedById") FROM stdin;
6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	2026-10-17 20:36:08.789	\N
8c431b6b-b2cb-4c68-836a-beaad0057df3	cef413dc-b45f-4e56-9096-3de122ca7136	2026-10-19 15:51:19.708	\N
94041df2-c6b1-49ec-953a-a48d9d01a057	d1a60234-d0d2-44d1-be33-1bc2d9ce7fdb	2026-10-19 19:00:55.191	\N
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Role" (id, "tenantId", name, description, "isSystem", "createdAt", "updatedAt", "deletedAt") FROM stdin;
75721518-740b-4a94-85d6-9be2efabda3c	c1bcb482-346d-41c2-952e-815e45722e63	School Admin	Full access for school admin	t	2026-10-18 06:56:45.992	2026-10-18 06:56:45.992	\N
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	7170125a-3952-4270-b29e-024dbfb4e19a	School Admin	Default school administrator role	t	2026-10-21 12:04:17.09	2026-10-21 12:04:17.09	\N
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."RolePermission" ("roleId", "permissionId", "grantedAt") FROM stdin;
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	e309a291-0301-4f5f-a337-06701e165285	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	5d0cfa46-0066-4c79-87d4-ee732359ee6b	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	081233de-2419-4445-89eb-03646274096b	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	0506c67c-ac84-4bc8-869f-053e59ac9e85	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	9588fb83-f395-4be6-82df-c777de86136c	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	09b1acab-8b07-4eb4-be34-b6e7b5f938be	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	456de1b9-e6c4-40bf-a6a4-bd0f1f9085ce	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	9cd28482-c780-429e-84c7-ba3f1159f3ba	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	26bbe5a2-44f6-496e-bb1a-0f9979e4e606	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	831423cb-f26d-4f7c-8196-f9bcb1915a4e	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	8e534cec-e1a4-42c7-80c6-0b93f2887d5e	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	5bc9ed96-b616-44c0-bd4a-42eaff2b37e9	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	59f99fb9-55d0-4286-a1ab-65ed667203cc	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	ddee707b-abf5-4276-b229-554683e1de80	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	462c251e-01ca-48bd-bcfe-0d5434efb597	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	1899983a-8c23-4161-a2a0-97353062892c	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	a21a8d55-da15-4831-9641-04a5756c6fa2	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	8d3c6b45-6f55-4101-b616-2333dd7fea5f	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	bfbce1fb-11c7-48f9-af6a-2af5b60eb37d	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	b904b7b3-7d5d-4a03-97c7-77c259ba9b07	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	c3cb9fad-f2b1-4be3-96ea-aa53d84d1a55	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	45999b81-b24a-43f0-bc05-3c7c34576573	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	4ee93789-b66a-4216-9bec-be58d63836aa	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	94805b15-5c26-491e-a50f-df7f033a9504	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	fa74aa5f-55f7-4d62-8ae3-3ad8aeff179c	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	351f495c-c6e7-41f9-b252-0e58d6e4de01	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	f894c6fe-78cc-41dc-b9a8-aa54b6011850	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	14a8ee1a-1195-4239-b28d-04bd126b485e	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	8c32ec3d-f886-447e-9ad2-66bc7efdc90a	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	34c49114-b81d-4be8-8ebe-dd96709cb1f7	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	42f98219-b59c-4198-a3ae-b32c0d4a8d91	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	1e2ab7a3-20b4-4b76-8a2c-b2a4cdcc639c	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	ee41dc00-4868-4dce-80c8-10c30863b0cf	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	54bf8723-0b50-44c0-9838-79a1b4b7b98f	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	18d6ff31-adaa-45f8-a083-46a054a88f3f	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	b3f0b5d8-e13e-4067-a006-eeb60e0abe6b	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	0d511f1e-24e2-4131-8689-af7b1e041e6b	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	8ff4525c-0f27-46d3-a917-6ad96c2075d8	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	6450aa53-b8b2-49b7-a293-5f4ff7990404	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	b39a0dc5-488c-4df0-b3f6-2b5f3ef42c79	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	fa2d7178-7c42-4183-b9df-e2bb473a5303	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	99f75ee9-b2f9-4e5c-9b07-a41332f59cb4	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	eb028522-9771-4ae4-a28e-7c9d6bce7d3b	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	e1f0e4a5-b57f-4c52-87a6-f603e16db2df	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	9c583ae4-7860-4072-a314-eee1a3462bf1	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	6a1fcd63-d1b8-48b6-a251-f9711cab4087	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	9f93faa1-1c04-4850-9b13-24e2116ea747	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	fe9e820a-efa9-4c08-94a1-9199a3bf0156	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	2da87ed7-6ee3-48c7-84d3-b0747d172714	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	b0055deb-4ab5-425b-b5a1-d0be155b0cfc	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	f155f2f5-7367-47ba-9c99-e95e9146a1f7	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	79e16582-303e-4afb-a478-47042e20a872	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	090875c6-f1b8-4058-8a53-ebf9ac838769	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	49e4a00a-235a-4be0-a72a-705643e09491	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	4cb130b1-b84b-44c1-851e-ef446f3cd2fa	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	80304a3a-92d9-4a3e-853a-019049838361	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	46be964c-1caf-4fdf-a33b-830235fb7743	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	5e838ff9-8648-491f-84e7-eaaa937423ae	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	a9740959-a95c-4f8d-915c-7f832bad4c48	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	32e2c362-4524-41bc-a1bd-a9522933f69d	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	f3f08c28-fcf6-4601-ae4e-9f0cc23ee949	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	6bdf578f-0ce6-4d38-824a-bf4ccb0a6bc5	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	9091efec-f7a9-49fc-9334-e9bf741094e1	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	d4c7cba7-a27c-43d8-8576-0b7e1a01d80c	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	a05762d2-fd39-46ad-8e44-5a1e45731c8d	2026-10-21 12:04:17.09
5d558ade-d78c-4cd2-a1a7-c905754ea1a2	e3eec2fa-7685-448f-b631-c25bac669d3c	2026-10-21 12:04:17.09
75721518-740b-4a94-85d6-9be2efabda3c	e309a291-0301-4f5f-a337-06701e165285	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	5d0cfa46-0066-4c79-87d4-ee732359ee6b	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	081233de-2419-4445-89eb-03646274096b	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	0506c67c-ac84-4bc8-869f-053e59ac9e85	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	9588fb83-f395-4be6-82df-c777de86136c	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	09b1acab-8b07-4eb4-be34-b6e7b5f938be	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	456de1b9-e6c4-40bf-a6a4-bd0f1f9085ce	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	9cd28482-c780-429e-84c7-ba3f1159f3ba	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	26bbe5a2-44f6-496e-bb1a-0f9979e4e606	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	831423cb-f26d-4f7c-8196-f9bcb1915a4e	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	8e534cec-e1a4-42c7-80c6-0b93f2887d5e	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	5bc9ed96-b616-44c0-bd4a-42eaff2b37e9	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	59f99fb9-55d0-4286-a1ab-65ed667203cc	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	ddee707b-abf5-4276-b229-554683e1de80	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	462c251e-01ca-48bd-bcfe-0d5434efb597	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	1899983a-8c23-4161-a2a0-97353062892c	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	a21a8d55-da15-4831-9641-04a5756c6fa2	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	8d3c6b45-6f55-4101-b616-2333dd7fea5f	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	bfbce1fb-11c7-48f9-af6a-2af5b60eb37d	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	b904b7b3-7d5d-4a03-97c7-77c259ba9b07	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	c3cb9fad-f2b1-4be3-96ea-aa53d84d1a55	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	45999b81-b24a-43f0-bc05-3c7c34576573	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	4ee93789-b66a-4216-9bec-be58d63836aa	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	94805b15-5c26-491e-a50f-df7f033a9504	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	fa74aa5f-55f7-4d62-8ae3-3ad8aeff179c	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	351f495c-c6e7-41f9-b252-0e58d6e4de01	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	f894c6fe-78cc-41dc-b9a8-aa54b6011850	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	14a8ee1a-1195-4239-b28d-04bd126b485e	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	8c32ec3d-f886-447e-9ad2-66bc7efdc90a	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	34c49114-b81d-4be8-8ebe-dd96709cb1f7	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	42f98219-b59c-4198-a3ae-b32c0d4a8d91	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	1e2ab7a3-20b4-4b76-8a2c-b2a4cdcc639c	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	ee41dc00-4868-4dce-80c8-10c30863b0cf	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	54bf8723-0b50-44c0-9838-79a1b4b7b98f	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	18d6ff31-adaa-45f8-a083-46a054a88f3f	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	b3f0b5d8-e13e-4067-a006-eeb60e0abe6b	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	0d511f1e-24e2-4131-8689-af7b1e041e6b	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	8ff4525c-0f27-46d3-a917-6ad96c2075d8	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	6450aa53-b8b2-49b7-a293-5f4ff7990404	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	b39a0dc5-488c-4df0-b3f6-2b5f3ef42c79	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	fa2d7178-7c42-4183-b9df-e2bb473a5303	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	99f75ee9-b2f9-4e5c-9b07-a41332f59cb4	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	eb028522-9771-4ae4-a28e-7c9d6bce7d3b	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	e1f0e4a5-b57f-4c52-87a6-f603e16db2df	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	9c583ae4-7860-4072-a314-eee1a3462bf1	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	6a1fcd63-d1b8-48b6-a251-f9711cab4087	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	9f93faa1-1c04-4850-9b13-24e2116ea747	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	fe9e820a-efa9-4c08-94a1-9199a3bf0156	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	2da87ed7-6ee3-48c7-84d3-b0747d172714	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	b0055deb-4ab5-425b-b5a1-d0be155b0cfc	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	f155f2f5-7367-47ba-9c99-e95e9146a1f7	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	79e16582-303e-4afb-a478-47042e20a872	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	090875c6-f1b8-4058-8a53-ebf9ac838769	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	49e4a00a-235a-4be0-a72a-705643e09491	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	4cb130b1-b84b-44c1-851e-ef446f3cd2fa	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	80304a3a-92d9-4a3e-853a-019049838361	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	46be964c-1caf-4fdf-a33b-830235fb7743	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	5e838ff9-8648-491f-84e7-eaaa937423ae	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	a9740959-a95c-4f8d-915c-7f832bad4c48	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	32e2c362-4524-41bc-a1bd-a9522933f69d	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	f3f08c28-fcf6-4601-ae4e-9f0cc23ee949	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	6bdf578f-0ce6-4d38-824a-bf4ccb0a6bc5	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	9091efec-f7a9-49fc-9334-e9bf741094e1	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	d4c7cba7-a27c-43d8-8576-0b7e1a01d80c	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	a05762d2-fd39-46ad-8e44-5a1e45731c8d	2026-10-18 14:32:07.891
75721518-740b-4a94-85d6-9be2efabda3c	e3eec2fa-7685-448f-b631-c25bac669d3c	2026-10-18 14:32:07.891
\.


--
-- Data for Name: SalarySlip; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."SalarySlip" (id, "tenantId", "payrollRunId", "staffId", "basicSalary", "gradeAllowance", "dearnessAllowance", "employerPfSsfContribution", "employeePfSsfDeduction", "citDeduction", "salaryAdvanceDeduction", "sstTax1Percent", "tdsIncomeTax", "netPayable", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ScholarshipScheme; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."ScholarshipScheme" (id, "tenantId", name, "iemisScholarshipType", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Section; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Section" (id, "tenantId", "gradeLevelId", "nameEn", "nameNe", capacity, "sortOrder", "createdAt", "updatedAt", "deletedAt", "academicYearId", "classTeacherId", "roomNumber") FROM stdin;
b0d80d6e-13c3-4104-8c9c-ccaaaa6d3fe4	c1bcb482-346d-41c2-952e-815e45722e63	2656ed87-8c28-4ea0-a9ea-fa719f60fd7f	A	ए	40	1	2026-10-18 06:58:24.263	2026-10-18 06:58:24.263	\N	\N	\N	101
bb247c52-5529-4c5c-b2a6-acebd5918022	7170125a-3952-4270-b29e-024dbfb4e19a	e09b1e90-0ab1-491f-9769-5c82a73f4cce	A	A	50	0	2026-10-21 13:48:25.647	2026-10-21 13:48:25.647	\N	0b27b905-2bc8-413e-9ae5-dc037d3ec33a	\N	101
232d4832-66b8-426e-9109-f3b5544d9ad0	c1bcb482-346d-41c2-952e-815e45722e63	943101c8-8c2e-4967-93d2-e249126fa562	A	क	\N	0	2026-11-14 07:21:18.92	2026-11-14 07:21:18.92	\N	\N	\N	\N
\.


--
-- Data for Name: StaffProfile; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StaffProfile" (id, "tenantId", "userId", "firstNameEn", "firstNameNe", "lastNameEn", "lastNameNe", "employeeCode", "createdAt", "updatedAt", "deletedAt", "bankAccountNo", "casteEthnicity", "casteEthnicityCode", "citNumber", "employmentType", gender, "highestQualification", "iemisTeacherId", "maritalStatusForTax", "middleNameEn", "middleNameNe", "panNumber", "pfNumber", "ssfNumber", "staffCategory", "teacherTrainingStatus", "teachingLicenseNo") FROM stdin;
\.


--
-- Data for Name: Stream; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Stream" (id, "tenantId", code, "nameEn", "nameNe", "createdAt", "updatedAt", "deletedAt") FROM stdin;
c0c5d7b4-9ea4-4b8c-843f-51f6bcd98f40	c1bcb482-346d-41c2-952e-815e45722e63	science	Science	विज्ञान	2026-10-18 06:48:33.923	2026-10-18 06:48:33.923	\N
13d24847-9700-4bdb-87c0-e268c1f978b5	7170125a-3952-4270-b29e-024dbfb4e19a	01	Science	Science	2026-10-21 13:36:38.63	2026-10-21 13:36:38.63	\N
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Student" (id, "tenantId", "userId", "admissionNo", "iemisStudentId", "nebRegistrationNo", "symbolNo", "firstNameEn", "middleNameEn", "lastNameEn", "dobAd", "dobBs", gender, "disabilityType", "motherTongue", "bloodGroup", "birthCertificateNo", "nationalIdNin", "hadEcdExperience", "createdAt", "updatedAt", "deletedAt", "firstNameNe", "lastNameNe", "middleNameNe", "casteEthnicityCode", "casteEthnicity", "photoUrl") FROM stdin;
2e9240fa-3dfe-45cf-bc7d-02b0b55a6add	c1bcb482-346d-41c2-952e-815e45722e63	\N	ADM-001	\N	\N	\N	Ram	Bahadur	Sharma	2010-01-01 00:00:00	2066-09-16	MALE	NONE	Nepali	\N	BC-001	NIN-001	t	2026-10-18 07:29:11.142	2026-10-18 07:29:11.142	\N	राम	शर्मा	बहादुर	BRAHMIN_CHHETRI	Brahmin/Chhetri	\N
\.


--
-- Data for Name: StudentDailyAttendance; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentDailyAttendance" (id, "tenantId", "enrollmentId", "sectionId", "dateAd", "dateBs", status, "checkInTime", "checkOutTime", source, "markedByUserId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: StudentEnrollment; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentEnrollment" (id, "tenantId", "studentId", "academicYearId", "gradeLevelId", "sectionId", "rollNo", "houseName", "enrollmentStatus", "createdAt", "updatedAt", "deletedAt") FROM stdin;
e7a09330-ace9-449e-b677-ef28c6ca48d9	c1bcb482-346d-41c2-952e-815e45722e63	2e9240fa-3dfe-45cf-bc7d-02b0b55a6add	ac5adb3a-fc51-45c4-b47b-14f14a604451	943101c8-8c2e-4967-93d2-e249126fa562	232d4832-66b8-426e-9109-f3b5544d9ad0	5	\N	NEW_ADMISSION	2026-11-14 07:21:18.96	2026-11-14 07:21:18.96	\N
\.


--
-- Data for Name: StudentExamSummary; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentExamSummary" (id, "tenantId", "examId", "totalMarksObtained", percentage, gpa, "finalGrade", "rankInSection", "rankInGrade", "totalAttendanceDays", "presentDays", "classTeacherRemarks", "createdAt", "updatedAt", "enrollmentId") FROM stdin;
\.


--
-- Data for Name: StudentGuardian; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentGuardian" (id, "studentId", "guardianId", relationship, "isPrimary", "createdAt", "updatedAt", "otherRelationship") FROM stdin;
\.


--
-- Data for Name: StudentScholarship; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentScholarship" (id, "tenantId", "enrollmentId", "scholarshipSchemeId", "feeHeadId", "discountType", "discountValue", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudentTransport; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."StudentTransport" (id, "tenantId", "enrollmentId", "routeId", "stopId", "vehicleId", "startDate", "endDate", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Subject" (id, "tenantId", code, "nameEn", "nameNe", description, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Subscription; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Subscription" (id, "tenantId", "planId", status, "startDate", "endDate", "trialEndsAt", "cancelledAt", "autoRenew", metadata, "createdAt", "updatedAt", "assignedByPlatformUserId") FROM stdin;
5103ddf7-78e3-4926-8f42-c0b0d7e8bba7	352aed64-a8fc-4693-b0d9-64a60b6fc60a	887a4c8e-5fdd-40c0-88ef-5d63ef77455e	CANCELLED	2026-01-01 00:00:00	2026-02-01 00:00:00	\N	2026-10-20 10:09:44.689	f	\N	2026-10-18 06:12:17.057	2026-10-20 10:09:44.699	\N
77d74c65-8932-4f55-b011-45ec0f8e8e60	352aed64-a8fc-4693-b0d9-64a60b6fc60a	594e65ba-8a9a-4eaa-805e-c20f509b5608	CANCELLED	2026-10-21 00:00:00	2026-10-24 00:00:00	\N	2026-10-20 10:21:34.022	f	\N	2026-10-20 10:21:02.661	2026-10-20 10:21:34.03	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4
\.


--
-- Data for Name: SubscriptionPlan; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."SubscriptionPlan" (id, code, name, description, price, currency, "billingCycle", "trialDays", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
887a4c8e-5fdd-40c0-88ef-5d63ef77455e	trial-plan	Trial Plan	Trial plan	0.00	NPR	MONTHLY	7	t	0	2026-10-17 19:56:13.093	2026-10-17 19:56:13.093
37c4537b-724e-41ec-aece-1296a0f6d1dc	basic	Basic	For small schools	1500.00	NPR	MONTHLY	14	t	1	2026-10-17 19:48:58.197	2026-10-18 14:32:07.755
2fcf99f8-a63d-41e9-a4e9-5ccdf67ca158	standard	Standard	For medium schools	3500.00	NPR	MONTHLY	14	t	2	2026-10-17 19:48:58.201	2026-10-18 14:32:07.76
245a2d6a-ba3e-4a83-b615-a14e7db2f42d	premium	Premium	For large schools	7500.00	NPR	MONTHLY	30	t	3	2026-10-17 19:48:58.203	2026-10-18 14:32:07.763
594e65ba-8a9a-4eaa-805e-c20f509b5608	enterprise-yearly	Enterprise Yearly	Annual plan for large institutions	72000.00	NPR	YEARLY	30	t	4	2026-10-17 19:48:58.204	2026-10-18 14:32:07.766
\.


--
-- Data for Name: TeacherSubjectAllocation; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TeacherSubjectAllocation" (id, "tenantId", "academicYearId", "staffId", "sectionId", "subjectId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Tenant; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."Tenant" (id, "organizationId", "nameEn", "nameNe", subdomain, "iemisCode", "schoolType", "provinceCode", "provinceNe", "provinceEn", "districtCode", "districtNe", "districtEn", "municipalityCode", "municipalityNe", "municipalityEn", "wardNumber", "toleEn", "toleNe", "addressEn", "addressNe", phone, email, website, "logoUrl", "establishedDateAd", "establishedDateBs", status, "createdByPlatformUserId", "createdAt", "updatedAt", "deletedAt", latitude, longitude, "motoEn", "motoNe", "panVatNumber", "registrationNumber", "schoolCode") FROM stdin;
874e5ea4-903e-4174-b18d-a1c833acca0c	\N	Test School	टेस्ट स्कुल	test-school	999999999	COMMUNITY	3	बागमती	Bagmati	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	KMC	1	T	ट	Addr	ठेगाना	+977-1-1	t@t.com	\N	\N	2020-01-01 00:00:00	2076-09-16	ONBOARDING	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-17 20:58:21.313	2026-10-17 20:58:21.313	\N	27.7	85.3	m	म	111222333	REG-T	TST-001
9a412fa4-73a2-4002-863d-5c637f131ff0	\N	Test School2	टेस्ट स्कुल	test-school2	999999998	COMMUNITY	3	बागमती	Bagmati	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	KMC	1	T	ट	Addr	ठेगाना	+977-1-1	t2@t.com	\N	\N	2020-01-01 00:00:00	2076-09-16	ONBOARDING	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-17 20:58:36.697	2026-10-17 20:58:36.697	\N	27.7	85.3	m	म	111222334	REG-T2	TST-002
7a7e6143-96ba-4fda-9d18-3326b6ba971d	\N	Test School	टेस्ट स्कुल	test-school-x	999999997	COMMUNITY	3	बागमती	Bagmati	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	KMC	1	T	ट	Addr	ठेगाना	+977-1-1	tx@t.com	\N	\N	2020-01-01 00:00:00	2076-09-16	ONBOARDING	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-18 06:07:53.125	2026-10-18 06:07:53.125	\N	27.7	85.3	m	म	111222335	REG-X	TST-X
352aed64-a8fc-4693-b0d9-64a60b6fc60a	\N	ABC School Updated	एबीसी विद्यालय	abc-school	123456789	INSTITUTIONAL_PRIVATE	3	बागमती प्रदेश	Bagmati Province	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	Kathmandu Metropolitan City	1	New Baneshwor	नयाँ बानेश्वर	Kathmandu, Nepal	काठमाडौं, नेपाल	+977-1-4000000	info@abcschool.edu.np	\N	\N	2020-01-01 00:00:00	2076-09-16	ACTIVE	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-17 20:50:57.678	2026-10-18 15:43:53.747	\N	27.7172	85.324	Knowledge is power	ज्ञान नै शक्ति हो	987654321	REG-12345	ABC-001
1b45c8ea-f049-4916-baae-b711b73f2609	\N	asas	asas	asas	asas	INSTITUTIONAL_PRIVATE	2	मधेश प्रदेश	Madhesh Pradesh	8	बारा	Bara	129	पचरौता	Pacharauta	2	asas	asas	asas	sasa	asas	asaa@sa.sas	\N	\N	2020-02-22 00:00:00	2034-12-23	INACTIVE	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-19 01:48:53.059	2026-10-19 02:23:13.712	2026-10-19 02:23:13.7	233.323	2323.323	2323	wewe	asas	asas	sasas
c1bcb482-346d-41c2-952e-815e45722e63	\N	Demo School2	डेमो विद्यालय	demo-school-001	111111111	INSTITUTIONAL_PRIVATE	3	बागमती प्रदेश	Bagmati Province	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	Kathmandu Metropolitan City	1	New Baneshwor	नयाँ बानेश्वर	Kathmandu, Nepal	काठमाडौं, नेपाल	+977-1-4000000	info@demo-school.edu.np	\N	\N	2020-01-01 00:00:00	2076-09-16	INACTIVE	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-18 06:24:19.057	2026-10-19 15:25:50.916	2026-10-19 15:25:50.915	27.7172	85.324	Knowledge is power	ज्ञान नै शक्ति हो	999888777	REG-DEMO	DEMO-001
7170125a-3952-4270-b29e-024dbfb4e19a	\N	Smoke School	स्मोक स्कुल	smoke	1792304530	COMMUNITY	3	बागमती	Bagmati	27	काठमाडौं	Kathmandu	2701	काठमाडौं महानगरपालिका	KMC	1	T	ट	Addr	ठेगाना	+977-1-1	s@t.com	\N	\N	2020-01-01 00:00:00	2076-09-16	ACTIVE	6ade3e2d-cc8b-4f4a-b221-e5a40e3066d4	2026-10-18 06:22:11.154	2026-10-21 12:16:32.877	\N	27.7	85.3	m	म	VAT-1792304530	REG-1792304530	SMK-1792304530
\.


--
-- Data for Name: TenantUser; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TenantUser" (id, "tenantId", "userId", "isPrimary", status, "joinedAt", "leftAt") FROM stdin;
8e35eae0-9712-464e-a24b-0b8b1d830087	7a7e6143-96ba-4fda-9d18-3326b6ba971d	e1b6ab8b-8e93-4eed-9bfc-f69b54f26cf9	f	ACTIVE	2026-10-18 06:07:53.352	\N
01b89b71-0480-4f88-955b-7c8e1fbf132a	c1bcb482-346d-41c2-952e-815e45722e63	299695f9-2c35-479b-949a-ae01dc3522ea	t	ACTIVE	2026-10-18 06:24:19.076	\N
262ade54-ce59-41c1-91b8-7e81e24818cb	352aed64-a8fc-4693-b0d9-64a60b6fc60a	26483e38-1e32-46dc-b332-f49f4ecd8b04	f	ACTIVE	2026-10-21 12:00:28.836	\N
1cf9906d-7363-4126-8a5f-b464a804ec16	7170125a-3952-4270-b29e-024dbfb4e19a	83affb4e-43b8-4b6d-88f3-c531301c232a	f	ACTIVE	2026-10-21 12:04:17.106	\N
\.


--
-- Data for Name: TenantUserRole; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TenantUserRole" ("tenantUserId", "roleId", "assignedAt") FROM stdin;
01b89b71-0480-4f88-955b-7c8e1fbf132a	75721518-740b-4a94-85d6-9be2efabda3c	2026-10-18 06:56:46.007
1cf9906d-7363-4126-8a5f-b464a804ec16	5d558ade-d78c-4cd2-a1a7-c905754ea1a2	2026-10-21 12:04:17.106
\.


--
-- Data for Name: TimetableSlot; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TimetableSlot" (id, "tenantId", "sectionId", "dayOfWeek", "periodNo", "startTime", "endTime", "subjectId", "staffId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: TransferCertificate; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TransferCertificate" (id, "tenantId", "studentId", "issueDateAd", "issueDateBs", "tcNumber", "destinationIemisCode", "characterRemark", "leavingReason", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: TransportRoute; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TransportRoute" (id, "tenantId", "vehicleId", fare, "createdAt", "updatedAt", "deletedAt", "descriptionEn", "descriptionNe", "nameEn", "nameNe") FROM stdin;
\.


--
-- Data for Name: TransportStop; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TransportStop" (id, "tenantId", "routeId", sequence, "arrivalTime", "createdAt", "updatedAt", "deletedAt", latitude, longitude, "nameEn", "nameNe") FROM stdin;
\.


--
-- Data for Name: TransportVehicle; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."TransportVehicle" (id, "tenantId", "vehicleNumber", type, capacity, "driverStaffId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public."User" (id, email, phone, "passwordHash", status, "profilePhotoUrl", "lastLoginAt", "refreshTokenHash", "refreshTokenExpiresAt", "createdAt", "updatedAt", "deletedAt", "firstNameEn", "firstNameNe", "lastNameEn", "lastNameNe") FROM stdin;
26483e38-1e32-46dc-b332-f49f4ecd8b04	hemant@hp.com	\N	$2b$10$1Vq1SGvYIZIQcHkWdU2oI.6/UzjuMwQRCmG.hByuEEGAbtdlDBKvW	ACTIVE	\N	\N	\N	\N	2026-10-21 12:00:28.799	2026-10-21 12:15:42.297	\N	Hemant	Hemant	Pandey	Pandey
299695f9-2c35-479b-949a-ae01dc3522ea	tenantadmin@example.com	\N	$2b$10$AR/TA.OQI.AF188FNsABHu7r87OkzXjXPAJm18A.O2uRAQVj2JAX.	ACTIVE	\N	2026-11-14 07:22:03.669	$2b$10$qFNHxEAlaB7w1JgnUeZnDu8cmcqXDymWko0dBqt.5fRy9SrGpqm6.	2026-11-21 07:22:04.053	2026-10-17 20:57:49.685	2026-11-14 07:22:04.053	\N	Tenant	टेनेन्ट	Admin	एडमिन
e1b6ab8b-8e93-4eed-9bfc-f69b54f26cf9	schooladmin@test.com	\N	$2b$10$osK9V.Fbqvh25AG5ram2juVl8ziyOksMBiJcDA7OlzuUJDdH7C5bO	ACTIVE	\N	2026-10-18 12:21:53.726	$2b$10$QYa8kvEbr0GjaaBaz5SEQe26Xwy8DDxDjVmpgXIh/ENOhuXbcm4zu	2026-10-25 12:21:53.811	2026-10-18 06:07:53.344	2026-10-18 12:21:53.813	\N	School	स्कुल	Admin	एडमिन
83affb4e-43b8-4b6d-88f3-c531301c232a	smoke@test.com	\N	$2b$10$yFCaflCcNJaSTEW/OnkuAucp4hdnT/nsKdLHRd3u6.l9KXM3Fc5nm	ACTIVE	\N	2026-10-23 15:33:22.146	$2b$10$XpS/aLY2BD98z2B0RmG94OsDI5vjdVgKcvwk6JucW/hfWhMbK/sxS	2026-10-30 15:33:22.216	2026-10-21 12:04:17.056	2026-10-23 15:33:22.216	\N	School	स्कूल	Admin	एडमिन
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: johndoe
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9b921f7c-2c55-4a5b-b89d-b8bbe7950323	62975df19f5e49eb8bd753828414297e4cda5c92ea77e23f4b9fb1b4ef6b1829	2026-10-17 20:46:47.442998+00	20261018021646_tenant_rbac	\N	\N	2026-10-17 20:46:47.409766+00	1
f3aba7e9-f618-4598-a61c-992128fc5e51	74321ef4af21dd277012df04272490dac49483b673162e05f491e8db020c4494	2026-10-17 19:01:33.811198+00	20261017190133_init	\N	\N	2026-10-17 19:01:33.80677+00	1
cdcf3687-9407-406b-a8ea-6f3e0a9f1856	f3ee08c5e6d48c20e713bbf09653b7412c51fc3b52060155bf0077e8b14050e8	2026-10-17 20:23:44.116948+00	20261018015343_drop_tenant_role	\N	\N	2026-10-17 20:23:44.111515+00	1
4f5dd1e6-768b-4b41-bb9b-c94d602774c5	6aa2053ada9901a5f5811726507090e4475627a71635e5d6cf6a53fbf406303b	2026-10-17 19:10:12.045754+00	20261017191012_platform_users	\N	\N	2026-10-17 19:10:12.033066+00	1
367ffc99-36bf-4573-8a72-0e32787b82b1	eeb6a59627dd9b9a5d722112078e1cddc35bbad8f7308a5f4ce5c4254c5dfb22	2026-10-17 19:10:51.755757+00	20261018004049_platform_users_invitation	\N	\N	2026-10-17 19:10:51.746544+00	1
7c40cf7e-a9b3-4dce-ac0a-8bac38923593	b3240d3689f316babe85d541e85995d19693c4f35110c4fcd992584691a3163a	2026-10-17 19:12:37.123789+00	20261017191237_platform_rbac_dynamic	\N	\N	2026-10-17 19:12:37.095845+00	1
c0b3ff84-1e66-411c-8c92-686ac4b9a935	d42ca2e383d108c194bcff8aad25a41e706e63d6d303eca832870f5ce22d48c9	2026-10-17 20:28:10.815049+00	20261018015809_naming_ne_bs	\N	\N	2026-10-17 20:28:10.809906+00	1
ec774a4b-9316-408d-a30a-aff72e11c1bd	7ad8e5c2f5336d6f60faae2cb99b2750e30d28b8604fe2b2554ac54605997af0	2026-10-17 19:37:21.207967+00	20261017193721_platform_auth_tokens	\N	\N	2026-10-17 19:37:21.205715+00	1
f20f7c2e-1922-4659-a28c-cf288f450b49	051c88d49b30a72a54963a13eca0460b1430d8b09f75ab7633bd04dcae84ada2	2026-10-17 19:48:47.404108+00	20261017194847_subscription_model	\N	\N	2026-10-17 19:48:47.373927+00	1
188c9b4e-9eec-4ec5-9f8a-f8b248dba460	3e490c6c56d0b4e38ab02282249f0c0017de94a1dedb6ef711819181421cf698	2026-10-18 06:51:53.908182+00	20261018122152_platform_role_partial	\N	\N	2026-10-18 06:51:53.897814+00	1
7c5d6d3a-c498-4e07-b242-929d89ec391a	f52fc54c15218358f4b1478c7c40c86fde3d16b6dbe3df521e4af2a8fd3bd9bd	2026-10-17 19:50:26.709645+00	20261018012025_dynamic_features	\N	\N	2026-10-17 19:50:26.674812+00	1
81e4490a-8d39-4f9e-a724-11c107bbc100	1f913ab53da644ce26cdf832c06f5542e68a5b319fc7b61824369332bb6cbbbc	2026-10-17 20:32:36.179256+00	20261018020235_address_ne_en	\N	\N	2026-10-17 20:32:36.170722+00	1
8ce94b50-410d-4e9e-92b5-1556cb8f51e3	274a8f098da9fa189dd1e0e29a061d1bebe1a7292d235825a0ae54c08eb50f6d	2026-10-17 20:00:51.392442+00	20261017200051_organization	\N	\N	2026-10-17 20:00:51.382783+00	1
a68e485d-6395-427d-8094-d1806cc655ca	f51ef28de2b81e6bbe0143d3c6e0d54f54bcaa76413d5fb254c2e4e8c07eef09	2026-10-17 20:02:28.984297+00	20261017200228_organization_nepal_fields	\N	\N	2026-10-17 20:02:28.976449+00	1
5c256c39-0c52-4323-b043-0d342b4f7b2f	86808e35fddecd0efcdafe8b52232a05c60684bf0a9a869024d6bb4e593a9713	2026-10-18 06:09:05.716053+00	20261018113904_tenant_subscriptions	\N	\N	2026-10-18 06:09:05.675286+00	1
acbb2b13-e711-40d1-bac1-099b353fc06f	be7c2527d51717f0bb0ba1c52a3835b788c0a35ea1304aedacf068ecda4f54b9	2026-10-17 20:07:53.658433+00	20261018013752_org_pan_partial_unique	\N	\N	2026-10-17 20:07:53.650098+00	1
02160611-b2d0-4bbb-978c-020a89810d57	b9fb5095ed227bd7fb9745ba5c0329d3df3a90a591e83077e6b63c90ad5eb3b8	2026-10-17 20:33:36.482352+00	20261018020335_platform_user_address	\N	\N	2026-10-17 20:33:36.4782+00	1
e9e95a36-0855-41e6-9fdf-42acaac456a9	d7150ea9f15954b1c67657c807d97f5006ba7e836ac965e5634caf9e5fa7f32f	2026-10-17 20:13:22.078565+00	20261017201322_organization_required_fields	\N	\N	2026-10-17 20:13:22.075485+00	1
7f67b1cc-3c0d-4555-b0fc-7fc2e0a492c9	86e08530ba92dc5b0e84b6fecb240a6194c6fbdccf16d52d35f70b7c6296d6ac	2026-10-17 20:20:27.387758+00	20261018015026_global_user_identity	\N	\N	2026-10-17 20:20:27.368356+00	1
59842de8-f924-4a0f-bf58-bb8bee7142b4	4eb6be21277a0e3772ca7fc5a4f2a1afbc851e3b4524ac5e58ec422e38bb2c4b	2026-10-17 20:23:17.801192+00	20261018015316_remove_org_memberships	\N	\N	2026-10-17 20:23:17.792919+00	1
6d24b039-b4de-40d9-991f-1c6593bb888e	4c269c9dd9d9b0ff5c2086cf7dd912c412e465ca18d899eaffc720b453f3f3b6	2026-10-17 20:35:10.65359+00	20261018020509_user_names bilingual	\N	\N	2026-10-17 20:35:10.647581+00	1
c18236c8-9ea3-4fa3-b383-f70707910aea	4c2b65590b84c5e77572abf4afa2d0638a4fa680c8a665f67be0335ec35b8d97	2026-10-18 06:43:33.075299+00	20261018121332_section_staff	\N	\N	2026-10-18 06:43:33.052914+00	1
86be66b6-67bf-4eb3-813b-c77a8c322939	0e428211fe4ec3bbc0b3db963599fae36f5a988df819cf7eb0973a3c75e1141b	2026-10-17 20:35:39.280889+00	20261018020538_required_names	\N	\N	2026-10-17 20:35:39.27648+00	1
057ca57a-d896-4371-a1f8-bf9b3897b097	70a9df2b3667798cc2fcec343c08c1a2a793952b39b5fa5c1db9904e9f442dd4	2026-10-18 06:28:35.868912+00	20261018115834_academic_year	\N	\N	2026-10-18 06:28:35.85098+00	1
d9faad34-0dbd-470f-9f05-a68388eff6e7	ac891fa977c729b72919c6938d55882b84fc2e2fef6c684b9f14fd8fccf3bcb8	2026-10-17 20:38:22.715605+00	20261018020821_tenant	\N	\N	2026-10-17 20:38:22.691894+00	1
9fffcb64-1096-4597-8e63-aa0f8e224162	a47eba45268ab4eccfabf6be21abf933ce75aec9e99592952f1856b8a90319fa	2026-10-17 20:45:09.588229+00	20261018021508_tenant_required	\N	\N	2026-10-17 20:45:09.57789+00	1
ee755962-631c-4bf1-b27a-bf57f4f2b191	a9154f1034255becde72196b61d850336abc48ba0fe5e816ed3e2e8421b78ce5	2026-10-18 06:30:26.876517+00	20261018120025_bs_varchar	\N	\N	2026-10-18 06:30:26.843763+00	1
42dac20c-d041-4fc4-9c25-71345ff01923	2d9a281e7c725a3ab1603227d6b7016871b01d49553cce63ec92a9bf7fcbb115	2026-10-18 06:47:58.837247+00	20261018121757_stream_partial_unique	\N	\N	2026-10-18 06:47:58.826199+00	1
7e0bbf13-dcb9-4df1-b638-507dc5171e63	d0e019407bdfa320ac84260c0745beb300eabfde11e0039834917356398ce383	2026-10-18 06:33:48.285387+00	20261018120347_academic_year_partial_unique	\N	\N	2026-10-18 06:33:48.276731+00	1
f15e214c-887e-46d8-83b9-f38d1a2cf583	7e43c9da9ecec0641ae10d799bf55fbb938454d58b8adac4a0d41896d3139613	2026-10-18 06:39:30.80049+00	20261018120929_academic_structure	\N	\N	2026-10-18 06:39:30.764167+00	1
9fd307f0-aa2c-4f6a-b236-10babe236424	2957646d0c2fa51ce03a9b23222081d7d0a2198e9e06f479862c534f4245f1ab	2026-10-18 06:51:27.740238+00	20261018122126_role_partial_unique	\N	\N	2026-10-18 06:51:27.730997+00	1
b6163089-c92d-4e67-82ae-c3d418bd1ddc	42b5ac1ef66d459e819b96c36fac0340bccd52c45b666d148e36417e08dfe425	2026-10-18 07:07:43.945285+00	20261018123743_student	\N	\N	2026-10-18 07:07:43.924066+00	1
d2010282-8855-4368-8c95-11361d5874ed	3263a651f86eec305ccab500606583a293f15c86454a3fdb85392cf0045db2cf	2026-10-18 06:59:31.640044+00	20261018122930_subjects	\N	\N	2026-10-18 06:59:31.614341+00	1
59ca79e3-e03c-41fd-a9ae-544b4ba4399d	dd59d0c7f069b6aa9d17576142247e65ed697af09c3b768c70b482367f5c0ea2	2026-10-18 07:04:05.849877+00	20261018123404_grade_subject_decimal	\N	\N	2026-10-18 07:04:05.831841+00	1
6a6944c4-9314-45ce-8847-6062489bccc5	52e1a4caf7ce1f0d8eb7ac1e4eb3050fd02c936c815c00771a23eefa78b1d4db	2026-10-18 07:03:18.162453+00	20261018123317_grade_subject_marks	\N	\N	2026-10-18 07:03:18.155081+00	1
b5e57e53-e544-44d6-a81f-da7a7e34d3fb	03a16162753979f8b7e07ec828d1d5782793d823533acdebf3a3321a71c9163e	2026-10-18 07:07:48.283123+00	20261018123747_student_admission_partial	\N	\N	2026-10-18 07:07:48.274412+00	1
9fe96fce-b66c-4620-9ec7-48634a203d69	d89753077e8e45c8848bc586d4043d234038cc1049567e3a503d84eb5df71d55	2026-10-18 07:08:30.111627+00	20261018123829_student_ne_names	\N	\N	2026-10-18 07:08:30.102048+00	1
b78ae06b-1a4d-485b-acc1-2d05d1b4ce30	33a8dccefb5e45449a5cb34db2de25c4442d9a7f64100edc2ee08f1e6b9e6220	2026-10-18 07:08:43.801733+00	20261018123842_drop_fullname_np	\N	\N	2026-10-18 07:08:43.796838+00	1
35757090-fa54-44a3-b435-65d585d317db	73d332c1493eb51885e216f8a3afebe533367a9a3498f50e37551ce527b3a0b7	2026-10-18 07:09:56.539581+00	20261018123955_caste_fields	\N	\N	2026-10-18 07:09:56.532781+00	1
123a7833-a6c8-4039-a8c3-d44d5056dc92	eef0682491daec4896ff1c6e1abaf4ed27af714fbf67eae7a408dd747222081f	2026-10-18 07:10:17.939811+00	20261018124017_student_required_fields	\N	\N	2026-10-18 07:10:17.935626+00	1
08f2a9a6-5605-4bfe-839c-cf0a6fe1e2a2	f5120308678bf2e97ed6be3a30c4a3514587ceb0f49c75161b37c1b44f6d99a9	2026-10-18 07:17:24.714716+00	20261018124723_address_table	\N	\N	2026-10-18 07:17:24.690992+00	1
6a8691bb-f589-46c0-b1c3-d7c2145a2e1e	a5a5da9009993de49042ac9957d55ae370eba6fa6645bb47acddec6c5cd5dcc2	2026-10-18 07:22:14.439366+00	20261018125213_guardians	\N	\N	2026-10-18 07:22:14.405392+00	1
ce5adc1f-6b75-4a07-9c2a-97cb9c96387f	dac56fd703312da4478be25e86b4944f846fadcc674cc40287fefaaa5f18b741	2026-10-18 08:29:51.767499+00	20261018135950_names_ne_en	\N	\N	2026-10-18 08:29:51.759561+00	1
03dffd69-16af-433b-aabc-7d6544d12f3b	8f9125805d44da08ca302404f0ff8fee64671f653fd1ac6d5d136c218b814d27	2026-10-18 07:23:34.052773+00	20261018125333_guardian_citizenship_json	\N	\N	2026-10-18 07:23:34.047059+00	1
6b4e761a-c262-45bf-8690-59f4055d3743	c7dac0192d5873368576ec182006c5171e3d9347a6f88bed3045a05419ae72a4	2026-10-18 08:09:57.560597+00	20261018133956_hr_payroll	\N	\N	2026-10-18 08:09:57.503035+00	1
78644b2e-fe06-450b-be92-d86d6c1e6b0b	e0ed9498d355febac266ad5b2fb70db08ed59579699e1c7d6c2cf1d577927831	2026-10-18 07:25:14.656774+00	20261018125513_guardian_relationship	\N	\N	2026-10-18 07:25:14.651789+00	1
afbed2ba-590c-4a1a-b019-3cd5d56d660c	89961ddd5e92ab35599c16def69cd76b5e59dbc2ad7322b58bdfafdb1ee049d2	2026-10-18 07:32:22.822975+00	20261018130221_address_polymorphic	\N	\N	2026-10-18 07:32:22.806516+00	1
99aa244d-acbb-4318-9b62-3bc237f6de93	d25c87630ce2b34f778796b7f652462ce0c60af2b0c88615db19f7b09aa06247	2026-10-18 07:38:28.228289+00	20261018130827_student_enrollment	\N	\N	2026-10-18 07:38:28.197616+00	1
6cfa917e-0015-4068-a523-6da761ee4543	b9dd90f3d211652c299f357f91ac787764162068f73c91398ef79fe340d32376	2026-10-18 08:15:11.286665+00	20261018134510_academic_calendar	\N	\N	2026-10-18 08:15:11.264893+00	1
5228d81f-2b48-4f99-806e-95c91b857891	c8bf49d1b088c3b667c5d22964cb5a4ef93286f83d80ca4af88ca87a2803b4b6	2026-10-18 07:38:41.939143+00	20261018130840_enrollment_partial	\N	\N	2026-10-18 07:38:41.920362+00	1
a5677d3d-bf64-40c7-89a3-f25f978c3de9	01afd7e2bb2f02b0727869ea0996d610cb5df1222dc0466d464564676abd17ee	2026-10-18 07:40:54.311863+00	20261018131053_transfer_certificate	\N	\N	2026-10-18 07:40:54.287559+00	1
31308c37-42eb-4190-9be7-e15c8fb1419d	b1a958bf97924dc434f078fc53174dfd2c9a1f9195b424e2f65ccd33426b0fd6	2026-10-18 07:41:37.192654+00	20261018131136_tc_required	\N	\N	2026-10-18 07:41:37.183929+00	1
8384a494-7298-4182-b5ff-d598042fe602	b375088d66959fb1ea8bdf80e052c5521d821a14f6452c5db7072ac7682178e4	2026-10-18 08:18:34.682474+00	20261018134833_attendance_timetable	\N	\N	2026-10-18 08:18:34.640777+00	1
33478008-58b9-4d5d-b97a-64d236824d90	5410e8dba92e69c680d86ca665b13732e5ba0862c6270666985d614b61dab19a	2026-10-18 07:47:51.777886+00	20261018131750_grading	\N	\N	2026-10-18 07:47:51.751041+00	1
78e395d8-a36b-4411-bc5c-42b19c5022a4	ce474b35821a145976643acd182f8930ea9a5c9935a8d70549933a3c06a6be21	2026-10-18 07:53:25.270401+00	20261018132324_exams	\N	\N	2026-10-18 07:53:25.210774+00	1
37929c1a-44fd-4962-acf3-9c7f82703321	cfa7a971526269415e7fadadb678da4f8979761d46b339bd9750e5c09796d34c	2026-10-18 08:30:50.767069+00	20261018140049_ace_title_ne_en	\N	\N	2026-10-18 08:30:50.760564+00	1
f8348abc-2f5d-4b09-8ba4-86b863a03216	b2b134b718ccdd38f722e2ad943295ac5ed783d48a0d9936f54423fdc6608577	2026-10-18 07:59:40.918075+00	20261018132939_fee	\N	\N	2026-10-18 07:59:40.855688+00	1
4265250b-84af-474e-bddb-63ad0c4872e7	a62e0a1254e87507f76c16e62c2b1266ef8e1025b57935885391f8ae5a2638c4	2026-10-18 08:20:30.709802+00	20261018135029_transport	\N	\N	2026-10-18 08:20:30.663746+00	1
d6b1ba3a-c411-4414-b7ab-22378a07ca78	eb77909357cc987ddbb00b923da83fa5401bbee12d54dbb11aba75623ac6ebd5	2026-10-18 08:03:02.525693+00	20261018133301_fee_invoices	\N	\N	2026-10-18 08:03:02.46784+00	1
4d64b5c3-8fe4-453b-a4b6-4d3a4b66947a	4b509be232377d6a9e5c25faf34d4905baec34653fb2d851d68e12f02030f4b5	2026-10-18 08:08:38.838401+00	20261018133837_staff_hr	\N	\N	2026-10-18 08:08:38.828485+00	1
6adfc3fd-1d5d-4a20-bb26-876825418807	f267fea7d387ab18a058d7e710f497d05dfea4db750508275e1cab96eb4c91c9	2026-10-18 08:21:47.010948+00	20261018135146_lat_long	\N	\N	2026-10-18 08:21:47.005923+00	1
72d1c56d-9474-447c-9913-5672efccb73c	4546825301f773ca039f9ec5c97166eba7dd90101ffce59fbaa91285024633e9	2026-10-18 08:22:19.139923+00	20261018135218_student_transport_lat	\N	\N	2026-10-18 08:22:19.134344+00	1
8cb6f5fc-bda3-410e-9e7f-bf9165f08512	ce2cc25f4172f4f8275e74a04af8dadc2aa9030de8ab5419a4d1a65f590efcb2	2026-10-18 08:31:34.052105+00	20261018140133_route_names	\N	\N	2026-10-18 08:31:34.04611+00	1
0a84f7e1-bfbc-440c-bbb9-9a0b228d529d	f3468978969ebae59c517c610ee1d273986445aff1e2d345fdd25d306773fe39	2026-10-18 08:23:23.011392+00	20261018135322_drop_st_lat	\N	\N	2026-10-18 08:23:23.006266+00	1
86e6dca3-a595-420d-a7a4-da9e04bc5aa2	8a8fb0997858557ced74a0368ede8a473d31dbfab0e222f5048ca79d7f4b58fd	2026-10-18 08:28:24.175015+00	20261018135823_library	\N	\N	2026-10-18 08:28:24.141215+00	1
6c60c194-0cda-428c-b542-e626755f6a03	80db4c7a9edd6ece4dc005744fcd4e5d4edb4649108731516871220535b48c59	2026-10-18 08:38:43.948142+00	20261018140842_hostel	\N	\N	2026-10-18 08:38:43.899198+00	1
9a1dd2e3-7d02-4d18-a6ce-163ad9a3d854	4cc1822d9909c180c4670407797a3d630ecfd9b462aed05ceaeaa528938949c1	2026-10-18 08:34:50.453132+00	20261018140449_summary_enrollment	\N	\N	2026-10-18 08:34:50.433672+00	1
bb3e4360-db40-44a9-9b05-8dfd856362fc	e566e6d99caca71f1261330042edec2416ef52739f834d269e48a8f509165a22	2026-10-18 08:37:05.804981+00	20261018140704_exam_schedule_snapshot	\N	\N	2026-10-18 08:37:05.800609+00	1
4bf7195a-3fe9-4c17-bdaf-15bd9aa7ef7e	ef66eaa9a1d6b03e4d0aa545398bc6d83644daf57c212a2d27ec14f90269b777	2026-10-18 14:29:45.852205+00	20261018195944_notifications	\N	\N	2026-10-18 14:29:45.790736+00	1
2b80d3e4-b0f5-4b03-85f3-f74060ed0a96	d3027d5119e1f47a5512cc991b378f3c4d607cb1ea08d4e858203d13f4100294	2026-10-18 08:37:54.796651+00	20261018140753_composite_tenant_indexes	\N	\N	2026-10-18 08:37:54.760203+00	1
\.


--
-- Name: AcademicCalendarEvent AcademicCalendarEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AcademicCalendarEvent"
    ADD CONSTRAINT "AcademicCalendarEvent_pkey" PRIMARY KEY (id);


--
-- Name: AcademicYear AcademicYear_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AcademicYear"
    ADD CONSTRAINT "AcademicYear_pkey" PRIMARY KEY (id);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: BookIssue BookIssue_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_pkey" PRIMARY KEY (id);


--
-- Name: ClassFeeStructure ClassFeeStructure_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_pkey" PRIMARY KEY (id);


--
-- Name: CreditNote CreditNote_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."CreditNote"
    ADD CONSTRAINT "CreditNote_pkey" PRIMARY KEY (id);


--
-- Name: ExamMark ExamMark_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamMark"
    ADD CONSTRAINT "ExamMark_pkey" PRIMARY KEY (id);


--
-- Name: ExamSchedule ExamSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamSchedule"
    ADD CONSTRAINT "ExamSchedule_pkey" PRIMARY KEY (id);


--
-- Name: Exam Exam_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_pkey" PRIMARY KEY (id);


--
-- Name: Feature Feature_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Feature"
    ADD CONSTRAINT "Feature_pkey" PRIMARY KEY (id);


--
-- Name: FeeHead FeeHead_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeHead"
    ADD CONSTRAINT "FeeHead_pkey" PRIMARY KEY (id);


--
-- Name: FeeInvoiceItem FeeInvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoiceItem"
    ADD CONSTRAINT "FeeInvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: FeeInvoice FeeInvoice_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoice"
    ADD CONSTRAINT "FeeInvoice_pkey" PRIMARY KEY (id);


--
-- Name: FeePayment FeePayment_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_pkey" PRIMARY KEY (id);


--
-- Name: FiscalYear FiscalYear_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FiscalYear"
    ADD CONSTRAINT "FiscalYear_pkey" PRIMARY KEY (id);


--
-- Name: GradeLevel GradeLevel_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeLevel"
    ADD CONSTRAINT "GradeLevel_pkey" PRIMARY KEY (id);


--
-- Name: GradeSubject GradeSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeSubject"
    ADD CONSTRAINT "GradeSubject_pkey" PRIMARY KEY (id);


--
-- Name: GradingScaleItem GradingScaleItem_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradingScaleItem"
    ADD CONSTRAINT "GradingScaleItem_pkey" PRIMARY KEY (id);


--
-- Name: GradingScale GradingScale_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradingScale"
    ADD CONSTRAINT "GradingScale_pkey" PRIMARY KEY (id);


--
-- Name: Guardian Guardian_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Guardian"
    ADD CONSTRAINT "Guardian_pkey" PRIMARY KEY (id);


--
-- Name: HostelAllocation HostelAllocation_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY (id);


--
-- Name: HostelRoom HostelRoom_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_pkey" PRIMARY KEY (id);


--
-- Name: Hostel Hostel_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: LibraryBook LibraryBook_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."LibraryBook"
    ADD CONSTRAINT "LibraryBook_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PayrollRun PayrollRun_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PayrollRun"
    ADD CONSTRAINT "PayrollRun_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PlanFeature PlanFeature_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlanFeature"
    ADD CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("planId", "featureId");


--
-- Name: PlatformPermission PlatformPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformPermission"
    ADD CONSTRAINT "PlatformPermission_pkey" PRIMARY KEY (id);


--
-- Name: PlatformRolePermission PlatformRolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformRolePermission"
    ADD CONSTRAINT "PlatformRolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: PlatformRole PlatformRole_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformRole"
    ADD CONSTRAINT "PlatformRole_pkey" PRIMARY KEY (id);


--
-- Name: PlatformUserPermission PlatformUserPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserPermission"
    ADD CONSTRAINT "PlatformUserPermission_pkey" PRIMARY KEY ("userId", "permissionId");


--
-- Name: PlatformUserRole PlatformUserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserRole"
    ADD CONSTRAINT "PlatformUserRole_pkey" PRIMARY KEY ("userId", "roleId");


--
-- Name: PlatformUser PlatformUser_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUser"
    ADD CONSTRAINT "PlatformUser_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SalarySlip SalarySlip_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."SalarySlip"
    ADD CONSTRAINT "SalarySlip_pkey" PRIMARY KEY (id);


--
-- Name: ScholarshipScheme ScholarshipScheme_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ScholarshipScheme"
    ADD CONSTRAINT "ScholarshipScheme_pkey" PRIMARY KEY (id);


--
-- Name: Section Section_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_pkey" PRIMARY KEY (id);


--
-- Name: StaffProfile StaffProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StaffProfile"
    ADD CONSTRAINT "StaffProfile_pkey" PRIMARY KEY (id);


--
-- Name: Stream Stream_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_pkey" PRIMARY KEY (id);


--
-- Name: StudentDailyAttendance StudentDailyAttendance_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentDailyAttendance"
    ADD CONSTRAINT "StudentDailyAttendance_pkey" PRIMARY KEY (id);


--
-- Name: StudentEnrollment StudentEnrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_pkey" PRIMARY KEY (id);


--
-- Name: StudentExamSummary StudentExamSummary_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentExamSummary"
    ADD CONSTRAINT "StudentExamSummary_pkey" PRIMARY KEY (id);


--
-- Name: StudentGuardian StudentGuardian_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentGuardian"
    ADD CONSTRAINT "StudentGuardian_pkey" PRIMARY KEY (id);


--
-- Name: StudentScholarship StudentScholarship_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_pkey" PRIMARY KEY (id);


--
-- Name: StudentTransport StudentTransport_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: SubscriptionPlan SubscriptionPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."SubscriptionPlan"
    ADD CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY (id);


--
-- Name: Subscription Subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY (id);


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_pkey" PRIMARY KEY (id);


--
-- Name: TenantUserRole TenantUserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUserRole"
    ADD CONSTRAINT "TenantUserRole_pkey" PRIMARY KEY ("tenantUserId", "roleId");


--
-- Name: TenantUser TenantUser_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_pkey" PRIMARY KEY (id);


--
-- Name: Tenant Tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_pkey" PRIMARY KEY (id);


--
-- Name: TimetableSlot TimetableSlot_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TimetableSlot"
    ADD CONSTRAINT "TimetableSlot_pkey" PRIMARY KEY (id);


--
-- Name: TransferCertificate TransferCertificate_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransferCertificate"
    ADD CONSTRAINT "TransferCertificate_pkey" PRIMARY KEY (id);


--
-- Name: TransportRoute TransportRoute_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_pkey" PRIMARY KEY (id);


--
-- Name: TransportStop TransportStop_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportStop"
    ADD CONSTRAINT "TransportStop_pkey" PRIMARY KEY (id);


--
-- Name: TransportVehicle TransportVehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportVehicle"
    ADD CONSTRAINT "TransportVehicle_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AcademicCalendarEvent_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicCalendarEvent_academicYearId_idx" ON public."AcademicCalendarEvent" USING btree ("academicYearId");


--
-- Name: AcademicCalendarEvent_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicCalendarEvent_deletedAt_idx" ON public."AcademicCalendarEvent" USING btree ("deletedAt");


--
-- Name: AcademicCalendarEvent_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicCalendarEvent_tenantId_idx" ON public."AcademicCalendarEvent" USING btree ("tenantId");


--
-- Name: AcademicYear_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicYear_deletedAt_idx" ON public."AcademicYear" USING btree ("deletedAt");


--
-- Name: AcademicYear_isCurrent_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicYear_isCurrent_idx" ON public."AcademicYear" USING btree ("isCurrent");


--
-- Name: AcademicYear_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AcademicYear_tenantId_idx" ON public."AcademicYear" USING btree ("tenantId");


--
-- Name: AcademicYear_tenantId_name_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "AcademicYear_tenantId_name_active_key" ON public."AcademicYear" USING btree ("tenantId", name) WHERE ("deletedAt" IS NULL);


--
-- Name: Address_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Address_deletedAt_idx" ON public."Address" USING btree ("deletedAt");


--
-- Name: Address_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Address_entityType_entityId_idx" ON public."Address" USING btree ("entityType", "entityId");


--
-- Name: Address_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Address_tenantId_idx" ON public."Address" USING btree ("tenantId");


--
-- Name: Address_type_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Address_type_idx" ON public."Address" USING btree (type);


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_method_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AuditLog_method_idx" ON public."AuditLog" USING btree (method);


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: BookIssue_bookId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "BookIssue_bookId_idx" ON public."BookIssue" USING btree ("bookId");


--
-- Name: BookIssue_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "BookIssue_deletedAt_idx" ON public."BookIssue" USING btree ("deletedAt");


--
-- Name: BookIssue_studentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "BookIssue_studentId_idx" ON public."BookIssue" USING btree ("studentId");


--
-- Name: BookIssue_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "BookIssue_tenantId_idx" ON public."BookIssue" USING btree ("tenantId");


--
-- Name: ClassFeeStructure_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ClassFeeStructure_academicYearId_idx" ON public."ClassFeeStructure" USING btree ("academicYearId");


--
-- Name: ClassFeeStructure_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ClassFeeStructure_deletedAt_idx" ON public."ClassFeeStructure" USING btree ("deletedAt");


--
-- Name: ClassFeeStructure_feeHeadId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ClassFeeStructure_feeHeadId_idx" ON public."ClassFeeStructure" USING btree ("feeHeadId");


--
-- Name: ClassFeeStructure_gradeLevelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ClassFeeStructure_gradeLevelId_idx" ON public."ClassFeeStructure" USING btree ("gradeLevelId");


--
-- Name: ClassFeeStructure_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ClassFeeStructure_tenantId_idx" ON public."ClassFeeStructure" USING btree ("tenantId");


--
-- Name: CreditNote_invoiceId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "CreditNote_invoiceId_idx" ON public."CreditNote" USING btree ("invoiceId");


--
-- Name: CreditNote_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "CreditNote_tenantId_idx" ON public."CreditNote" USING btree ("tenantId");


--
-- Name: ExamMark_examScheduleId_enrollmentId_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "ExamMark_examScheduleId_enrollmentId_key" ON public."ExamMark" USING btree ("examScheduleId", "enrollmentId");


--
-- Name: ExamMark_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamMark_tenantId_enrollmentId_idx" ON public."ExamMark" USING btree ("tenantId", "enrollmentId");


--
-- Name: ExamMark_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamMark_tenantId_idx" ON public."ExamMark" USING btree ("tenantId");


--
-- Name: ExamSchedule_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamSchedule_deletedAt_idx" ON public."ExamSchedule" USING btree ("deletedAt");


--
-- Name: ExamSchedule_examId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamSchedule_examId_idx" ON public."ExamSchedule" USING btree ("examId");


--
-- Name: ExamSchedule_gradeSubjectId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamSchedule_gradeSubjectId_idx" ON public."ExamSchedule" USING btree ("gradeSubjectId");


--
-- Name: ExamSchedule_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ExamSchedule_tenantId_idx" ON public."ExamSchedule" USING btree ("tenantId");


--
-- Name: Exam_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Exam_academicYearId_idx" ON public."Exam" USING btree ("academicYearId");


--
-- Name: Exam_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Exam_deletedAt_idx" ON public."Exam" USING btree ("deletedAt");


--
-- Name: Exam_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Exam_tenantId_idx" ON public."Exam" USING btree ("tenantId");


--
-- Name: Feature_category_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Feature_category_idx" ON public."Feature" USING btree (category);


--
-- Name: Feature_code_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Feature_code_key" ON public."Feature" USING btree (code);


--
-- Name: Feature_isActive_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Feature_isActive_idx" ON public."Feature" USING btree ("isActive");


--
-- Name: FeeHead_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeHead_deletedAt_idx" ON public."FeeHead" USING btree ("deletedAt");


--
-- Name: FeeHead_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeHead_tenantId_idx" ON public."FeeHead" USING btree ("tenantId");


--
-- Name: FeeInvoiceItem_invoiceId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeInvoiceItem_invoiceId_idx" ON public."FeeInvoiceItem" USING btree ("invoiceId");


--
-- Name: FeeInvoiceItem_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeInvoiceItem_tenantId_idx" ON public."FeeInvoiceItem" USING btree ("tenantId");


--
-- Name: FeeInvoice_tenantId_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeInvoice_tenantId_deletedAt_idx" ON public."FeeInvoice" USING btree ("tenantId", "deletedAt");


--
-- Name: FeeInvoice_tenantId_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeInvoice_tenantId_enrollmentId_idx" ON public."FeeInvoice" USING btree ("tenantId", "enrollmentId");


--
-- Name: FeeInvoice_tenantId_fiscalYearId_invoiceNumber_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "FeeInvoice_tenantId_fiscalYearId_invoiceNumber_key" ON public."FeeInvoice" USING btree ("tenantId", "fiscalYearId", "invoiceNumber");


--
-- Name: FeeInvoice_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeeInvoice_tenantId_idx" ON public."FeeInvoice" USING btree ("tenantId");


--
-- Name: FeePayment_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeePayment_deletedAt_idx" ON public."FeePayment" USING btree ("deletedAt");


--
-- Name: FeePayment_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeePayment_enrollmentId_idx" ON public."FeePayment" USING btree ("enrollmentId");


--
-- Name: FeePayment_fiscalYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeePayment_fiscalYearId_idx" ON public."FeePayment" USING btree ("fiscalYearId");


--
-- Name: FeePayment_invoiceId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeePayment_invoiceId_idx" ON public."FeePayment" USING btree ("invoiceId");


--
-- Name: FeePayment_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FeePayment_tenantId_idx" ON public."FeePayment" USING btree ("tenantId");


--
-- Name: FiscalYear_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FiscalYear_deletedAt_idx" ON public."FiscalYear" USING btree ("deletedAt");


--
-- Name: FiscalYear_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "FiscalYear_tenantId_idx" ON public."FiscalYear" USING btree ("tenantId");


--
-- Name: GradeLevel_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeLevel_deletedAt_idx" ON public."GradeLevel" USING btree ("deletedAt");


--
-- Name: GradeLevel_streamId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeLevel_streamId_idx" ON public."GradeLevel" USING btree ("streamId");


--
-- Name: GradeLevel_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeLevel_tenantId_idx" ON public."GradeLevel" USING btree ("tenantId");


--
-- Name: GradeSubject_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeSubject_deletedAt_idx" ON public."GradeSubject" USING btree ("deletedAt");


--
-- Name: GradeSubject_gradeLevelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeSubject_gradeLevelId_idx" ON public."GradeSubject" USING btree ("gradeLevelId");


--
-- Name: GradeSubject_subjectId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeSubject_subjectId_idx" ON public."GradeSubject" USING btree ("subjectId");


--
-- Name: GradeSubject_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradeSubject_tenantId_idx" ON public."GradeSubject" USING btree ("tenantId");


--
-- Name: GradingScaleItem_gradingScaleId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradingScaleItem_gradingScaleId_idx" ON public."GradingScaleItem" USING btree ("gradingScaleId");


--
-- Name: GradingScale_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradingScale_deletedAt_idx" ON public."GradingScale" USING btree ("deletedAt");


--
-- Name: GradingScale_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "GradingScale_tenantId_idx" ON public."GradingScale" USING btree ("tenantId");


--
-- Name: Guardian_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Guardian_deletedAt_idx" ON public."Guardian" USING btree ("deletedAt");


--
-- Name: Guardian_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Guardian_tenantId_idx" ON public."Guardian" USING btree ("tenantId");


--
-- Name: Guardian_userId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Guardian_userId_idx" ON public."Guardian" USING btree ("userId");


--
-- Name: HostelAllocation_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelAllocation_deletedAt_idx" ON public."HostelAllocation" USING btree ("deletedAt");


--
-- Name: HostelAllocation_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelAllocation_enrollmentId_idx" ON public."HostelAllocation" USING btree ("enrollmentId");


--
-- Name: HostelAllocation_hostelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelAllocation_hostelId_idx" ON public."HostelAllocation" USING btree ("hostelId");


--
-- Name: HostelAllocation_roomId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelAllocation_roomId_idx" ON public."HostelAllocation" USING btree ("roomId");


--
-- Name: HostelAllocation_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelAllocation_tenantId_idx" ON public."HostelAllocation" USING btree ("tenantId");


--
-- Name: HostelRoom_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelRoom_deletedAt_idx" ON public."HostelRoom" USING btree ("deletedAt");


--
-- Name: HostelRoom_hostelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelRoom_hostelId_idx" ON public."HostelRoom" USING btree ("hostelId");


--
-- Name: HostelRoom_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "HostelRoom_tenantId_idx" ON public."HostelRoom" USING btree ("tenantId");


--
-- Name: Hostel_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Hostel_deletedAt_idx" ON public."Hostel" USING btree ("deletedAt");


--
-- Name: Hostel_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Hostel_tenantId_idx" ON public."Hostel" USING btree ("tenantId");


--
-- Name: Invoice_dueDate_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Invoice_dueDate_idx" ON public."Invoice" USING btree ("dueDate");


--
-- Name: Invoice_number_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Invoice_number_key" ON public."Invoice" USING btree (number);


--
-- Name: Invoice_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Invoice_status_idx" ON public."Invoice" USING btree (status);


--
-- Name: Invoice_subscriptionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Invoice_subscriptionId_idx" ON public."Invoice" USING btree ("subscriptionId");


--
-- Name: Invoice_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Invoice_tenantId_idx" ON public."Invoice" USING btree ("tenantId");


--
-- Name: LibraryBook_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "LibraryBook_deletedAt_idx" ON public."LibraryBook" USING btree ("deletedAt");


--
-- Name: LibraryBook_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "LibraryBook_tenantId_idx" ON public."LibraryBook" USING btree ("tenantId");


--
-- Name: Notification_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Notification_deletedAt_idx" ON public."Notification" USING btree ("deletedAt");


--
-- Name: Notification_isRead_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Notification_isRead_idx" ON public."Notification" USING btree ("isRead");


--
-- Name: Notification_recipientType_recipientId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Notification_recipientType_recipientId_idx" ON public."Notification" USING btree ("recipientType", "recipientId");


--
-- Name: Notification_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Notification_tenantId_idx" ON public."Notification" USING btree ("tenantId");


--
-- Name: Organization_createdByPlatformUserId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Organization_createdByPlatformUserId_idx" ON public."Organization" USING btree ("createdByPlatformUserId");


--
-- Name: Organization_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Organization_deletedAt_idx" ON public."Organization" USING btree ("deletedAt");


--
-- Name: Organization_panVatNumber_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Organization_panVatNumber_key" ON public."Organization" USING btree ("panVatNumber") WHERE ("deletedAt" IS NULL);


--
-- Name: Organization_provinceCode_districtCode_municipalityCode_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Organization_provinceCode_districtCode_municipalityCode_idx" ON public."Organization" USING btree ("provinceCode", "districtCode", "municipalityCode");


--
-- Name: Organization_resellerPartnerId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Organization_resellerPartnerId_idx" ON public."Organization" USING btree ("resellerPartnerId");


--
-- Name: Organization_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Organization_status_idx" ON public."Organization" USING btree (status);


--
-- Name: Payment_invoiceId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Payment_invoiceId_idx" ON public."Payment" USING btree ("invoiceId");


--
-- Name: Payment_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Payment_status_idx" ON public."Payment" USING btree (status);


--
-- Name: PayrollRun_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PayrollRun_deletedAt_idx" ON public."PayrollRun" USING btree ("deletedAt");


--
-- Name: PayrollRun_fiscalYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PayrollRun_fiscalYearId_idx" ON public."PayrollRun" USING btree ("fiscalYearId");


--
-- Name: PayrollRun_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PayrollRun_tenantId_idx" ON public."PayrollRun" USING btree ("tenantId");


--
-- Name: Permission_code_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Permission_code_key" ON public."Permission" USING btree (code);


--
-- Name: PlanFeature_featureId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlanFeature_featureId_idx" ON public."PlanFeature" USING btree ("featureId");


--
-- Name: PlatformPermission_code_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "PlatformPermission_code_key" ON public."PlatformPermission" USING btree (code);


--
-- Name: PlatformRolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformRolePermission_permissionId_idx" ON public."PlatformRolePermission" USING btree ("permissionId");


--
-- Name: PlatformRole_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformRole_deletedAt_idx" ON public."PlatformRole" USING btree ("deletedAt");


--
-- Name: PlatformRole_name_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "PlatformRole_name_active_key" ON public."PlatformRole" USING btree (name) WHERE ("deletedAt" IS NULL);


--
-- Name: PlatformUserPermission_permissionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformUserPermission_permissionId_idx" ON public."PlatformUserPermission" USING btree ("permissionId");


--
-- Name: PlatformUserRole_roleId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformUserRole_roleId_idx" ON public."PlatformUserRole" USING btree ("roleId");


--
-- Name: PlatformUser_createdAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformUser_createdAt_idx" ON public."PlatformUser" USING btree ("createdAt");


--
-- Name: PlatformUser_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformUser_deletedAt_idx" ON public."PlatformUser" USING btree ("deletedAt");


--
-- Name: PlatformUser_email_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "PlatformUser_email_key" ON public."PlatformUser" USING btree (email);


--
-- Name: PlatformUser_invitationToken_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "PlatformUser_invitationToken_key" ON public."PlatformUser" USING btree ("invitationToken");


--
-- Name: PlatformUser_phone_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "PlatformUser_phone_key" ON public."PlatformUser" USING btree (phone);


--
-- Name: PlatformUser_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "PlatformUser_status_idx" ON public."PlatformUser" USING btree (status);


--
-- Name: RolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "RolePermission_permissionId_idx" ON public."RolePermission" USING btree ("permissionId");


--
-- Name: Role_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Role_deletedAt_idx" ON public."Role" USING btree ("deletedAt");


--
-- Name: Role_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Role_tenantId_idx" ON public."Role" USING btree ("tenantId");


--
-- Name: Role_tenantId_name_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Role_tenantId_name_active_key" ON public."Role" USING btree ("tenantId", name) WHERE ("deletedAt" IS NULL);


--
-- Name: SalarySlip_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SalarySlip_deletedAt_idx" ON public."SalarySlip" USING btree ("deletedAt");


--
-- Name: SalarySlip_payrollRunId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SalarySlip_payrollRunId_idx" ON public."SalarySlip" USING btree ("payrollRunId");


--
-- Name: SalarySlip_staffId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SalarySlip_staffId_idx" ON public."SalarySlip" USING btree ("staffId");


--
-- Name: SalarySlip_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SalarySlip_tenantId_idx" ON public."SalarySlip" USING btree ("tenantId");


--
-- Name: ScholarshipScheme_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ScholarshipScheme_deletedAt_idx" ON public."ScholarshipScheme" USING btree ("deletedAt");


--
-- Name: ScholarshipScheme_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "ScholarshipScheme_tenantId_idx" ON public."ScholarshipScheme" USING btree ("tenantId");


--
-- Name: Section_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Section_academicYearId_idx" ON public."Section" USING btree ("academicYearId");


--
-- Name: Section_classTeacherId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Section_classTeacherId_idx" ON public."Section" USING btree ("classTeacherId");


--
-- Name: Section_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Section_deletedAt_idx" ON public."Section" USING btree ("deletedAt");


--
-- Name: Section_gradeLevelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Section_gradeLevelId_idx" ON public."Section" USING btree ("gradeLevelId");


--
-- Name: Section_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Section_tenantId_idx" ON public."Section" USING btree ("tenantId");


--
-- Name: StaffProfile_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StaffProfile_deletedAt_idx" ON public."StaffProfile" USING btree ("deletedAt");


--
-- Name: StaffProfile_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StaffProfile_tenantId_idx" ON public."StaffProfile" USING btree ("tenantId");


--
-- Name: Stream_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Stream_deletedAt_idx" ON public."Stream" USING btree ("deletedAt");


--
-- Name: Stream_tenantId_code_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Stream_tenantId_code_active_key" ON public."Stream" USING btree ("tenantId", code) WHERE ("deletedAt" IS NULL);


--
-- Name: Stream_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Stream_tenantId_idx" ON public."Stream" USING btree ("tenantId");


--
-- Name: StudentDailyAttendance_tenantId_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentDailyAttendance_tenantId_deletedAt_idx" ON public."StudentDailyAttendance" USING btree ("tenantId", "deletedAt");


--
-- Name: StudentDailyAttendance_tenantId_enrollmentId_dateAd_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "StudentDailyAttendance_tenantId_enrollmentId_dateAd_key" ON public."StudentDailyAttendance" USING btree ("tenantId", "enrollmentId", "dateAd");


--
-- Name: StudentDailyAttendance_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentDailyAttendance_tenantId_idx" ON public."StudentDailyAttendance" USING btree ("tenantId");


--
-- Name: StudentDailyAttendance_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentDailyAttendance_tenantId_sectionId_idx" ON public."StudentDailyAttendance" USING btree ("tenantId", "sectionId");


--
-- Name: StudentEnrollment_tenantId_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_academicYearId_idx" ON public."StudentEnrollment" USING btree ("tenantId", "academicYearId");


--
-- Name: StudentEnrollment_tenantId_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_deletedAt_idx" ON public."StudentEnrollment" USING btree ("tenantId", "deletedAt");


--
-- Name: StudentEnrollment_tenantId_gradeLevelId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_gradeLevelId_idx" ON public."StudentEnrollment" USING btree ("tenantId", "gradeLevelId");


--
-- Name: StudentEnrollment_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_idx" ON public."StudentEnrollment" USING btree ("tenantId");


--
-- Name: StudentEnrollment_tenantId_sectionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_sectionId_idx" ON public."StudentEnrollment" USING btree ("tenantId", "sectionId");


--
-- Name: StudentEnrollment_tenantId_studentId_academicYearId_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "StudentEnrollment_tenantId_studentId_academicYearId_active_key" ON public."StudentEnrollment" USING btree ("tenantId", "studentId", "academicYearId") WHERE ("deletedAt" IS NULL);


--
-- Name: StudentEnrollment_tenantId_studentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentEnrollment_tenantId_studentId_idx" ON public."StudentEnrollment" USING btree ("tenantId", "studentId");


--
-- Name: StudentExamSummary_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentExamSummary_enrollmentId_idx" ON public."StudentExamSummary" USING btree ("enrollmentId");


--
-- Name: StudentExamSummary_examId_enrollmentId_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "StudentExamSummary_examId_enrollmentId_key" ON public."StudentExamSummary" USING btree ("examId", "enrollmentId");


--
-- Name: StudentExamSummary_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentExamSummary_tenantId_idx" ON public."StudentExamSummary" USING btree ("tenantId");


--
-- Name: StudentGuardian_guardianId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentGuardian_guardianId_idx" ON public."StudentGuardian" USING btree ("guardianId");


--
-- Name: StudentGuardian_studentId_guardianId_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "StudentGuardian_studentId_guardianId_key" ON public."StudentGuardian" USING btree ("studentId", "guardianId");


--
-- Name: StudentScholarship_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentScholarship_enrollmentId_idx" ON public."StudentScholarship" USING btree ("enrollmentId");


--
-- Name: StudentScholarship_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentScholarship_tenantId_idx" ON public."StudentScholarship" USING btree ("tenantId");


--
-- Name: StudentTransport_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentTransport_deletedAt_idx" ON public."StudentTransport" USING btree ("deletedAt");


--
-- Name: StudentTransport_enrollmentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentTransport_enrollmentId_idx" ON public."StudentTransport" USING btree ("enrollmentId");


--
-- Name: StudentTransport_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "StudentTransport_tenantId_idx" ON public."StudentTransport" USING btree ("tenantId");


--
-- Name: Student_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Student_deletedAt_idx" ON public."Student" USING btree ("deletedAt");


--
-- Name: Student_tenantId_admissionNo_active_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Student_tenantId_admissionNo_active_key" ON public."Student" USING btree ("tenantId", "admissionNo") WHERE ("deletedAt" IS NULL);


--
-- Name: Student_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Student_tenantId_idx" ON public."Student" USING btree ("tenantId");


--
-- Name: Student_userId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Student_userId_idx" ON public."Student" USING btree ("userId");


--
-- Name: Subject_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subject_deletedAt_idx" ON public."Subject" USING btree ("deletedAt");


--
-- Name: Subject_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subject_tenantId_idx" ON public."Subject" USING btree ("tenantId");


--
-- Name: SubscriptionPlan_code_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "SubscriptionPlan_code_key" ON public."SubscriptionPlan" USING btree (code);


--
-- Name: SubscriptionPlan_isActive_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SubscriptionPlan_isActive_idx" ON public."SubscriptionPlan" USING btree ("isActive");


--
-- Name: SubscriptionPlan_sortOrder_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "SubscriptionPlan_sortOrder_idx" ON public."SubscriptionPlan" USING btree ("sortOrder");


--
-- Name: Subscription_endDate_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subscription_endDate_idx" ON public."Subscription" USING btree ("endDate");


--
-- Name: Subscription_planId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subscription_planId_idx" ON public."Subscription" USING btree ("planId");


--
-- Name: Subscription_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subscription_status_idx" ON public."Subscription" USING btree (status);


--
-- Name: Subscription_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Subscription_tenantId_idx" ON public."Subscription" USING btree ("tenantId");


--
-- Name: TeacherSubjectAllocation_academicYearId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_academicYearId_idx" ON public."TeacherSubjectAllocation" USING btree ("academicYearId");


--
-- Name: TeacherSubjectAllocation_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_deletedAt_idx" ON public."TeacherSubjectAllocation" USING btree ("deletedAt");


--
-- Name: TeacherSubjectAllocation_sectionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_sectionId_idx" ON public."TeacherSubjectAllocation" USING btree ("sectionId");


--
-- Name: TeacherSubjectAllocation_staffId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_staffId_idx" ON public."TeacherSubjectAllocation" USING btree ("staffId");


--
-- Name: TeacherSubjectAllocation_subjectId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_subjectId_idx" ON public."TeacherSubjectAllocation" USING btree ("subjectId");


--
-- Name: TeacherSubjectAllocation_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TeacherSubjectAllocation_tenantId_idx" ON public."TeacherSubjectAllocation" USING btree ("tenantId");


--
-- Name: TenantUserRole_roleId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TenantUserRole_roleId_idx" ON public."TenantUserRole" USING btree ("roleId");


--
-- Name: TenantUser_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TenantUser_status_idx" ON public."TenantUser" USING btree (status);


--
-- Name: TenantUser_tenantId_userId_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "TenantUser_tenantId_userId_key" ON public."TenantUser" USING btree ("tenantId", "userId");


--
-- Name: TenantUser_userId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TenantUser_userId_idx" ON public."TenantUser" USING btree ("userId");


--
-- Name: Tenant_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Tenant_deletedAt_idx" ON public."Tenant" USING btree ("deletedAt");


--
-- Name: Tenant_iemisCode_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Tenant_iemisCode_key" ON public."Tenant" USING btree ("iemisCode");


--
-- Name: Tenant_organizationId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Tenant_organizationId_idx" ON public."Tenant" USING btree ("organizationId");


--
-- Name: Tenant_provinceCode_districtCode_municipalityCode_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Tenant_provinceCode_districtCode_municipalityCode_idx" ON public."Tenant" USING btree ("provinceCode", "districtCode", "municipalityCode");


--
-- Name: Tenant_schoolCode_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Tenant_schoolCode_key" ON public."Tenant" USING btree ("schoolCode");


--
-- Name: Tenant_schoolType_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Tenant_schoolType_idx" ON public."Tenant" USING btree ("schoolType");


--
-- Name: Tenant_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "Tenant_status_idx" ON public."Tenant" USING btree (status);


--
-- Name: Tenant_subdomain_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "Tenant_subdomain_key" ON public."Tenant" USING btree (subdomain);


--
-- Name: TimetableSlot_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TimetableSlot_deletedAt_idx" ON public."TimetableSlot" USING btree ("deletedAt");


--
-- Name: TimetableSlot_sectionId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TimetableSlot_sectionId_idx" ON public."TimetableSlot" USING btree ("sectionId");


--
-- Name: TimetableSlot_staffId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TimetableSlot_staffId_idx" ON public."TimetableSlot" USING btree ("staffId");


--
-- Name: TimetableSlot_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TimetableSlot_tenantId_idx" ON public."TimetableSlot" USING btree ("tenantId");


--
-- Name: TimetableSlot_tenantId_sectionId_dayOfWeek_periodNo_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "TimetableSlot_tenantId_sectionId_dayOfWeek_periodNo_key" ON public."TimetableSlot" USING btree ("tenantId", "sectionId", "dayOfWeek", "periodNo");


--
-- Name: TransferCertificate_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransferCertificate_deletedAt_idx" ON public."TransferCertificate" USING btree ("deletedAt");


--
-- Name: TransferCertificate_studentId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransferCertificate_studentId_idx" ON public."TransferCertificate" USING btree ("studentId");


--
-- Name: TransferCertificate_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransferCertificate_tenantId_idx" ON public."TransferCertificate" USING btree ("tenantId");


--
-- Name: TransportRoute_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportRoute_deletedAt_idx" ON public."TransportRoute" USING btree ("deletedAt");


--
-- Name: TransportRoute_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportRoute_tenantId_idx" ON public."TransportRoute" USING btree ("tenantId");


--
-- Name: TransportStop_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportStop_deletedAt_idx" ON public."TransportStop" USING btree ("deletedAt");


--
-- Name: TransportStop_routeId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportStop_routeId_idx" ON public."TransportStop" USING btree ("routeId");


--
-- Name: TransportStop_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportStop_tenantId_idx" ON public."TransportStop" USING btree ("tenantId");


--
-- Name: TransportVehicle_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportVehicle_deletedAt_idx" ON public."TransportVehicle" USING btree ("deletedAt");


--
-- Name: TransportVehicle_tenantId_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "TransportVehicle_tenantId_idx" ON public."TransportVehicle" USING btree ("tenantId");


--
-- Name: User_deletedAt_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "User_deletedAt_idx" ON public."User" USING btree ("deletedAt");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_phone_key; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE UNIQUE INDEX "User_phone_key" ON public."User" USING btree (phone);


--
-- Name: User_status_idx; Type: INDEX; Schema: public; Owner: johndoe
--

CREATE INDEX "User_status_idx" ON public."User" USING btree (status);


--
-- Name: AcademicCalendarEvent AcademicCalendarEvent_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AcademicCalendarEvent"
    ADD CONSTRAINT "AcademicCalendarEvent_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicCalendarEvent AcademicCalendarEvent_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AcademicCalendarEvent"
    ADD CONSTRAINT "AcademicCalendarEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AcademicYear AcademicYear_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AcademicYear"
    ADD CONSTRAINT "AcademicYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Address Address_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BookIssue BookIssue_bookId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES public."LibraryBook"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookIssue BookIssue_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BookIssue BookIssue_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."BookIssue"
    ADD CONSTRAINT "BookIssue_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassFeeStructure ClassFeeStructure_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassFeeStructure ClassFeeStructure_feeHeadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES public."FeeHead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassFeeStructure ClassFeeStructure_fiscalYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES public."FiscalYear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ClassFeeStructure ClassFeeStructure_gradeLevelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES public."GradeLevel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ClassFeeStructure ClassFeeStructure_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ClassFeeStructure"
    ADD CONSTRAINT "ClassFeeStructure_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CreditNote CreditNote_approvedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."CreditNote"
    ADD CONSTRAINT "CreditNote_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CreditNote CreditNote_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."CreditNote"
    ADD CONSTRAINT "CreditNote_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."FeeInvoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CreditNote CreditNote_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."CreditNote"
    ADD CONSTRAINT "CreditNote_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamMark ExamMark_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamMark"
    ADD CONSTRAINT "ExamMark_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamMark ExamMark_enteredByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamMark"
    ADD CONSTRAINT "ExamMark_enteredByUserId_fkey" FOREIGN KEY ("enteredByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ExamMark ExamMark_examScheduleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamMark"
    ADD CONSTRAINT "ExamMark_examScheduleId_fkey" FOREIGN KEY ("examScheduleId") REFERENCES public."ExamSchedule"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamSchedule ExamSchedule_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamSchedule"
    ADD CONSTRAINT "ExamSchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamSchedule ExamSchedule_gradeSubjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ExamSchedule"
    ADD CONSTRAINT "ExamSchedule_gradeSubjectId_fkey" FOREIGN KEY ("gradeSubjectId") REFERENCES public."GradeSubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exam Exam_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exam Exam_gradingScaleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES public."GradingScale"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Exam Exam_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeHead FeeHead_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeHead"
    ADD CONSTRAINT "FeeHead_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoiceItem FeeInvoiceItem_feeHeadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoiceItem"
    ADD CONSTRAINT "FeeInvoiceItem_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES public."FeeHead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoiceItem FeeInvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoiceItem"
    ADD CONSTRAINT "FeeInvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."FeeInvoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoiceItem FeeInvoiceItem_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoiceItem"
    ADD CONSTRAINT "FeeInvoiceItem_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoice FeeInvoice_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoice"
    ADD CONSTRAINT "FeeInvoice_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoice FeeInvoice_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoice"
    ADD CONSTRAINT "FeeInvoice_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoice FeeInvoice_fiscalYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoice"
    ADD CONSTRAINT "FeeInvoice_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES public."FiscalYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeeInvoice FeeInvoice_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeeInvoice"
    ADD CONSTRAINT "FeeInvoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeePayment FeePayment_collectedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_collectedByUserId_fkey" FOREIGN KEY ("collectedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeePayment FeePayment_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeePayment FeePayment_fiscalYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES public."FiscalYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeePayment FeePayment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."FeeInvoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FeePayment FeePayment_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FeePayment"
    ADD CONSTRAINT "FeePayment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FiscalYear FiscalYear_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."FiscalYear"
    ADD CONSTRAINT "FiscalYear_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradeLevel GradeLevel_streamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeLevel"
    ADD CONSTRAINT "GradeLevel_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES public."Stream"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: GradeLevel GradeLevel_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeLevel"
    ADD CONSTRAINT "GradeLevel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradeSubject GradeSubject_gradeLevelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeSubject"
    ADD CONSTRAINT "GradeSubject_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES public."GradeLevel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradeSubject GradeSubject_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeSubject"
    ADD CONSTRAINT "GradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradeSubject GradeSubject_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradeSubject"
    ADD CONSTRAINT "GradeSubject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradingScaleItem GradingScaleItem_gradingScaleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradingScaleItem"
    ADD CONSTRAINT "GradingScaleItem_gradingScaleId_fkey" FOREIGN KEY ("gradingScaleId") REFERENCES public."GradingScale"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: GradingScale GradingScale_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."GradingScale"
    ADD CONSTRAINT "GradingScale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guardian Guardian_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Guardian"
    ADD CONSTRAINT "Guardian_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guardian Guardian_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Guardian"
    ADD CONSTRAINT "Guardian_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: HostelAllocation HostelAllocation_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelAllocation HostelAllocation_hostelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES public."Hostel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelAllocation HostelAllocation_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public."HostelRoom"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelAllocation HostelAllocation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelAllocation"
    ADD CONSTRAINT "HostelAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelRoom HostelRoom_hostelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES public."Hostel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: HostelRoom HostelRoom_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."HostelRoom"
    ADD CONSTRAINT "HostelRoom_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Hostel Hostel_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Hostel Hostel_wardenStaffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Hostel"
    ADD CONSTRAINT "Hostel_wardenStaffId_fkey" FOREIGN KEY ("wardenStaffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_subscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES public."Subscription"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryBook LibraryBook_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."LibraryBook"
    ADD CONSTRAINT "LibraryBook_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Organization Organization_createdByPlatformUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_createdByPlatformUserId_fkey" FOREIGN KEY ("createdByPlatformUserId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Organization Organization_resellerPartnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_resellerPartnerId_fkey" FOREIGN KEY ("resellerPartnerId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PayrollRun PayrollRun_fiscalYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PayrollRun"
    ADD CONSTRAINT "PayrollRun_fiscalYearId_fkey" FOREIGN KEY ("fiscalYearId") REFERENCES public."FiscalYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PayrollRun PayrollRun_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PayrollRun"
    ADD CONSTRAINT "PayrollRun_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlanFeature PlanFeature_featureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlanFeature"
    ADD CONSTRAINT "PlanFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES public."Feature"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlanFeature PlanFeature_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlanFeature"
    ADD CONSTRAINT "PlanFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformRolePermission PlatformRolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformRolePermission"
    ADD CONSTRAINT "PlatformRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."PlatformPermission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformRolePermission PlatformRolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformRolePermission"
    ADD CONSTRAINT "PlatformRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."PlatformRole"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformUserPermission PlatformUserPermission_grantedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserPermission"
    ADD CONSTRAINT "PlatformUserPermission_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlatformUserPermission PlatformUserPermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserPermission"
    ADD CONSTRAINT "PlatformUserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."PlatformPermission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformUserPermission PlatformUserPermission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserPermission"
    ADD CONSTRAINT "PlatformUserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformUserRole PlatformUserRole_assignedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserRole"
    ADD CONSTRAINT "PlatformUserRole_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PlatformUserRole PlatformUserRole_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserRole"
    ADD CONSTRAINT "PlatformUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."PlatformRole"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformUserRole PlatformUserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUserRole"
    ADD CONSTRAINT "PlatformUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PlatformUser PlatformUser_invitedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."PlatformUser"
    ADD CONSTRAINT "PlatformUser_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Role Role_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalarySlip SalarySlip_payrollRunId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."SalarySlip"
    ADD CONSTRAINT "SalarySlip_payrollRunId_fkey" FOREIGN KEY ("payrollRunId") REFERENCES public."PayrollRun"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalarySlip SalarySlip_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."SalarySlip"
    ADD CONSTRAINT "SalarySlip_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SalarySlip SalarySlip_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."SalarySlip"
    ADD CONSTRAINT "SalarySlip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScholarshipScheme ScholarshipScheme_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."ScholarshipScheme"
    ADD CONSTRAINT "ScholarshipScheme_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Section Section_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Section Section_classTeacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Section Section_gradeLevelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES public."GradeLevel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Section Section_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Section"
    ADD CONSTRAINT "Section_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaffProfile StaffProfile_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StaffProfile"
    ADD CONSTRAINT "StaffProfile_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Stream Stream_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Stream"
    ADD CONSTRAINT "Stream_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentDailyAttendance StudentDailyAttendance_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentDailyAttendance"
    ADD CONSTRAINT "StudentDailyAttendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentDailyAttendance StudentDailyAttendance_markedByUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentDailyAttendance"
    ADD CONSTRAINT "StudentDailyAttendance_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StudentDailyAttendance StudentDailyAttendance_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentDailyAttendance"
    ADD CONSTRAINT "StudentDailyAttendance_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Section"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentDailyAttendance StudentDailyAttendance_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentDailyAttendance"
    ADD CONSTRAINT "StudentDailyAttendance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_gradeLevelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_gradeLevelId_fkey" FOREIGN KEY ("gradeLevelId") REFERENCES public."GradeLevel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Section"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentEnrollment StudentEnrollment_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentEnrollment"
    ADD CONSTRAINT "StudentEnrollment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentExamSummary StudentExamSummary_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentExamSummary"
    ADD CONSTRAINT "StudentExamSummary_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentExamSummary StudentExamSummary_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentExamSummary"
    ADD CONSTRAINT "StudentExamSummary_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentGuardian StudentGuardian_guardianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentGuardian"
    ADD CONSTRAINT "StudentGuardian_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES public."Guardian"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentGuardian StudentGuardian_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentGuardian"
    ADD CONSTRAINT "StudentGuardian_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentScholarship StudentScholarship_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentScholarship StudentScholarship_feeHeadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_feeHeadId_fkey" FOREIGN KEY ("feeHeadId") REFERENCES public."FeeHead"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentScholarship StudentScholarship_scholarshipSchemeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_scholarshipSchemeId_fkey" FOREIGN KEY ("scholarshipSchemeId") REFERENCES public."ScholarshipScheme"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentScholarship StudentScholarship_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentScholarship"
    ADD CONSTRAINT "StudentScholarship_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentTransport StudentTransport_enrollmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES public."StudentEnrollment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentTransport StudentTransport_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."TransportRoute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentTransport StudentTransport_stopId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES public."TransportStop"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StudentTransport StudentTransport_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentTransport StudentTransport_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."StudentTransport"
    ADD CONSTRAINT "StudentTransport_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."TransportVehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Student Student_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subject Subject_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subscription Subscription_assignedByPlatformUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_assignedByPlatformUserId_fkey" FOREIGN KEY ("assignedByPlatformUserId") REFERENCES public."PlatformUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subscription Subscription_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."SubscriptionPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subscription Subscription_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Subscription"
    ADD CONSTRAINT "Subscription_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_academicYearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES public."AcademicYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Section"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubjectAllocation TeacherSubjectAllocation_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TeacherSubjectAllocation"
    ADD CONSTRAINT "TeacherSubjectAllocation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUserRole TenantUserRole_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUserRole"
    ADD CONSTRAINT "TenantUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUserRole TenantUserRole_tenantUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUserRole"
    ADD CONSTRAINT "TenantUserRole_tenantUserId_fkey" FOREIGN KEY ("tenantUserId") REFERENCES public."TenantUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUser TenantUser_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TenantUser TenantUser_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TenantUser"
    ADD CONSTRAINT "TenantUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tenant Tenant_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "Tenant_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TimetableSlot TimetableSlot_sectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TimetableSlot"
    ADD CONSTRAINT "TimetableSlot_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES public."Section"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimetableSlot TimetableSlot_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TimetableSlot"
    ADD CONSTRAINT "TimetableSlot_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimetableSlot TimetableSlot_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TimetableSlot"
    ADD CONSTRAINT "TimetableSlot_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimetableSlot TimetableSlot_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TimetableSlot"
    ADD CONSTRAINT "TimetableSlot_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransferCertificate TransferCertificate_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransferCertificate"
    ADD CONSTRAINT "TransferCertificate_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransferCertificate TransferCertificate_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransferCertificate"
    ADD CONSTRAINT "TransferCertificate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportRoute TransportRoute_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportRoute TransportRoute_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportRoute"
    ADD CONSTRAINT "TransportRoute_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."TransportVehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransportStop TransportStop_routeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportStop"
    ADD CONSTRAINT "TransportStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES public."TransportRoute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportStop TransportStop_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportStop"
    ADD CONSTRAINT "TransportStop_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransportVehicle TransportVehicle_driverStaffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportVehicle"
    ADD CONSTRAINT "TransportVehicle_driverStaffId_fkey" FOREIGN KEY ("driverStaffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransportVehicle TransportVehicle_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johndoe
--

ALTER TABLE ONLY public."TransportVehicle"
    ADD CONSTRAINT "TransportVehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."Tenant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict AgqcEXdiSZVxGLglvQYIeyFJZsNRqKCbiqoaxYTA9BFcJ83qy353cOhaOHfzrKK

