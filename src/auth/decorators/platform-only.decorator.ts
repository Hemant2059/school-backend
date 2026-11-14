import { SetMetadata } from '@nestjs/common';

export const PLATFORM_ONLY_KEY = 'platformOnly';

/**
 * Marks a route (or controller) as reachable only by platform principals —
 * the SaaS company's own staff (super admin, support, sales, billing).
 *
 * Platform and tenant RBAC share the same permission *code* vocabulary
 * (`roles.manage`, `permissions.manage`, `students.read`, ...). Without this
 * marker a school tenant holding `roles.manage` could reach `/platform/roles`
 * and rewrite the platform RBAC catalogue. This marker is what closes that
 * privilege-escalation path.
 */
export const PlatformOnly = () => SetMetadata(PLATFORM_ONLY_KEY, true);
