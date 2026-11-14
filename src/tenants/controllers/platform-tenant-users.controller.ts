import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Permissions } from '../../auth/decorators/permissions.decorator.js';
import { TenantUserService } from '../../tenant-rbac/services/tenant-user.service.js';
import { TenantRoleService } from '../../tenant-rbac/services/role.service.js';
import { PlatformOnly } from '../../auth/decorators/platform-only.decorator.js';
import { PlatformUsersService } from '../../platform/services/platform-users.service.js';

/**
 * Platform-side management of a school's users.
 *
 * These routes are platform-only: a school tenant must not be able to reach
 * another school's user list.
 */
@PlatformOnly()
@Controller('platform/tenants/:tenantId/users')
export class PlatformTenantUsersController {
  constructor(
    private readonly service: TenantUserService,
    private readonly roleService: TenantRoleService,
    private readonly platformUsers: PlatformUsersService,
  ) {}

  @Permissions('tenants.read')
  @Get()
  findAll(@Param('tenantId') tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Permissions('tenants.manage')
  @Post()
  create(@Param('tenantId') tenantId: string, @Body() dto: any) {
    return this.service.create(tenantId, dto);
  }

  @Permissions('tenants.manage')
  @Patch(':id')
  update(
    @Param('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  /**
   * Issues a fresh set of credentials for a school user.
   *
   * This used to return `{ sent: true }` without doing anything, which told
   * the operator a password had been sent when none had. It now returns the
   * generated password exactly once, so it can be handed over.
   */
  @Permissions('tenants.manage')
  @Post(':id/send-credentials')
  async sendCredentials(@Param('tenantId') tenantId: string, @Param('id') id: string) {
    const membership = await this.service.findOne(tenantId, id);
    const password = this.platformUsers.generateTemporaryPassword();

    await this.service.resetPassword(membership.userId, password);

    return {
      sent: true,
      userId: membership.userId,
      email: membership.user.email,
      // Returned exactly once.
      temporaryPassword: password,
      message:
        'Credentials generated. The password is shown once and must be passed on securely.',
    };
  }

  @Permissions('tenants.read')
  @Get('roles')
  roles(@Param('tenantId') tenantId: string) {
    return this.roleService.findAll(tenantId);
  }
}
