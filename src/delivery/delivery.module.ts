import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { PresenceLocationModule } from '../presence-location/presence-location.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { DeliveryController } from './delivery.controller';
import { RiderDeliveryController } from './rider-delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  imports: [
    DocumentsModule,
    PresenceLocationModule,
    RealtimeModule,
  ],
  controllers: [DeliveryController, RiderDeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
