import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from '../documents/documents.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { WalletAccount } from '../entities/wallet-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, JobOffer, EarningsLedger, WalletAccount]),
    DocumentsModule,
    RealtimeModule
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
