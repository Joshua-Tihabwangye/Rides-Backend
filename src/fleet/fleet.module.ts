import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FleetController } from './fleet.controller';
import { FleetDriversController } from './fleet-drivers.controller';
import { FleetOperationsController } from './fleet-operations.controller';
import { FleetService } from './fleet.service';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { FleetPartnerProfile } from '../entities/fleet-partner-profile.entity';
import { FleetBranch } from '../entities/fleet-branch.entity';
import { FleetDriver } from '../entities/fleet-driver.entity';
import { FleetDispatch } from '../entities/fleet-dispatch.entity';
import { FleetServiceRecord } from '../entities/fleet-service-record.entity';
import { FleetPayout } from '../entities/fleet-payout.entity';
import { FleetComplianceIncident } from '../entities/fleet-compliance-incident.entity';
import { FleetTrainingCourse } from '../entities/fleet-training-course.entity';
import { User } from '../entities/user.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FleetPartnerProfile,
      FleetBranch,
      FleetDriver,
      FleetDispatch,
      FleetServiceRecord,
      FleetPayout,
      FleetComplianceIncident,
      FleetTrainingCourse,
      User,
      DriverProfile,
      Trip,
      JobOffer,
      EarningsLedger,
      Vehicle,
      RiderServiceRequest,
    ]),
    VehiclesModule,
    RealtimeModule,
  ],
  controllers: [FleetController, FleetDriversController, FleetOperationsController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
