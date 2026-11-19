import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Seed data for development and demos.
 *
 * The script is idempotent: running it repeatedly converges on the same
 * state rather than duplicating rows. It never prints a password, and it
 * refuses to fall back to a well-known development password in production.
 */

const isProduction = process.env.NODE_ENV === 'production';

function dedupe<T extends { code: string }>(entries: T[]): T[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.code)) return false;
    seen.add(entry.code);
    return true;
  });
}

const PLATFORM_PERMISSIONS = dedupe([
  {
    code: 'subscriptions.read',
    name: 'Read subscriptions',
    category: 'subscriptions',
  },
  {
    code: 'subscriptions.manage',
    name: 'Manage subscriptions',
    category: 'subscriptions',
  },
  {
    code: 'subscriptions.cancel',
    name: 'Cancel subscriptions',
    category: 'subscriptions',
  },
  {
    code: 'platform_users.read',
    name: 'Read platform users',
    category: 'platform_users',
  },
  {
    code: 'platform_users.create',
    name: 'Create platform users',
    category: 'platform_users',
  },
  {
    code: 'platform_users.update',
    name: 'Update platform users',
    category: 'platform_users',
  },
  {
    code: 'platform_users.delete',
    name: 'Delete platform users',
    category: 'platform_users',
  },
  { code: 'roles.read', name: 'Read roles', category: 'roles' },
  { code: 'roles.manage', name: 'Manage roles', category: 'roles' },
  {
    code: 'permissions.read',
    name: 'Read permissions',
    category: 'permissions',
  },
  {
    code: 'permissions.manage',
    name: 'Manage permissions',
    category: 'permissions',
  },
  { code: 'billing.read', name: 'Read billing', category: 'billing' },
  { code: 'billing.manage', name: 'Manage billing', category: 'billing' },
  { code: 'audit.read', name: 'Read audit logs', category: 'audit' },
  {
    code: 'organizations.read',
    name: 'Read organizations',
    category: 'organizations',
  },
  {
    code: 'organizations.manage',
    name: 'Manage organizations',
    category: 'organizations',
  },
  { code: 'tenants.read', name: 'Read tenants', category: 'tenants' },
  { code: 'tenants.manage', name: 'Manage tenants', category: 'tenants' },
  {
    code: 'tenant_users.read',
    name: 'Read tenant users',
    category: 'tenant_users',
  },
  {
    code: 'tenant_users.manage',
    name: 'Manage tenant users',
    category: 'tenant_users',
  },
  { code: 'audit.write', name: 'Write audit logs', category: 'audit' },

  // Cross-tenant permissions.
  //
  // Platform staff operate across schools, so they hold the same capability
  // codes as a school administrator. The boundary between the two domains is
  // enforced by the `@PlatformOnly()` marker on the platform controllers, not
  // by the codes themselves.
  {
    code: 'academic_years.read',
    name: 'Read academic years',
    category: 'academic',
  },
  {
    code: 'academic_years.manage',
    name: 'Manage academic years',
    category: 'academic',
  },
  {
    code: 'academic_calendar.read',
    name: 'Read academic calendar',
    category: 'academic',
  },
  {
    code: 'academic_calendar.manage',
    name: 'Manage academic calendar',
    category: 'academic',
  },
  { code: 'exams.read', name: 'Read exams', category: 'exams' },
  { code: 'exams.manage', name: 'Manage exams', category: 'exams' },
  { code: 'fees.read', name: 'Read fees', category: 'fees' },
  { code: 'fees.manage', name: 'Manage fees', category: 'fees' },
  { code: 'fee_invoices.read', name: 'Read fee invoices', category: 'billing' },
  {
    code: 'fee_invoices.manage',
    name: 'Manage fee invoices',
    category: 'billing',
  },
  { code: 'fee_payments.read', name: 'Read fee payments', category: 'billing' },
  {
    code: 'fee_payments.manage',
    name: 'Manage fee payments',
    category: 'billing',
  },
  {
    code: 'payment_gateways.read',
    name: 'Read payment gateway configuration',
    category: 'billing',
  },
  {
    code: 'payment_gateways.manage',
    name: 'Manage payment gateway configuration',
    category: 'billing',
  },
  {
    code: 'integrations.read',
    name: 'Read API keys',
    category: 'integrations',
  },
  {
    code: 'integrations.manage',
    name: 'Manage API keys',
    category: 'integrations',
  },
  { code: 'credit_notes.read', name: 'Read credit notes', category: 'billing' },
  {
    code: 'credit_notes.manage',
    name: 'Manage credit notes',
    category: 'billing',
  },
  {
    code: 'scholarships.read',
    name: 'Read scholarships',
    category: 'scholarships',
  },
  {
    code: 'scholarships.manage',
    name: 'Manage scholarships',
    category: 'scholarships',
  },
  {
    code: 'grading_scales.read',
    name: 'Read grading scales',
    category: 'academic',
  },
  {
    code: 'grading_scales.manage',
    name: 'Manage grading scales',
    category: 'academic',
  },
  { code: 'streams.read', name: 'Read streams', category: 'academic' },
  { code: 'streams.manage', name: 'Manage streams', category: 'academic' },
  {
    code: 'grade_levels.read',
    name: 'Read grade levels',
    category: 'academic',
  },
  {
    code: 'grade_levels.manage',
    name: 'Manage grade levels',
    category: 'academic',
  },
  { code: 'sections.read', name: 'Read sections', category: 'academic' },
  { code: 'sections.manage', name: 'Manage sections', category: 'academic' },
  { code: 'staff.read', name: 'Read staff profiles', category: 'staff' },
  { code: 'staff.manage', name: 'Manage staff profiles', category: 'staff' },
  {
    code: 'notifications.read',
    name: 'Read notifications',
    category: 'notifications',
  },
  {
    code: 'notifications.manage',
    name: 'Manage notifications',
    category: 'notifications',
  },
  { code: 'hostel.read', name: 'Read hostel', category: 'hostel' },
  { code: 'hostel.manage', name: 'Manage hostel', category: 'hostel' },
  { code: 'library.read', name: 'Read library', category: 'library' },
  { code: 'library.manage', name: 'Manage library', category: 'library' },
  { code: 'transport.read', name: 'Read transport', category: 'transport' },
  { code: 'transport.manage', name: 'Manage transport', category: 'transport' },
  { code: 'hr.read', name: 'Read HR data', category: 'hr' },
  { code: 'hr.manage', name: 'Manage HR data', category: 'hr' },
  { code: 'subjects.read', name: 'Read subjects', category: 'academic' },
  { code: 'subjects.manage', name: 'Manage subjects', category: 'academic' },
  {
    code: 'grade_subjects.read',
    name: 'Read grade subjects',
    category: 'academic',
  },
  {
    code: 'grade_subjects.manage',
    name: 'Manage grade subjects',
    category: 'academic',
  },
  { code: 'students.read', name: 'Read students', category: 'students' },
  { code: 'students.manage', name: 'Manage students', category: 'students' },
  {
    code: 'transfer_certificates.read',
    name: 'Read transfer certificates',
    category: 'certificates',
  },
  {
    code: 'transfer_certificates.manage',
    name: 'Manage transfer certificates',
    category: 'certificates',
  },
  {
    code: 'enrollments.read',
    name: 'Read enrollments',
    category: 'enrollments',
  },
  {
    code: 'enrollments.manage',
    name: 'Manage enrollments',
    category: 'enrollments',
  },
  { code: 'guardians.read', name: 'Read guardians', category: 'guardians' },
  { code: 'guardians.manage', name: 'Manage guardians', category: 'guardians' },
  { code: 'addresses.read', name: 'Read addresses', category: 'addresses' },
  { code: 'addresses.manage', name: 'Manage addresses', category: 'addresses' },
  { code: 'attendance.read', name: 'Read attendance', category: 'attendance' },
  {
    code: 'attendance.manage',
    name: 'Manage attendance',
    category: 'attendance',
  },
  { code: 'teachers.read', name: 'Read teachers', category: 'teachers' },
  { code: 'teachers.manage', name: 'Manage teachers', category: 'teachers' },
  { code: 'reports.read', name: 'Read reports', category: 'reports' },
]);

