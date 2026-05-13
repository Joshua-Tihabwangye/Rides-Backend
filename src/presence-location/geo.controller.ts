import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { getRequestId } from '../common/utils/request-id';
import { NearbyDriversQueryDto } from './dto/location.dto';
import { PresenceLocationService } from './presence-location.service';
import { PricingZoneService } from '../pricing-zone/pricing-zone.service';

@Controller('geo')
export class GeoController {
  constructor(
    private readonly presenceLocationService: PresenceLocationService,
    private readonly pricingZoneService: PricingZoneService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('nearby-drivers')
  async nearbyDrivers(@Query() query: NearbyDriversQueryDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'NEARBY_DRIVERS_FETCHED',
      message: 'Nearby drivers fetched',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.findNearbyDrivers(query.lat, query.lng, query.radius),
    });
  }

  @Get('pricing-zone')
  async getPricingZone(@Query('lat') lat: number, @Query('lng') lng: number, @Req() req: Request) {
    const zone = await this.pricingZoneService.findZoneByLocation(lat, lng);
    return this.apiResponse.success({
      code: zone ? 'PRICING_ZONE_FOUND' : 'PRICING_ZONE_NOT_FOUND',
      message: zone ? 'Pricing zone found' : 'No pricing zone for location',
      requestId: getRequestId(req),
      data: zone,
    });
  }
}
