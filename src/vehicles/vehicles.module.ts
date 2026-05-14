import { Module } from '@nestjs/common';
import { FleetVehiclesController } from './fleet-vehicles.controller';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  controllers: [VehiclesController, FleetVehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
