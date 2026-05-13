import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RealtimeGateway } from './realtime.gateway';
import {
  AdminRealtimeGateway,
  FleetRealtimeGateway,
  RiderRealtimeGateway,
} from './scoped-realtime.gateway';

@Module({
  imports: [AuthModule],
  providers: [RealtimeGateway, RiderRealtimeGateway, FleetRealtimeGateway, AdminRealtimeGateway],
  exports: [RealtimeGateway, RiderRealtimeGateway, FleetRealtimeGateway, AdminRealtimeGateway],
})
export class RealtimeModule {}
