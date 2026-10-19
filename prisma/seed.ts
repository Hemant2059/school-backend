import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PERMISSIONS: { code: string; name: string; category: string; description?: string }[] = [
  { code: "schools.read", name: "Read schools", category: "schools" },
  { code: "schools.create", name: "Create schools", category: "schools" },
  { code: "schools.update", name: "Update schools", category: "schools" },
  { code: "schools.suspend", name: "Suspend schools", category: "schools" },
  { code: "schools.delete", name: "Delete schools", category: "schools" },
  { code: "subscriptions.read", name: "Read subscriptions", category: "subscriptions" },
  { code: "subscriptions.manage", name: "Manage subscriptions", category: "subscriptions" },
  { code: "subscriptions.cancel", name: "Cancel subscriptions", category: "subscriptions" },
  { code: "platform_users.read", name: "Read platform users", category: "platform_users" },
  { code: "platform_users.create", name: "Create platform users", category: "platform_users" },
  { code: "platform_users.update", name: "Update platform users", category: "platform_users" },
  { code: "platform_users.delete", name: "Delete platform users", category: "platform_users" },
  { code: "roles.read", name: "Read roles", category: "roles" },
  { code: "roles.manage", name: "Manage roles", category: "roles" },
  { code: "permissions.read", name: "Read permissions", category: "permissions" },
  { code: "permissions.manage", name: "Manage permissions", category: "permissions" },
  { code: "support.read", name: "Read support cases", category: "support" },
  { code: "support.manage", name: "Manage support cases", category: "support" },
  { code: "support.impersonate", name: "Impersonate tenant users", category: "support" },
  { code: "billing.read", name: "Read billing", category: "billing" },
  { code: "billing.manage", name: "Manage billing", category: "billing" },
  { code: "audit.read", name: "Read audit logs", category: "audit" },
  { code: "settings.read", name: "Read settings", category: "settings" },
  { code: "settings.manage", name: "Manage settings", category: "settings" },
  { code: "organizations.read", name: "Read organizations", category: "organizations" },
  { code: "organizations.manage", name: "Manage organizations", category: "organizations" },
  { code: "tenants.read", name: "Read tenants", category: "tenants" },
  { code: "tenants.manage", name: "Manage tenants", category: "tenants" },
  { code: "tenant_users.read", name: "Read tenant users", category: "tenant_users" },
  { code: "tenant_users.manage", name: "Manage tenant users", category: "tenant_users" },
  { code: "academic_years.read", name: "Read academic years", category: "academic" },
  { code: "academic_years.manage", name: "Manage academic years", category: "academic" },
  { code: "academic_calendar.read", name: "Read academic calendar", category: "academic" },
  { code: "academic_calendar.manage", name: "Manage academic calendar", category: "academic" },
  { code: "exams.read", name: "Read exams", category: "exams" },
  { code: "exams.manage", name: "Manage exams", category: "exams" },
  { code: "fees.read", name: "Read fees", category: "fees" },
  { code: "fees.manage", name: "Manage fees", category: "fees" },
  { code: "fee_invoices.read", name: "Read fee invoices", category: "billing" },
  { code: "fee_invoices.manage", name: "Manage fee invoices", category: "billing" },
  { code: "fee_payments.read", name: "Read fee payments", category: "billing" },
  { code: "fee_payments.manage", name: "Manage fee payments", category: "billing" },
  { code: "credit_notes.read", name: "Read credit notes", category: "billing" },
  { code: "credit_notes.manage", name: "Manage credit notes", category: "billing" },
  { code: "scholarships.read", name: "Read scholarships", category: "scholarships" },
  { code: "scholarships.manage", name: "Manage scholarships", category: "scholarships" },
  { code: "grading_scales.read", name: "Read grading scales", category: "academic" },
  { code: "grading_scales.manage", name: "Manage grading scales", category: "academic" },
  { code: "streams.read", name: "Read streams", category: "academic" },
  { code: "streams.manage", name: "Manage streams", category: "academic" },
  { code: "grade_levels.read", name: "Read grade levels", category: "academic" },
  { code: "grade_levels.manage", name: "Manage grade levels", category: "academic" },
  { code: "sections.read", name: "Read sections", category: "academic" },
  { code: "sections.manage", name: "Manage sections", category: "academic" },
  { code: "staff.read", name: "Read staff profiles", category: "staff" },
  { code: "staff.manage", name: "Manage staff profiles", category: "staff" },
  { code: "notifications.read", name: "Read notifications", category: "notifications" },
  { code: "notifications.manage", name: "Manage notifications", category: "notifications" },
  { code: "hostel.read", name: "Read hostel", category: "hostel" },
  { code: "hostel.manage", name: "Manage hostel", category: "hostel" },
  { code: "hostel.read", name: "Read hostel", category: "hostel" },
  { code: "hostel.manage", name: "Manage hostel", category: "hostel" },
  { code: "library.read", name: "Read library", category: "library" },
  { code: "library.manage", name: "Manage library", category: "library" },
  { code: "library.read", name: "Read library", category: "library" },
  { code: "library.manage", name: "Manage library", category: "library" },
  { code: "transport.read", name: "Read transport", category: "transport" },
  { code: "transport.manage", name: "Manage transport", category: "transport" },
  { code: "hr.read", name: "Read HR data", category: "hr" },
  { code: "hr.manage", name: "Manage HR data", category: "hr" },
  { code: "subjects.read", name: "Read subjects", category: "academic" },
  { code: "subjects.manage", name: "Manage subjects", category: "academic" },
  { code: "grade_subjects.read", name: "Read grade subjects", category: "academic" },
  { code: "grade_subjects.manage", name: "Manage grade subjects", category: "academic" },
  { code: "students.read", name: "Read students", category: "students" },
  { code: "students.manage", name: "Manage students", category: "students" },
  { code: "transfer_certificates.read", name: "Read transfer certificates", category: "certificates" },
  { code: "transfer_certificates.manage", name: "Manage transfer certificates", category: "certificates" },
  { code: "enrollments.read", name: "Read enrollments", category: "enrollments" },
  { code: "enrollments.manage", name: "Manage enrollments", category: "enrollments" },
  { code: "guardians.read", name: "Read guardians", category: "guardians" },
  { code: "guardians.manage", name: "Manage guardians", category: "guardians" },
  { code: "addresses.read", name: "Read addresses", category: "addresses" },
  { code: "addresses.manage", name: "Manage addresses", category: "addresses" },
];
const ROLES: { name: string; description: string; isSystem: boolean; permissions: string[] }[] = [
  {
    name: "Super Admin",
    description: "Full access to the platform.",
    isSystem: true,
    permissions: PERMISSIONS.map((p) => p.code),
  },
  {
    name: "Platform Admin",
    description: "Manages schools, subscriptions and platform users.",
    isSystem: true,
    permissions: PERMISSIONS.filter((p) => p.code !== "schools.delete").map((p) => p.code),
  },
  {
    name: "Support Engineer",
    description: "Handles support cases and can impersonate tenant users.",
    isSystem: true,
    permissions: ["schools.read", "support.read", "support.manage", "support.impersonate", "audit.read"],
  },
  {
    name: "Billing Admin",
    description: "Manages billing and subscriptions.",
    isSystem: true,
    permissions: ["subscriptions.read", "subscriptions.manage", "subscriptions.cancel", "billing.read", "billing.manage", "audit.read"],
  },
  {
    name: "Sales Partner",
    description: "Onboards schools in an assigned region.",
    isSystem: true,
    permissions: ["schools.read", "schools.create", "subscriptions.read"],
  },
  {
    name: "Auditor",
    description: "Read-only access to platform data.",
    isSystem: true,
    permissions: PERMISSIONS.filter((p) => p.code.endsWith(".read") || p.code === "audit.read").map((p) => p.code),
  },
];

