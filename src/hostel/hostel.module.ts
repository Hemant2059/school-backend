import { Module } from '@nestjs/common';
import { HostelController } from './controllers/hostel.controller.js';
import { HostelRoomController } from './controllers/hostel-room.controller.js';
import { HostelAllocationController } from './controllers/hostel-allocation.controller.js';
import { HostelService } from './services/hostel.service.js';
import { HostelRoomService } from './services/hostel-room.service.js';
import { HostelAllocationService } from './services/hostel-allocation.service.js';

@Module({
  controllers: [HostelController, HostelRoomController, HostelAllocationController],
  providers: [HostelService, HostelRoomService, HostelAllocationService],
  exports: [HostelService, HostelRoomService, HostelAllocationService],
})
export class HostelModule {}