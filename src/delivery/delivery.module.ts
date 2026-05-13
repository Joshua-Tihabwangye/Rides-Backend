import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from '../documents/documents.module';
import { PresenceLocationModule } from '../presence-location/presence-location.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { DeliveryController } from './delivery.controller';
import { RiderDeliveryController } from './rider-delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryOrder } from '../entities/delivery-order.entity';
import { DeliveryRoute } from '../entities/delivery-route.entity';
import { Notification } from '../entities/notification.entity';
import { DriverProfile } from '../entities/driver-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, DeliveryRoute, Notification, DriverProfile]),
    DocumentsModule,
    PresenceLocationModule,
    RealtimeModule
  ],
  controllers: [DeliveryController, RiderDeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
