import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';

/**
 * Provisions the default role set for a newly onboarded school.
 *
 * Previously a tenant created through the platform API received zero roles;
 * the only role that ever existed was the `School Admin` auto-created by
 * `TenantUserService` on first user creation. The platform seed creates
 * Teacher / Accountant / Parent roles only for the demo tenant, so every
 * production school had to be set up role by role, manually.
 *
 * The default role set mirrors the Nepali school's typical structure:
 * administration, teaching, finance, library, hostel, transport and portal
 * access.
 *
 * It is idempotent: calling it twice does not duplicate roles.
 */
@Injectable()
export class TenantProvisioningService {
  private readonly logger = new Logger(TenantProvisioningService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensures the default roles exist for a tenant.
   *
   * Strictly additive and idempotent: missing roles are created and
   * missing spec permissions are granted; existing roles and permissions
   * are never changed or removed. Safe to run for tenants created before
   * automatic provisioning and safe to re-run.
   */
  async provisionDefaultRoles(tenantId: string): Promise<void> {
    const allPermissions = await this.prisma.permission.findMany({
      select: { id: true, code: true },
    });
    const permissionIdByCode = new Map(
      allPermissions.map((p) => [p.code, p.id] as const),
    );

    const specs: Array<{
      name: string;
      description: string;
      codes: string[];
    }> = [
      {
        name: 'School Admin',
        description: 'Full access to every capability in the school',
        codes: allPermissions.map((p) => p.code),
      },
      {
        name: 'Teacher',
        description: 'Classroom teaching staff',
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
          'academic_calendar.read',
          'hostel.read',
          'library.read',
          'transport.read',
          'notifications.read',
          'notifications.manage',
        ],
      },
      {
        name: 'Accountant',
        description: 'Fee collection and financial administration',
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
          'credit_notes.read',
          'credit_notes.manage',
          'scholarships.read',
          'scholarships.manage',
          'guardians.read',
          'notifications.read',
        ],
      },
      {
        name: 'Librarian',
        description: 'Library management',
        codes: [
          'students.read',
          'library.read',
          'library.manage',
          'notifications.read',
        ],
      },
      {
        name: 'Warden',
        description: 'Hostel management',
        codes: [
          'students.read',
          'hostel.read',
          'hostel.manage',
          'notifications.read',
        ],
      },
      {
        name: 'Transport Manager',
        description: 'School transport and vehicle management',
        codes: [
          'students.read',
          'transport.read',
          'transport.manage',
          'notifications.read',
        ],
      },
      {
        name: 'Parent',
        description:
          'Parent portal access scoped to own children. Read access to all students is not granted.',
        // The Parent portal endpoints (/tenants/:tenantId/parent/*) use
        // a guard that only returns the caller's own children. The parent
        // does not get `students.read` because that permission exposes
        // every student in the school.
        codes: ['notifications.read'],
      },
      {
        name: 'Student',
        description: 'Read-only student portal access',
        codes: ['attendance.read', 'exams.read', 'notifications.read'],
      },
    ];

    let rolesCreated = 0;
    let permissionsGranted = 0;

    for (const spec of specs) {
      let role = await this.prisma.role.findFirst({
        where: { tenantId, name: spec.name },
      });
      if (!role) {
        role = await this.prisma.role.create({
          data: {
            tenantId,
            name: spec.name,
            description: spec.description,
            isSystem: true,
          },
        });
        rolesCreated++;
      }

      const existingIds = (
        await this.prisma.rolePermission.findMany({
          where: { roleId: role.id },
          select: { permissionId: true },
        })
      ).map((rp) => rp.permissionId);

      const rows = spec.codes
        .map((code) => permissionIdByCode.get(code))
        .filter((id): id is string => {
          if (!id) return false;
          return !existingIds.includes(id);
        });

      if (rows.length > 0) {
        await this.prisma.rolePermission.createMany({
          data: rows.map((permissionId) => ({ roleId: role.id, permissionId })),
          skipDuplicates: true,
        });
        permissionsGranted += rows.length;
      }
    }

    if (rolesCreated > 0 || permissionsGranted > 0) {
      this.logger.log(
        `Default roles for tenant ${tenantId}: ${rolesCreated} created, ${permissionsGranted} permissions granted`,
      );
    }
  }
}
