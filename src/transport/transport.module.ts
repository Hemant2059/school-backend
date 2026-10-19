import { Module } from '@nestjs/common';
import { VehicleController } from './controllers/vehicle.controller.js';
import { RouteController } from './controllers/route.controller.js';
import { StopController } from './controllers/stop.controller.js';
import { StudentTransportController } from './controllers/student-transport.controller.js';
import { VehicleService } from './services/vehicle.service.js';
import { RouteService } from './services/route.service.js';
import { StopService } from './services/stop.service.js';
import { StudentTransportService } from './services/student-transport.service.js';

@Module({
  controllers: [VehicleController, RouteController, StopController, StudentTransportController],
  providers: [VehicleService, RouteService, StopService, StudentTransportService],
  exports: [VehicleService, RouteService, StopService, StudentTransportService],
})
export class TransportModule {}