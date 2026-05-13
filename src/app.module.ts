import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { DriverProfileModule } from './driver-profile/driver-profile.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PresenceLocationModule } from './presence-location/presence-location.module';
import { DocumentsModule } from './documents/documents.module';
import { FleetModule } from './fleet/fleet.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { JobsDispatchModule } from './jobs-dispatch/jobs-dispatch.module';
import { RiderModule } from './rider/rider.module';
import { TripsModule } from './trips/trips.module';
import { DeliveryModule } from './delivery/delivery.module';
import { SafetyModule } from './safety/safety.module';
import { EarningsCashoutModule } from './earnings-cashout/earnings-cashout.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UsersModule } from './users/users.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { CompatibilityContractModule } from './compatibility/compatibility.module';
import { CompatibilityModule } from './compat/compat.module';
import { AppController } from './app.controller';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    RedisModule,
    CommonModule,
    StorageModule,
    AuthModule,
    UsersModule,
    DriverProfileModule,
    RiderModule,
    FleetModule,
    AdminModule,
    OnboardingModule,
    PresenceLocationModule,
    DocumentsModule,
    VehiclesModule,
    JobsDispatchModule,
    TripsModule,
    DeliveryModule,
    SafetyModule,
    EarningsCashoutModule,
    NotificationsModule,
    RealtimeModule,
    WorkspaceModule,
    CompatibilityContractModule,
    CompatibilityModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
