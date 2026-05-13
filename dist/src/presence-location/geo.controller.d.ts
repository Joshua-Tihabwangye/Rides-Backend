import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { NearbyDriversQueryDto } from './dto/location.dto';
import { PresenceLocationService } from './presence-location.service';
export declare class GeoController {
    private readonly presenceLocationService;
    private readonly apiResponse;
    constructor(presenceLocationService: PresenceLocationService, apiResponse: ApiResponseService);
    nearbyDrivers(query: NearbyDriversQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("./presence-location.service").NearbyDriverRecord[]>>;
}
