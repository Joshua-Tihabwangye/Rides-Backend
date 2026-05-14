import { Module } from '@nestjs/common';
import { PresenceLocationModule } from '../presence-location/presence-location.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';

@Module({
  imports: [PresenceLocationModule, RealtimeModule],
  controllers: [RiderController],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}
