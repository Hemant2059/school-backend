import { Module } from '@nestjs/common';
import { PlatformPermissionsController } from './controllers/platform-permissions.controller.js';
import { PlatformRolesController } from './controllers/platform-roles.controller.js';
import { PlatformUsersController } from './controllers/platform-users.controller.js';
import { PlatformPermissionsService } from './services/platform-permissions.service.js';
import { PlatformRolesService } from './services/platform-roles.service.js';
import { PlatformUsersService } from './services/platform-users.service.js';

@Module({
  controllers: [PlatformPermissionsController, PlatformRolesController, PlatformUsersController],
  providers: [PlatformPermissionsService, PlatformRolesService, PlatformUsersService],
  exports: [PlatformPermissionsService, PlatformRolesService, PlatformUsersService],
})
export class PlatformModule {}