const PLATFORM_ROLES = [
  {
    name: 'Super Admin',
    description: 'Full access to the platform.',
    isSystem: true,
    permissions: PLATFORM_PERMISSIONS.map((p) => p.code),
  },
  {
    name: 'Platform Admin',
    description: 'Manages schools, subscriptions and platform users.',
    isSystem: true,
    permissions: PLATFORM_PERMISSIONS.filter(
      (p) => p.code !== 'audit.write',
    ).map((p) => p.code),
  },
  {
    name: 'Support Engineer',
    description: 'Handles support cases and can impersonate tenant users.',
    isSystem: true,
    permissions: ['tenants.read', 'audit.read'],
  },
  {
    name: 'Billing Admin',
    description: 'Manages billing and subscriptions.',
    isSystem: true,
    permissions: [
      'subscriptions.read',
      'subscriptions.manage',
      'subscriptions.cancel',
      'billing.read',
      'billing.manage',
      'audit.read',
    ],
  },
  {
    name: 'Sales Partner',
    description: 'Onboards schools in an assigned region.',
    isSystem: true,
    permissions: ['tenants.read', 'tenants.manage', 'subscriptions.read'],
  },
  {
    name: 'Auditor',
    description: 'Read-only access to platform data.',
    isSystem: true,
    permissions: PLATFORM_PERMISSIONS.filter((p) =>
      p.code.endsWith('.read'),
    ).map((p) => p.code),
  },
];

/**
 * The tenant permission catalogue.
 *
 * These codes deliberately overlap with the platform catalogue (`roles.manage`
 * and friends). The platform/tenant boundary is enforced by the
 * `@PlatformOnly()` marker on the platform controllers, not by the codes.
 */
