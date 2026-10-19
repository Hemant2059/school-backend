import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller.js';
import { AddressController } from './controllers/address.controller.js';
import { GuardianController } from './controllers/guardian.controller.js';
import { StudentGuardianController } from './controllers/student-guardian.controller.js';
import { StudentService } from './services/student.service.js';
import { AddressService } from './services/address.service.js';
import { GuardianService } from './services/guardian.service.js';
import { StudentGuardianService } from './services/student-guardian.service.js';

@Module({
  controllers: [StudentController, AddressController, GuardianController, StudentGuardianController],
  providers: [StudentService, AddressService, GuardianService, StudentGuardianService],
  exports: [StudentService, AddressService, GuardianService, StudentGuardianService],
})
export class StudentsModule {}