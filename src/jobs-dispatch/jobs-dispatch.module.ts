import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from '../documents/documents.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TripsModule } from '../trips/trips.module';
import { JobsDispatchController } from './jobs-dispatch.controller';
import { JobsDispatchService } from './jobs-dispatch.service';
import { JobOffer } from '../entities/job-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobOffer]),
    TripsModule,
    DocumentsModule,
    RealtimeModule,
  ],
  controllers: [JobsDispatchController],
  providers: [JobsDispatchService],
  exports: [JobsDispatchService],
})
export class JobsDispatchModule {}