const TENANT_PERMISSIONS = dedupe([
  { code: 'school.read', name: 'Read school settings', category: 'school' },
  { code: 'school.manage', name: 'Manage school settings', category: 'school' },
  { code: 'roles.read', name: 'Read roles', category: 'roles' },
  { code: 'roles.manage', name: 'Manage roles', category: 'roles' },
  {
    code: 'permissions.read',
    name: 'Read permissions',
    category: 'permissions',
  },
  {
    code: 'permissions.manage',
    name: 'Manage permissions',
    category: 'permissions',
  },
  {
    code: 'tenant_users.read',
    name: 'Read tenant users',
    category: 'tenant_users',
  },
  {
    code: 'tenant_users.manage',
    name: 'Manage tenant users',
    category: 'tenant_users',
  },
  { code: 'students.read', name: 'Read students', category: 'students' },
  { code: 'students.manage', name: 'Manage students', category: 'students' },
  { code: 'teachers.read', name: 'Read teachers', category: 'teachers' },
  { code: 'teachers.manage', name: 'Manage teachers', category: 'teachers' },
  { code: 'attendance.read', name: 'Read attendance', category: 'attendance' },
  {
    code: 'attendance.manage',
    name: 'Manage attendance',
    category: 'attendance',
  },
  { code: 'fees.read', name: 'Read fees', category: 'fees' },
  { code: 'fees.manage', name: 'Manage fees', category: 'fees' },
  { code: 'fee_invoices.read', name: 'Read fee invoices', category: 'billing' },
  {
    code: 'fee_invoices.manage',
    name: 'Manage fee invoices',
    category: 'billing',
  },
  { code: 'fee_payments.read', name: 'Read fee payments', category: 'billing' },
  {
    code: 'fee_payments.manage',
    name: 'Manage fee payments',
    category: 'billing',
  },
  {
    code: 'payment_gateways.read',
    name: 'Read payment gateway configuration',
    category: 'billing',
  },
  {
    code: 'payment_gateways.manage',
    name: 'Manage payment gateway configuration',
    category: 'billing',
  },
  {
    code: 'integrations.read',
    name: 'Read API keys',
    category: 'integrations',
  },
  {
    code: 'integrations.manage',
    name: 'Manage API keys',
    category: 'integrations',
  },
  { code: 'credit_notes.read', name: 'Read credit notes', category: 'billing' },
  {
    code: 'credit_notes.manage',
    name: 'Manage credit notes',
    category: 'billing',
  },
  { code: 'exams.read', name: 'Read exams', category: 'exams' },
  { code: 'exams.manage', name: 'Manage exams', category: 'exams' },
  {
    code: 'scholarships.read',
    name: 'Read scholarships',
    category: 'scholarships',
  },
  {
    code: 'scholarships.manage',
    name: 'Manage scholarships',
    category: 'scholarships',
  },
  { code: 'reports.read', name: 'Read reports', category: 'reports' },
  {
    code: 'academic_years.read',
    name: 'Read academic years',
    category: 'academic',
  },
  {
    code: 'academic_years.manage',
    name: 'Manage academic years',
    category: 'academic',
  },
  {
    code: 'academic_calendar.read',
    name: 'Read academic calendar',
    category: 'academic',
  },
  {
    code: 'academic_calendar.manage',
    name: 'Manage academic calendar',
    category: 'academic',
  },
  {
    code: 'grading_scales.read',
    name: 'Read grading scales',
    category: 'academic',
  },
  {
    code: 'grading_scales.manage',
    name: 'Manage grading scales',
    category: 'academic',
  },
  { code: 'subjects.read', name: 'Read subjects', category: 'academic' },
  { code: 'subjects.manage', name: 'Manage subjects', category: 'academic' },
  {
    code: 'grade_subjects.read',
    name: 'Read grade subjects',
    category: 'academic',
  },
  {
    code: 'grade_subjects.manage',
    name: 'Manage grade subjects',
    category: 'academic',
  },
  { code: 'streams.read', name: 'Read streams', category: 'academic' },
  { code: 'streams.manage', name: 'Manage streams', category: 'academic' },
  {
    code: 'grade_levels.read',
    name: 'Read grade levels',
    category: 'academic',
  },
  {
    code: 'grade_levels.manage',
    name: 'Manage grade levels',
    category: 'academic',
  },
  { code: 'sections.read', name: 'Read sections', category: 'academic' },
  { code: 'sections.manage', name: 'Manage sections', category: 'academic' },
  { code: 'staff.read', name: 'Read staff profiles', category: 'staff' },
  { code: 'staff.manage', name: 'Manage staff profiles', category: 'staff' },
  {
    code: 'notifications.read',
    name: 'Read notifications',
    category: 'notifications',
  },
  {
    code: 'notifications.manage',
    name: 'Manage notifications',
    category: 'notifications',
  },
  { code: 'hostel.read', name: 'Read hostel', category: 'hostel' },
  { code: 'hostel.manage', name: 'Manage hostel', category: 'hostel' },
  { code: 'library.read', name: 'Read library', category: 'library' },
  { code: 'library.manage', name: 'Manage library', category: 'library' },
  { code: 'transport.read', name: 'Read transport', category: 'transport' },
  { code: 'transport.manage', name: 'Manage transport', category: 'transport' },
  { code: 'hr.read', name: 'Read HR data', category: 'hr' },
  { code: 'hr.manage', name: 'Manage HR data', category: 'hr' },
  {
    code: 'transfer_certificates.read',
    name: 'Read transfer certificates',
    category: 'certificates',
  },
  {
    code: 'transfer_certificates.manage',
    name: 'Manage transfer certificates',
    category: 'certificates',
  },
  {
    code: 'enrollments.read',
    name: 'Read enrollments',
    category: 'enrollments',
  },
  {
    code: 'enrollments.manage',
    name: 'Manage enrollments',
    category: 'enrollments',
  },
  { code: 'guardians.read', name: 'Read guardians', category: 'guardians' },
  { code: 'guardians.manage', name: 'Manage guardians', category: 'guardians' },
  { code: 'addresses.read', name: 'Read addresses', category: 'addresses' },
  { code: 'addresses.manage', name: 'Manage addresses', category: 'addresses' },
]);

