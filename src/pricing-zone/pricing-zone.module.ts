import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingZone } from '../entities/pricing-zone.entity';
import { PricingZoneService } from './pricing-zone.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingZone])],
  providers: [PricingZoneService],
  exports: [PricingZoneService],
})
export class PricingZoneModule {}
