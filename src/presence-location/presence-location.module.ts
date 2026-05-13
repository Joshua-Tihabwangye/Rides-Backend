import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { DriverProfileModule } from '../driver-profile/driver-profile.module';
import { GeoController } from './geo.controller';
import { PresenceLocationController } from './presence-location.controller';
import { PresenceLocationService } from './presence-location.service';
import { DriverProfile } from '../entities/driver-profile.entity';
import { PricingZoneModule } from '../pricing-zone/pricing-zone.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverProfile]),
    DriverProfileModule,
    DatabaseModule,
    PricingZoneModule,
  ],
  controllers: [PresenceLocationController, GeoController],
  providers: [PresenceLocationService],
  exports: [PresenceLocationService],
})
export class PresenceLocationModule {}