const FEATURES = [
  {
    code: 'students.limit',
    name: 'Student limit',
    description: 'Maximum number of students',
    category: 'limits',
  },
  {
    code: 'teachers.limit',
    name: 'Teacher limit',
    description: 'Maximum number of teachers',
    category: 'limits',
  },
  {
    code: 'storage.gb',
    name: 'Storage (GB)',
    description: 'File storage quota',
    category: 'limits',
  },
  {
    code: 'sms.notifications',
    name: 'SMS notifications',
    description: 'Send SMS to parents',
    category: 'communication',
  },
  {
    code: 'email.notifications',
    name: 'Email notifications',
    description: 'Send email notifications',
    category: 'communication',
  },
  {
    code: 'report.cards',
    name: 'Report cards',
    description: 'Generate report cards',
    category: 'academics',
  },
  {
    code: 'attendance.tracking',
    name: 'Attendance tracking',
    description: 'Track student attendance',
    category: 'academics',
  },
  {
    code: 'fee.management',
    name: 'Fee management',
    description: 'Manage fees and invoices',
    category: 'finance',
  },
  {
    code: 'online.payments',
    name: 'Online payments',
    description: 'Accept online payments',
    category: 'finance',
  },
  {
    code: 'parent.portal',
    name: 'Parent portal',
    description: 'Parent self-service portal',
    category: 'portal',
  },
  {
    code: 'mobile.app',
    name: 'Mobile app access',
    description: 'Mobile app for parents/students',
    category: 'portal',
  },
  {
    code: 'custom.branding',
    name: 'Custom branding',
    description: 'Custom school branding',
    category: 'branding',
  },
  {
    code: 'priority.support',
    name: 'Priority support',
    description: 'Priority customer support',
    category: 'support',
  },
  {
    code: 'api.access',
    name: 'API access',
    description: 'Access to public API',
    category: 'integration',
  },
];

const PLANS = [
  {
    code: 'basic',
    name: 'Basic',
    description: 'For small schools',
    price: '1500.00',
    billingCycle: 'MONTHLY' as const,
    trialDays: 14,
    sortOrder: 1,
    features: {
      'students.limit': 200,
      'teachers.limit': 20,
      'storage.gb': 5,
      'email.notifications': null,
      'attendance.tracking': null,
      'fee.management': null,
    },
  },
  {
    code: 'standard',
    name: 'Standard',
    description: 'For medium schools',
    price: '3500.00',
    billingCycle: 'MONTHLY' as const,
    trialDays: 14,
    sortOrder: 2,
    features: {
      'students.limit': 800,
      'teachers.limit': 60,
      'storage.gb': 25,
      'sms.notifications': null,
      'email.notifications': null,
      'report.cards': null,
      'attendance.tracking': null,
      'fee.management': null,
      'parent.portal': null,
      'online.payments': null,
    },
  },
  {
    code: 'premium',
    name: 'Premium',
    description: 'For large schools',
    price: '7500.00',
    billingCycle: 'MONTHLY' as const,
    trialDays: 30,
    sortOrder: 3,
    features: {
      'students.limit': 3000,
      'teachers.limit': 200,
      'storage.gb': 100,
      'sms.notifications': null,
      'email.notifications': null,
      'report.cards': null,
      'attendance.tracking': null,
      'fee.management': null,
      'online.payments': null,
      'parent.portal': null,
      'mobile.app': null,
      'custom.branding': null,
      'priority.support': null,
    },
  },
  {
    code: 'enterprise-yearly',
    name: 'Enterprise Yearly',
    description: 'Annual plan for large institutions',
    price: '72000.00',
    billingCycle: 'YEARLY' as const,
    trialDays: 30,
    sortOrder: 4,
    features: {
      'students.limit': 10000,
      'teachers.limit': 500,
      'storage.gb': 500,
      'sms.notifications': null,
      'email.notifications': null,
      'report.cards': null,
      'attendance.tracking': null,
      'fee.management': null,
      'online.payments': null,
      'parent.portal': null,
      'mobile.app': null,
      'custom.branding': null,
      'priority.support': null,
      'api.access': null,
    },
  },
];

/**
 * Resolves the password for a seeded account.
 *
 * In production the seed refuses to invent a password; in development it
 * falls back to a documented one.
 */
function resolvePassword(envName: string, fallback: string): string {
  const value = process.env[envName];
  if (value && value.length >= 12) return value;
  if (isProduction) {
    throw new Error(
      `${envName} must be set to a value of at least 12 characters when seeding a production database`,
    );
  }
  return fallback;
}

