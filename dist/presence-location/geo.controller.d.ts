import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { NearbyDriversQueryDto } from './dto/location.dto';
import { PresenceLocationService } from './presence-location.service';
import { PricingZoneService } from '../pricing-zone/pricing-zone.service';
export declare class GeoController {
    private readonly presenceLocationService;
    private readonly pricingZoneService;
    private readonly apiResponse;
    constructor(presenceLocationService: PresenceLocationService, pricingZoneService: PricingZoneService, apiResponse: ApiResponseService);
    nearbyDrivers(query: NearbyDriversQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("./presence-location.service").NearbyDriverRecord[]>>;
    getPricingZone(lat: number, lng: number, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any>>;
}
