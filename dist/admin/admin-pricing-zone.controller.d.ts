import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PricingZoneService } from '../pricing-zone/pricing-zone.service';
import { CreatePricingZoneDto, UpdatePricingZoneDto } from '../admin/dto/admin.dto';
export declare class AdminPricingZoneController {
    private readonly pricingZoneService;
    private readonly apiResponse;
    constructor(pricingZoneService: PricingZoneService, apiResponse: ApiResponseService);
    listZones(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-zone.entity").PricingZone[]>>;
    getZone(zoneId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-zone.entity").PricingZone>>;
    createZone(user: AuthenticatedUser, body: CreatePricingZoneDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-zone.entity").PricingZone>>;
    updateZone(user: AuthenticatedUser, zoneId: string, body: UpdatePricingZoneDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-zone.entity").PricingZone>>;
}