async function main() {
  // ---------------------------------------------------------------------
  // Platform RBAC
  // ---------------------------------------------------------------------
  for (const p of PLATFORM_PERMISSIONS) {
    await prisma.platformPermission.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p,
    });
  }

  const permissionByCode = new Map(
    (await prisma.platformPermission.findMany()).map((p) => [p.code, p]),
  );

  for (const r of PLATFORM_ROLES) {
    const existing = await prisma.platformRole.findFirst({
      where: { name: r.name },
    });
    const role = existing
      ? await prisma.platformRole.update({
          where: { id: existing.id },
          data: { description: r.description, isSystem: r.isSystem },
        })
      : await prisma.platformRole.create({
          data: {
            name: r.name,
            description: r.description,
            isSystem: r.isSystem,
          },
        });

    await prisma.platformRolePermission.deleteMany({
      where: { roleId: role.id },
    });
    const rows = r.permissions
      .map((code) => permissionByCode.get(code)?.id)
      .filter((id): id is string => Boolean(id))
      .map((permissionId) => ({ roleId: role.id, permissionId }));
    if (rows.length) {
      await prisma.platformRolePermission.createMany({
        data: rows,
        skipDuplicates: true,
      });
    }
  }

  const superAdminRole = await prisma.platformRole.findFirst({
    where: { name: 'Super Admin' },
  });

  const superAdminEmail =
    process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@platform.local';
  const superAdminPassword = resolvePassword(
    'SUPER_ADMIN_PASSWORD',
    'ChangeMe123!',
  );

  const existingSuperAdmin = await prisma.platformUser.findUnique({
    where: { email: superAdminEmail },
  });
  // The password is only (re)set when the account is created, so re-seeding
  // does not silently reset a password an operator has changed.
  const superAdmin = existingSuperAdmin
    ? await prisma.platformUser.update({
        where: { id: existingSuperAdmin.id },
        data: { status: 'ACTIVE' },
      })
    : await prisma.platformUser.create({
        data: {
          email: superAdminEmail,
          passwordHash: await bcrypt.hash(superAdminPassword, 12),
          status: 'ACTIVE',
          firstNameEn: 'Platform',
          firstNameNe: 'प्लेटफर्म',
          lastNameEn: 'Super Admin',
          lastNameNe: 'सुपर एडमिन',
        },
      });

  if (superAdminRole) {
    await prisma.platformUserRole.upsert({
      where: {
        userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id },
      },
      update: {},
      create: { userId: superAdmin.id, roleId: superAdminRole.id },
    });
  }

  // ---------------------------------------------------------------------
  // Features and plans
  // ---------------------------------------------------------------------
  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { code: f.code },
      update: {
        name: f.name,
        description: f.description,
        category: f.category,
        isActive: true,
      },
      create: { ...f, isActive: true },
    });
  }

  const featureByCode = new Map(
    (await prisma.feature.findMany()).map((f) => [f.code, f]),
  );

  for (const plan of PLANS) {
    const savedPlan = await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: 'NPR',
        billingCycle: plan.billingCycle,
        trialDays: plan.trialDays,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
      create: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: 'NPR',
        billingCycle: plan.billingCycle,
        trialDays: plan.trialDays,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
    });

    await prisma.planFeature.deleteMany({ where: { planId: savedPlan.id } });
    const rows = Object.entries(plan.features)
      .map(([code, limit]) => {
        const feature = featureByCode.get(code);
        if (!feature) return null;
        return {
          planId: savedPlan.id,
          featureId: feature.id,
          isEnabled: true,
          limit: limit as number | null,
        };
      })
      .filter(Boolean) as any[];
    if (rows.length) {
      await prisma.planFeature.createMany({ data: rows, skipDuplicates: true });
    }
  }

  // ---------------------------------------------------------------------
  // Tenant permission catalogue
  // ---------------------------------------------------------------------
  for (const p of TENANT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p,
    });
  }

  const tenantUserEmail =
    process.env.TENANT_USER_EMAIL ?? 'tenantadmin@example.com';
  const tenantUserPassword = resolvePassword(
    'TENANT_USER_PASSWORD',
    'ChangeMe123!',
  );

  const existingTenantUser = await prisma.user.findUnique({
    where: { email: tenantUserEmail },
  });
  const tenantUser = existingTenantUser
    ? await prisma.user.update({
        where: { id: existingTenantUser.id },
        data: { status: 'ACTIVE' },
      })
    : await prisma.user.create({
        data: {
          email: tenantUserEmail,
          passwordHash: await bcrypt.hash(tenantUserPassword, 12),
          status: 'ACTIVE',
          firstNameEn: 'Tenant',
          firstNameNe: 'टेनेन्ट',
          lastNameEn: 'Admin',
          lastNameNe: 'एडमिन',
        },
      });

  // ---------------------------------------------------------------------
  // Demo tenant
  // ---------------------------------------------------------------------
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo-school-001' },
    update: { deletedAt: null, status: 'ACTIVE' },
    create: {
      nameEn: 'Demo School',
      nameNe: 'डेमो विद्यालय',
      subdomain: 'demo-school-001',
      iemisCode: '111111111',
      schoolCode: 'DEMO-001',
      registrationNumber: 'REG-DEMO',
      panVatNumber: '999888777',
      schoolType: 'INSTITUTIONAL_PRIVATE',
      provinceCode: '3',
      provinceNe: 'बागमती प्रदेश',
      provinceEn: 'Bagmati Province',
      districtCode: '27',
      districtNe: 'काठमाडौं',
      districtEn: 'Kathmandu',
      municipalityCode: '2701',
      municipalityNe: 'काठमाडौं महानगरपालिका',
      municipalityEn: 'Kathmandu Metropolitan City',
      wardNumber: 1,
      toleEn: 'New Baneshwor',
      toleNe: 'नयाँ बानेश्वर',
      addressEn: 'Kathmandu, Nepal',
      addressNe: 'काठमाडौं, नेपाल',
      phone: '+977-1-4000000',
      email: 'info@demo-school.edu.np',
      establishedDateAd: new Date('2020-01-01T00:00:00.000Z'),
      establishedDateBs: '2076-09-16',
      motoEn: 'Knowledge is power',
      motoNe: 'ज्ञान नै शक्ति हो',
      latitude: 27.7172,
      longitude: 85.324,
      status: 'ACTIVE',
      createdByPlatformUserId: superAdmin.id,
    },
  });

  // ---------------------------------------------------------------------
  // Subscription (so the plan limits apply to the demo tenant)
  // ---------------------------------------------------------------------
  const standardPlan = await prisma.subscriptionPlan.findUnique({
    where: { code: 'standard' },
  });
  if (standardPlan) {
    const existingSubscription = await prisma.subscription.findFirst({
      where: { tenantId: demoTenant.id, planId: standardPlan.id },
    });
    if (!existingSubscription) {
      await prisma.subscription.create({
        data: {
          tenantId: demoTenant.id,
          planId: standardPlan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 86_400_000),
          autoRenew: true,
        },
      });
    } else {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: { status: 'ACTIVE' },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Academic structure
  // ---------------------------------------------------------------------
  const academicYear = await prisma.academicYear.upsert({
    where: { id: await findOrCreateAcademicYearId(demoTenant.id) },
    update: { isCurrent: true, deletedAt: null },
    create: {
      tenantId: demoTenant.id,
      name: '2081/82',
      bsYear: 2081,
      startDateAd: new Date('2024-04-13T00:00:00.000Z'),
      endDateAd: new Date('2025-04-12T00:00:00.000Z'),
      startDateBs: '2081-01-01',
      endDateBs: '2081-12-30',
      isCurrent: true,
    },
  });

  const fiscalYear = await prisma.fiscalYear.upsert({
    where: { id: await findOrCreateFiscalYearId(demoTenant.id) },
    update: { isActive: true, deletedAt: null },
    create: {
      tenantId: demoTenant.id,
      name: 'FY 2081/82',
      startDateAd: new Date('2024-07-16T00:00:00.000Z'),
      startDateBs: '2081-04-01',
      endDateAd: new Date('2025-08-16T00:00:00.000Z'),
      endDateBs: '2082-04-31',
      isActive: true,
    },
  });

  const stream = await upsertByName(
    () =>
      prisma.stream.findFirst({
        where: { tenantId: demoTenant.id, code: 'SCIENCE' },
      }),
    () =>
      prisma.stream.create({
        data: {
          tenantId: demoTenant.id,
          code: 'SCIENCE',
          nameEn: 'Science',
          nameNe: 'विज्ञान',
        },
      }),
  );

  const gradeLevel = await upsertByName(
    () =>
      prisma.gradeLevel.findFirst({
        where: { tenantId: demoTenant.id, nameEn: 'Grade 8' },
      }),
    () =>
      prisma.gradeLevel.create({
        data: {
          tenantId: demoTenant.id,
          streamId: stream.id,
          nameEn: 'Grade 8',
          nameNe: 'कक्षा ८',
          iemisGradeCode: '8',
          gradeNumber: 8,
          evaluationType: 'PERCENTAGE',
        },
      }),
  );

  const section = await upsertByName(
    () =>
      prisma.section.findFirst({
        where: {
          tenantId: demoTenant.id,
          gradeLevelId: gradeLevel.id,
          academicYearId: academicYear.id,
          nameEn: 'A',
        },
      }),
    () =>
      prisma.section.create({
        data: {
          tenantId: demoTenant.id,
          gradeLevelId: gradeLevel.id,
          academicYearId: academicYear.id,
          nameEn: 'A',
          nameNe: 'क',
          capacity: 40,
        },
      }),
  );

  const subjectSpecs = [
    {
      code: 'NEP',
      nameEn: 'Nepali',
      nameNe: 'नेपाली',
      theory: 100,
      internal: 40,
      credit: 5,
    },
    {
      code: 'ENG',
      nameEn: 'English',
      nameNe: 'अङ्ग्रेजी',
      theory: 100,
      internal: 40,
      credit: 5,
    },
    {
      code: 'MATH',
      nameEn: 'Mathematics',
      nameNe: 'गणित',
      theory: 100,
      internal: 40,
      credit: 5,
    },
    {
      code: 'SCI',
      nameEn: 'Science',
      nameNe: 'विज्ञान',
      theory: 100,
      internal: 40,
      credit: 5,
    },
    {
      code: 'SOC',
      nameEn: 'Social Studies',
      nameNe: 'सामाजिक अध्ययन',
      theory: 100,
      internal: 40,
      credit: 4,
    },
  ];

  const subjects: Record<string, { id: string }> = {};
  for (const spec of subjectSpecs) {
    const subject = await upsertByName(
      () =>
        prisma.subject.findFirst({
          where: { tenantId: demoTenant.id, code: spec.code },
        }),
      () =>
        prisma.subject.create({
          data: {
            tenantId: demoTenant.id,
            code: spec.code,
            nameEn: spec.nameEn,
            nameNe: spec.nameNe,
          },
        }),
    );
    subjects[spec.code] = subject;

    const existingGradeSubject = await prisma.gradeSubject.findFirst({
      where: {
        tenantId: demoTenant.id,
        gradeLevelId: gradeLevel.id,
        subjectId: subject.id,
      },
    });
    if (!existingGradeSubject) {
      await prisma.gradeSubject.create({
        data: {
          tenantId: demoTenant.id,
          gradeLevelId: gradeLevel.id,
          subjectId: subject.id,
          creditHours: spec.credit,
          theoryCreditHours: spec.credit,
          internalCreditHours: 0,
          theoryFullMarks: spec.theory,
          theoryPassMarks: 35,
          internalFullMarks: spec.internal,
          internalPassMarks: 14,
        },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Students and enrolment
  // ---------------------------------------------------------------------
  const studentSpecs = [
    {
      admissionNo: '2081/001',
      firstNameEn: 'Ram',
      firstNameNe: 'राम',
      middleNameEn: 'Bahadur',
      middleNameNe: 'बहादुर',
      lastNameEn: 'Sharma',
      lastNameNe: 'शर्मा',
    },
    {
      admissionNo: '2081/002',
      firstNameEn: 'Sita',
      firstNameNe: 'सीता',
      lastNameEn: 'Adhikari',
      lastNameNe: 'अधिकारी',
    },
    {
      admissionNo: '2081/003',
      firstNameEn: 'Bikash',
      firstNameNe: 'विकास',
      lastNameEn: 'Thapa',
      lastNameNe: 'थापा',
    },
  ];

  const enrollments: string[] = [];
  for (const [index, spec] of studentSpecs.entries()) {
    const existingStudent = await prisma.student.findFirst({
      where: { tenantId: demoTenant.id, admissionNo: spec.admissionNo },
    });
    const student =
      existingStudent ??
      (await prisma.student.create({
        data: {
          tenantId: demoTenant.id,
          admissionNo: spec.admissionNo,
          firstNameEn: spec.firstNameEn,
          firstNameNe: spec.firstNameNe,
          middleNameEn: spec.middleNameEn ?? null,
          middleNameNe: spec.middleNameNe ?? null,
          lastNameEn: spec.lastNameEn,
          lastNameNe: spec.lastNameNe,
          dobAd: new Date('2011-01-01T00:00:00.000Z'),
          dobBs: '2067-09-17',
          gender: index === 1 ? 'FEMALE' : 'MALE',
          casteEthnicityCode: '1',
          casteEthnicity: 'Kshatriya',
          motherTongue: 'Nepali',
          birthCertificateNo: `BC-${spec.admissionNo}`,
          nationalIdNin: `NIN-${spec.admissionNo}`,
        },
      }));

    const existingEnrollment = await prisma.studentEnrollment.findFirst({
      where: {
        tenantId: demoTenant.id,
        studentId: student.id,
        academicYearId: academicYear.id,
      },
    });
    const enrollment =
      existingEnrollment ??
      (await prisma.studentEnrollment.create({
        data: {
          tenantId: demoTenant.id,
          studentId: student.id,
          academicYearId: academicYear.id,
          gradeLevelId: gradeLevel.id,
          sectionId: section.id,
          rollNo: index + 1,
          enrollmentStatus: 'NEW_ADMISSION',
        },
      }));
    enrollments.push(enrollment.id);
  }

  // ---------------------------------------------------------------------
  // Fees
  // ---------------------------------------------------------------------
  const feeHeads = [
    {
      nameEn: 'Tuition Fee',
      nameNe: 'शिक्षण शुल्क',
      frequency: 'ANNUAL' as const,
      amount: '48000.00',
      months: [] as number[],
    },
    {
      nameEn: 'Monthly Tuition',
      nameNe: 'मासिक शिक्षण शुल्क',
      frequency: 'MONTHLY_BS' as const,
      amount: '4000.00',
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      nameEn: 'Exam Fee',
      nameNe: 'परीक्षा शुल्क',
      frequency: 'ONE_TIME' as const,
      amount: '1500.00',
      months: [] as number[],
    },
    {
      nameEn: 'Library Fee',
      nameNe: 'पुस्तकालय शुल्क',
      frequency: 'ANNUAL' as const,
      amount: '1000.00',
      months: [] as number[],
    },
  ];

  for (const spec of feeHeads) {
    const existing = await prisma.feeHead.findFirst({
      where: { tenantId: demoTenant.id, nameEn: spec.nameEn },
    });
    const feeHead =
      existing ??
      (await prisma.feeHead.create({
        data: {
          tenantId: demoTenant.id,
          nameEn: spec.nameEn,
          nameNe: spec.nameNe,
          frequency: spec.frequency,
          isTaxable: false,
        },
      }));

    const existingStructure = await prisma.classFeeStructure.findFirst({
      where: {
        tenantId: demoTenant.id,
        academicYearId: academicYear.id,
        gradeLevelId: gradeLevel.id,
        feeHeadId: feeHead.id,
      },
    });
    if (!existingStructure) {
      await prisma.classFeeStructure.create({
        data: {
          tenantId: demoTenant.id,
          academicYearId: academicYear.id,
          gradeLevelId: gradeLevel.id,
          feeHeadId: feeHead.id,
          fiscalYearId: fiscalYear.id,
          amount: spec.amount,
          applicableBsMonths: spec.months,
        },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Grading scale
  // ---------------------------------------------------------------------
  let gradingScale = await prisma.gradingScale.findFirst({
    where: { tenantId: demoTenant.id, name: 'NEB Grading Scale' },
  });
  if (!gradingScale) {
    gradingScale = await prisma.gradingScale.create({
      data: { tenantId: demoTenant.id, name: 'NEB Grading Scale' },
    });
    await prisma.gradingScaleItem.createMany({
      data: [
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 90,
          maxPercentage: 100,
          letterGrade: 'A+',
          gradePoint: '4.00',
          descriptorEn: 'Excellent',
          descriptorNp: 'उत्कृष्ट',
        },
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 80,
          maxPercentage: 89.99,
          letterGrade: 'A',
          gradePoint: '3.60',
          descriptorEn: 'Very Good',
          descriptorNp: 'धेरै राम्रो',
        },
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 70,
          maxPercentage: 79.99,
          letterGrade: 'B',
          gradePoint: '3.20',
          descriptorEn: 'Good',
          descriptorNp: 'राम्रो',
        },
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 60,
          maxPercentage: 69.99,
          letterGrade: 'C',
          gradePoint: '2.80',
          descriptorEn: 'Satisfactory',
          descriptorNp: ' satisfactory',
        },
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 40,
          maxPercentage: 59.99,
          letterGrade: 'D',
          gradePoint: '2.00',
          descriptorEn: 'Partially Satisfactory',
          descriptorNp: ' आंशिक रूपमा सन्तोषजनक',
        },
        {
          gradingScaleId: gradingScale.id,
          minPercentage: 0,
          maxPercentage: 39.99,
          letterGrade: 'E',
          gradePoint: '1.00',
          descriptorEn: 'Unsatisfactory',
          descriptorNp: 'असन्तोषजनक',
        },
      ],
    });
  }

  // ---------------------------------------------------------------------
  // Roles and the tenant administrator
  // ---------------------------------------------------------------------
  const allTenantPermissions = await prisma.permission.findMany();
  const permissionIdByCode = new Map(
    allTenantPermissions.map((p) => [p.code, p.id]),
  );

  const tenantRoleSpecs = [
    {
      name: 'School Admin',
      description: 'Full access for the school administrator',
      codes: TENANT_PERMISSIONS.map((p) => p.code),
    },
    {
      name: 'Teacher',
      description: 'Teaching staff',
      codes: [
        'students.read',
        'attendance.read',
        'attendance.manage',
        'exams.read',
        'exams.manage',
        'sections.read',
        'grade_levels.read',
        'subjects.read',
        'grade_subjects.read',
        'staff.read',
        'academic_years.read',
        'notifications.read',
      ],
    },
    {
      name: 'Accountant',
      description: 'Fee collection',
      codes: [
        'students.read',
        'enrollments.read',
        'fees.read',
        'fees.manage',
        'fee_invoices.read',
        'fee_invoices.manage',
        'fee_payments.read',
        'fee_payments.manage',
        'payment_gateways.read',
        'payment_gateways.manage',
        'integrations.read',
        'credit_notes.read',
        'scholarships.read',
        'guardians.read',
        'notifications.read',
      ],
    },
    {
      name: 'Parent',
      description: 'Parent portal access',
      codes: ['students.read', 'notifications.read', 'fee_invoices.read'],
    },
  ];

  for (const spec of tenantRoleSpecs) {
    let role = await prisma.role.findFirst({
      where: { tenantId: demoTenant.id, name: spec.name },
    });
    if (!role) {
      role = await prisma.role.create({
        data: {
          tenantId: demoTenant.id,
          name: spec.name,
          description: spec.description,
          isSystem: true,
        },
      });
    }
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    const rows = spec.codes
      .map((code) => permissionIdByCode.get(code))
      .filter((id): id is string => Boolean(id))
      .map((permissionId) => ({ roleId: role.id, permissionId }));
    if (rows.length) {
      await prisma.rolePermission.createMany({
        data: rows,
        skipDuplicates: true,
      });
    }
  }

  const schoolAdminRole = await prisma.role.findFirst({
    where: { tenantId: demoTenant.id, name: 'School Admin' },
  });

  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: { tenantId: demoTenant.id, userId: tenantUser.id },
    },
    update: { status: 'ACTIVE', leftAt: null },
    create: { tenantId: demoTenant.id, userId: tenantUser.id, isPrimary: true },
  });

  if (schoolAdminRole) {
    const membership = await prisma.tenantUser.findUnique({
      where: {
        tenantId_userId: { tenantId: demoTenant.id, userId: tenantUser.id },
      },
    });
    if (membership) {
      await prisma.tenantUserRole.upsert({
        where: {
          tenantUserId_roleId: {
            tenantUserId: membership.id,
            roleId: schoolAdminRole.id,
          },
        },
        update: {},
        create: { tenantUserId: membership.id, roleId: schoolAdminRole.id },
      });
    }
  }

  // ---------------------------------------------------------------------
  // Welcome notifications (idempotent)
  // ---------------------------------------------------------------------
  await prisma.notification.deleteMany({
    where: {
      recipientType: 'PLATFORM_USER',
      recipientId: superAdmin.id,
      type: 'WELCOME',
    },
  });
  await prisma.notification.createMany({
    data: [
      {
        recipientType: 'PLATFORM_USER',
        recipientId: superAdmin.id,
        title: 'Welcome to School SaaS',
        message: 'Your platform is ready. Start by onboarding schools.',
        type: 'WELCOME',
        isRead: false,
      },
      {
        recipientType: 'PLATFORM_USER',
        recipientId: superAdmin.id,
        title: 'New tenant created',
        message: 'Demo School has been created.',
        type: 'WELCOME',
        isRead: false,
      },
    ],
  });

  console.log('Seed complete.');
  console.log(`  Platform super admin : ${superAdminEmail}`);
  console.log(`  Tenant school admin  : ${tenantUserEmail}`);
  console.log(`  Demo tenant id       : ${demoTenant.id}`);
  console.log(`  Demo tenant subdomain: ${demoTenant.subdomain}`);
  if (!isProduction) {
    console.log('');
    console.log(
      '  Development passwords (set SUPER_ADMIN_PASSWORD / TENANT_USER_PASSWORD to change):',
    );
    console.log(`    platform : ${superAdminPassword}`);
    console.log(`    tenant   : ${tenantUserPassword}`);
  }
}

/** Finds an academic year by name, creating a throwaway id if it is absent. */
async function findOrCreateAcademicYearId(tenantId: string): Promise<string> {
  const existing = await prisma.academicYear.findFirst({
    where: { tenantId, name: '2081/82' },
  });
  if (existing) return existing.id;
  return '00000000-0000-4000-8000-000000000001';
}

async function findOrCreateFiscalYearId(tenantId: string): Promise<string> {
  const existing = await prisma.fiscalYear.findFirst({
    where: { tenantId, name: 'FY 2081/82' },
  });
  if (existing) return existing.id;
  return '00000000-0000-4000-8000-000000000002';
}

/** Returns the existing record or creates it. */
async function upsertByName<T extends { id: string }>(
  find: () => Promise<T | null>,
  create: () => Promise<T>,
): Promise<T> {
  const existing = await find();
  if (existing) return existing;
  return create();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
