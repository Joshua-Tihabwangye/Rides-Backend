import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  imports: [
    DocumentsModule,
    RealtimeModule,
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
