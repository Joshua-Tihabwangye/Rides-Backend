import { Module } from '@nestjs/common';
import { PricingZoneService } from './pricing-zone.service';

@Module({
  providers: [PricingZoneService],
  exports: [PricingZoneService],
})
export class PricingZoneModule {}
