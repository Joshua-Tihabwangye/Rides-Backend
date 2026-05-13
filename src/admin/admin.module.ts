import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminConfigController } from './admin-config.controller';
import { AdminOperationsController } from './admin-operations.controller';
import { AdminSystemController } from './admin-system.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminPricingZoneController } from './admin-pricing-zone.controller';
import { AdminCompatController } from './admin-compat.controller';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
import { RiderProfile } from '../entities/rider-profile.entity';
import { AdminProfile } from '../entities/admin-profile.entity';
import { Role } from '../entities/role.entity';
import { FleetPartnerProfile } from '../entities/fleet-partner-profile.entity';
import { FleetBranch } from '../entities/fleet-branch.entity';
import { Approval } from '../entities/approval.entity';
import { Trip } from '../entities/trip.entity';
import { FleetDispatch } from '../entities/fleet-dispatch.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { FleetPayout } from '../entities/fleet-payout.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { SafetyEvent } from '../entities/safety-event.entity';
import { RiskCase } from '../entities/risk-case.entity';
import { PricingConfig } from '../entities/pricing-config.entity';
import { Promo } from '../entities/promo.entity';
import { ServiceConfig } from '../entities/service-config.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { FeatureFlag } from '../entities/feature-flag.entity';
import { PricingZone } from '../entities/pricing-zone.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';
import { PricingZoneModule } from '../pricing-zone/pricing-zone.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DriverProfile,
      RiderProfile,
      AdminProfile,
      Role,
      FleetPartnerProfile,
      FleetBranch,
      Approval,
      Trip,
      FleetDispatch,
      EarningsLedger,
      FleetPayout,
      WalletAccount,
      SafetyEvent,
      RiskCase,
      PricingConfig,
      Promo,
      ServiceConfig,
      AuditLog,
      FeatureFlag,
      PricingZone,
      RiderServiceRequest,
    ]),
    PricingZoneModule,
    RealtimeModule,
  ],
  controllers: [
    AdminController,
    AdminUsersController,
    AdminOperationsController,
    AdminConfigController,
    AdminSystemController,
    AdminPricingZoneController,
    AdminCompatController,
  ],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