async function main() {
  for (const p of PERMISSIONS) {
    await prisma.platformPermission.upsert({
      where: { code: p.code },
      update: { name: p.name, description: p.description, category: p.category },
      create: p,
    });
  }

  const permissionByCode = new Map(
    (await prisma.platformPermission.findMany()).map((p) => [p.code, p]),
  );

  for (const r of ROLES) {
    let role = await prisma.platformRole.findFirst({ where: { name: r.name } });
    if (!role) {
      role = await prisma.platformRole.create({ data: { name: r.name, description: r.description, isSystem: r.isSystem } });
    } else {
      role = await prisma.platformRole.update({ where: { id: role.id }, data: { description: r.description, isSystem: r.isSystem } });
    }

    await prisma.platformRolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.platformRolePermission.createMany({
      data: r.permissions
        .map((code) => permissionByCode.get(code)?.id)
        .filter((id): id is string => Boolean(id))
        .map((permissionId) => ({ roleId: role.id, permissionId })),
      skipDuplicates: true,
    });
  }

  const superAdminRole = await prisma.platformRole.findFirst({ where: { name: "Super Admin" } });
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@platform.local";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(superAdminPassword, 10);

  const superAdmin = await prisma.platformUser.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash, status: "ACTIVE", firstNameEn: "Platform", firstNameNe: "प्लेटफर्म", lastNameEn: "Super Admin", lastNameNe: "सुपर एडमिन" },
    create: {
      email: superAdminEmail,
      firstNameEn: "Platform",
      firstNameNe: "प्लेटफर्म",
      lastNameEn: "Super Admin",
      lastNameNe: "सुपर एडमिन",
      passwordHash,
      status: "ACTIVE",
    },
  });

  if (superAdminRole) {
    await prisma.platformUserRole.upsert({
      where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: superAdmin.id, roleId: superAdminRole.id },
    });
  }

  const FEATURES = [
    { code: "students.limit", name: "Student limit", description: "Maximum number of students", category: "limits" },
    { code: "teachers.limit", name: "Teacher limit", description: "Maximum number of teachers", category: "limits" },
    { code: "storage.gb", name: "Storage (GB)", description: "File storage quota", category: "limits" },
    { code: "sms.notifications", name: "SMS notifications", description: "Send SMS to parents", category: "communication" },
    { code: "email.notifications", name: "Email notifications", description: "Send email notifications", category: "communication" },
    { code: "report.cards", name: "Report cards", description: "Generate report cards", category: "academics" },
    { code: "attendance.tracking", name: "Attendance tracking", description: "Track student attendance", category: "academics" },
    { code: "fee.management", name: "Fee management", description: "Manage fees and invoices", category: "finance" },
    { code: "online.payments", name: "Online payments", description: "Accept online payments", category: "finance" },
    { code: "parent.portal", name: "Parent portal", description: "Parent self-service portal", category: "portal" },
    { code: "mobile.app", name: "Mobile app access", description: "Mobile app for parents/students", category: "portal" },
    { code: "custom.branding", name: "Custom branding", description: "Custom school branding", category: "branding" },
    { code: "priority.support", name: "Priority support", description: "Priority customer support", category: "support" },
    { code: "api.access", name: "API access", description: "Access to public API", category: "integration" },
  ];

  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { code: f.code },
      update: { name: f.name, description: f.description, category: f.category, isActive: true },
      create: { code: f.code, name: f.name, description: f.description, category: f.category, isActive: true },
    });
  }

  const featureByCode = new Map((await prisma.feature.findMany()).map((f) => [f.code, f]));

  const PLANS = [
    {
      code: "basic", name: "Basic", description: "For small schools", price: "1500.00", billingCycle: "MONTHLY", trialDays: 14, sortOrder: 1,
      features: {
        "students.limit": 200, "teachers.limit": 20, "storage.gb": 5,
        "email.notifications": null, "attendance.tracking": null, "fee.management": null,
      },
    },
    {
      code: "standard", name: "Standard", description: "For medium schools", price: "3500.00", billingCycle: "MONTHLY", trialDays: 14, sortOrder: 2,
      features: {
        "students.limit": 800, "teachers.limit": 60, "storage.gb": 25,
        "sms.notifications": null, "email.notifications": null, "report.cards": null,
        "attendance.tracking": null, "fee.management": null, "parent.portal": null,
      },
    },
    {
      code: "premium", name: "Premium", description: "For large schools", price: "7500.00", billingCycle: "MONTHLY", trialDays: 30, sortOrder: 3,
      features: {
        "students.limit": 3000, "teachers.limit": 200, "storage.gb": 100,
        "sms.notifications": null, "email.notifications": null, "report.cards": null,
        "attendance.tracking": null, "fee.management": null, "online.payments": null,
        "parent.portal": null, "mobile.app": null, "custom.branding": null, "priority.support": null,
      },
    },
    {
      code: "enterprise-yearly", name: "Enterprise Yearly", description: "Annual plan for large institutions", price: "72000.00", billingCycle: "YEARLY", trialDays: 30, sortOrder: 4,
      features: {
        "students.limit": 10000, "teachers.limit": 500, "storage.gb": 500,
        "sms.notifications": null, "email.notifications": null, "report.cards": null,
        "attendance.tracking": null, "fee.management": null, "online.payments": null,
        "parent.portal": null, "mobile.app": null, "custom.branding": null, "priority.support": null, "api.access": null,
      },
    },
  ];

  for (const plan of PLANS) {
    const savedPlan = await prisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        billingCycle: plan.billingCycle as any,
        trialDays: plan.trialDays,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
      create: {
        code: plan.code,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: "NPR",
        billingCycle: plan.billingCycle as any,
        trialDays: plan.trialDays,
        sortOrder: plan.sortOrder,
        isActive: true,
      },
    });

    await prisma.planFeature.deleteMany({ where: { planId: savedPlan.id } });
    const rows = Object.entries(plan.features).map(([code, limit]) => {
      const feature = featureByCode.get(code);
      if (!feature) return null;
      return { planId: savedPlan.id, featureId: feature.id, isEnabled: true, limit: limit as number | null };
    }).filter(Boolean) as any[];
    if (rows.length) {
      await prisma.planFeature.createMany({ data: rows, skipDuplicates: true });
    }
  }

  const TENANT_PERMISSIONS = [
    { code: "roles.read", name: "Read roles", category: "roles" },
    { code: "roles.manage", name: "Manage roles", category: "roles" },
    { code: "permissions.read", name: "Read permissions", category: "permissions" },
    { code: "permissions.manage", name: "Manage permissions", category: "permissions" },
    { code: "tenant_users.read", name: "Read tenant users", category: "tenant_users" },
    { code: "tenant_users.manage", name: "Manage tenant users", category: "tenant_users" },
    { code: "students.read", name: "Read students", category: "students" },
    { code: "students.create", name: "Create students", category: "students" },
    { code: "students.update", name: "Update students", category: "students" },
    { code: "students.delete", name: "Delete students", category: "students" },
    { code: "teachers.read", name: "Read teachers", category: "teachers" },
    { code: "teachers.create", name: "Create teachers", category: "teachers" },
    { code: "teachers.update", name: "Update teachers", category: "teachers" },
    { code: "teachers.delete", name: "Delete teachers", category: "teachers" },
    { code: "attendance.read", name: "Read attendance", category: "attendance" },
    { code: "attendance.manage", name: "Manage attendance", category: "attendance" },
    { code: "fees.read", name: "Read fees", category: "fees" },
    { code: "fees.manage", name: "Manage fees", category: "fees" },
  { code: "fee_invoices.read", name: "Read fee invoices", category: "billing" },
  { code: "fee_invoices.manage", name: "Manage fee invoices", category: "billing" },
  { code: "fee_payments.read", name: "Read fee payments", category: "billing" },
  { code: "fee_payments.manage", name: "Manage fee payments", category: "billing" },
  { code: "credit_notes.read", name: "Read credit notes", category: "billing" },
  { code: "credit_notes.manage", name: "Manage credit notes", category: "billing" },
    { code: "exams.read", name: "Read exams", category: "exams" },
    { code: "exams.manage", name: "Manage exams", category: "exams" },
  { code: "fees.read", name: "Read fees", category: "fees" },
  { code: "fees.manage", name: "Manage fees", category: "fees" },
  { code: "fee_invoices.read", name: "Read fee invoices", category: "billing" },
  { code: "fee_invoices.manage", name: "Manage fee invoices", category: "billing" },
  { code: "fee_payments.read", name: "Read fee payments", category: "billing" },
  { code: "fee_payments.manage", name: "Manage fee payments", category: "billing" },
  { code: "credit_notes.read", name: "Read credit notes", category: "billing" },
  { code: "credit_notes.manage", name: "Manage credit notes", category: "billing" },
  { code: "scholarships.read", name: "Read scholarships", category: "scholarships" },
  { code: "scholarships.manage", name: "Manage scholarships", category: "scholarships" },
    { code: "reports.read", name: "Read reports", category: "reports" },
    { code: "academic_years.read", name: "Read academic years", category: "academic" },
    { code: "academic_years.manage", name: "Manage academic years", category: "academic" },
    { code: "academic_calendar.read", name: "Read academic calendar", category: "academic" },
    { code: "academic_calendar.manage", name: "Manage academic calendar", category: "academic" },
    { code: "grading_scales.read", name: "Read grading scales", category: "academic" },
    { code: "grading_scales.manage", name: "Manage grading scales", category: "academic" },
    { code: "subjects.read", name: "Read subjects", category: "academic" },
    { code: "subjects.manage", name: "Manage subjects", category: "academic" },
    { code: "grade_subjects.read", name: "Read grade subjects", category: "academic" },
    { code: "grade_subjects.manage", name: "Manage grade subjects", category: "academic" },
    { code: "streams.read", name: "Read streams", category: "academic" },
    { code: "streams.manage", name: "Manage streams", category: "academic" },
    { code: "grade_levels.read", name: "Read grade levels", category: "academic" },
    { code: "grade_levels.manage", name: "Manage grade levels", category: "academic" },
    { code: "sections.read", name: "Read sections", category: "academic" },
    { code: "sections.manage", name: "Manage sections", category: "academic" },
    { code: "staff.read", name: "Read staff profiles", category: "staff" },
    { code: "staff.manage", name: "Manage staff profiles", category: "staff" },
  { code: "notifications.read", name: "Read notifications", category: "notifications" },
  { code: "notifications.manage", name: "Manage notifications", category: "notifications" },
  { code: "hostel.read", name: "Read hostel", category: "hostel" },
  { code: "hostel.manage", name: "Manage hostel", category: "hostel" },
  { code: "hostel.read", name: "Read hostel", category: "hostel" },
  { code: "hostel.manage", name: "Manage hostel", category: "hostel" },
  { code: "library.read", name: "Read library", category: "library" },
  { code: "library.manage", name: "Manage library", category: "library" },
  { code: "library.read", name: "Read library", category: "library" },
  { code: "library.manage", name: "Manage library", category: "library" },
  { code: "transport.read", name: "Read transport", category: "transport" },
  { code: "transport.manage", name: "Manage transport", category: "transport" },
  { code: "hr.read", name: "Read HR data", category: "hr" },
  { code: "hr.manage", name: "Manage HR data", category: "hr" },
    { code: "students.read", name: "Read students", category: "students" },
    { code: "students.manage", name: "Manage students", category: "students" },
  { code: "transfer_certificates.read", name: "Read transfer certificates", category: "certificates" },
  { code: "transfer_certificates.manage", name: "Manage transfer certificates", category: "certificates" },
  { code: "enrollments.read", name: "Read enrollments", category: "enrollments" },
  { code: "enrollments.manage", name: "Manage enrollments", category: "enrollments" },
    { code: "guardians.read", name: "Read guardians", category: "guardians" },
    { code: "guardians.manage", name: "Manage guardians", category: "guardians" },
    { code: "addresses.read", name: "Read addresses", category: "addresses" },
    { code: "addresses.manage", name: "Manage addresses", category: "addresses" },
  ];

  for (const p of TENANT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p,
    });
  }

  const tenantUserEmail = process.env.TENANT_USER_EMAIL ?? "tenantadmin@example.com";
  const tenantUserPassword = process.env.TENANT_USER_PASSWORD ?? "ChangeMe123!";
  const tenantUserPasswordHash = await bcrypt.hash(tenantUserPassword, 10);

  await prisma.user.upsert({
    where: { email: tenantUserEmail },
    update: { passwordHash: tenantUserPasswordHash, status: "ACTIVE", firstNameEn: "Tenant", firstNameNe: "टेनेन्ट", lastNameEn: "Admin", lastNameNe: "एडमिन" },
    create: {
      email: tenantUserEmail,
      firstNameEn: "Tenant",
      firstNameNe: "टेनेन्ट",
      lastNameEn: "Admin",
      lastNameNe: "एडमिन",
      passwordHash: tenantUserPasswordHash,
      status: "ACTIVE",
    },
  });

  // Demo tenant for testing tenant-scoped APIs.
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: "demo-school-001" },
    update: {},
    create: {
      nameEn: "Demo School",
      nameNe: "डेमो विद्यालय",
      subdomain: "demo-school-001",
      iemisCode: "111111111",
      schoolCode: "DEMO-001",
      registrationNumber: "REG-DEMO",
      panVatNumber: "999888777",
      schoolType: "INSTITUTIONAL_PRIVATE",
      provinceCode: "3",
      provinceNe: "बागमती प्रदेश",
      provinceEn: "Bagmati Province",
      districtCode: "27",
      districtNe: "काठमाडौं",
      districtEn: "Kathmandu",
      municipalityCode: "2701",
      municipalityNe: "काठमाडौं महानगरपालिका",
      municipalityEn: "Kathmandu Metropolitan City",
      wardNumber: 1,
      toleEn: "New Baneshwor",
      toleNe: "नयाँ बानेश्वर",
      addressEn: "Kathmandu, Nepal",
      addressNe: "काठमाडौं, नेपाल",
      phone: "+977-1-4000000",
      email: "info@demo-school.edu.np",
      establishedDateAd: new Date("2020-01-01T00:00:00.000Z"),
      establishedDateBs: "2076-09-16",
      motoEn: "Knowledge is power",
      motoNe: "ज्ञान नै शक्ति हो",
      latitude: 27.7172,
      longitude: 85.324,
      status: "ACTIVE",
      createdByPlatformUserId: superAdmin.id,
    },
  });

  const allTenantPermissions = await prisma.permission.findMany();
  let schoolAdminRole = await prisma.role.findFirst({ where: { tenantId: demoTenant.id, name: "School Admin" } });
  if (!schoolAdminRole) {
    schoolAdminRole = await prisma.role.create({ data: { tenantId: demoTenant.id, name: "School Admin", description: "Full access for school admin", isSystem: true } });
  }
  await prisma.rolePermission.deleteMany({ where: { roleId: schoolAdminRole.id } });
  await prisma.rolePermission.createMany({
    data: allTenantPermissions.map((p) => ({ roleId: schoolAdminRole.id, permissionId: p.id })),
    skipDuplicates: true,
  });

  const tenantUser = await prisma.user.findUnique({ where: { email: tenantUserEmail } });
  if (tenantUser) {
    await prisma.tenantUser.upsert({
      where: { tenantId_userId: { tenantId: demoTenant.id, userId: tenantUser.id } },
      update: {},
      create: { tenantId: demoTenant.id, userId: tenantUser.id, isPrimary: true },
    });
    const tu = await prisma.tenantUser.findUnique({ where: { tenantId_userId: { tenantId: demoTenant.id, userId: tenantUser.id } } });
    if (tu) {
      await prisma.tenantUserRole.upsert({
        where: { tenantUserId_roleId: { tenantUserId: tu.id, roleId: schoolAdminRole.id } },
        update: {},
        create: { tenantUserId: tu.id, roleId: schoolAdminRole.id },
      });
    }
  }

  // Seed sample notifications for the platform super admin.
  await prisma.notification.createMany({
    data: [
      { recipientType: "PLATFORM_USER", recipientId: superAdmin.id, title: "Welcome to School SaaS", message: "Your platform is ready. Start by onboarding schools.", type: "INFO", isRead: false },
      { recipientType: "PLATFORM_USER", recipientId: superAdmin.id, title: "New tenant created", message: "Demo School has been created.", type: "SUCCESS", isRead: false },
      { recipientType: "PLATFORM_USER", recipientId: superAdmin.id, title: "Subscription expiring", message: "A school subscription will expire soon.", type: "WARNING", isRead: true },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded platform roles, permissions, super admin, subscription plans and tenant permissions.");
  console.log(`Super admin login: ${superAdminEmail} / ${superAdminPassword}`);
  console.log(`Tenant user login: ${tenantUserEmail} / ${tenantUserPassword}`);
  console.log(`Demo tenant id: ${demoTenant.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });