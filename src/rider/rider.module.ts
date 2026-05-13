import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresenceLocationModule } from '../presence-location/presence-location.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { RiderProfile } from '../entities/rider-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RiderProfile, Trip, JobOffer, Notification, User, WalletAccount, EarningsLedger, RiderServiceRequest]),
    PresenceLocationModule,
    RealtimeModule
  ],
  controllers: [RiderController],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}
