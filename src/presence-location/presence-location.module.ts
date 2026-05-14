import { Module } from '@nestjs/common';
import { DriverProfileModule } from '../driver-profile/driver-profile.module';
import { GeoController } from './geo.controller';
import { PresenceLocationController } from './presence-location.controller';
import { PresenceLocationService } from './presence-location.service';
import { PricingZoneModule } from '../pricing-zone/pricing-zone.module';

@Module({
  imports: [
    DriverProfileModule,
    PricingZoneModule,
  ],
  controllers: [PresenceLocationController, GeoController],
  providers: [PresenceLocationService],
  exports: [PresenceLocationService],
})
export class PresenceLocationModule {}
