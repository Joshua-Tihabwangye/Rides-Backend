import { Module } from '@nestjs/common';
import { FleetController } from './fleet.controller';
import { FleetDriversController } from './fleet-drivers.controller';
import { FleetOperationsController } from './fleet-operations.controller';
import { FleetService } from './fleet.service';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [VehiclesModule, RealtimeModule],
  controllers: [FleetController, FleetDriversController, FleetOperationsController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
