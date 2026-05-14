import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PricingZoneService } from '../pricing-zone/pricing-zone.service';
import { CreatePricingZoneDto, UpdatePricingZoneDto } from '../admin/dto/admin.dto';
export declare class AdminPricingZoneController {
    private readonly pricingZoneService;
    private readonly apiResponse;
    constructor(pricingZoneService: PricingZoneService, apiResponse: ApiResponseService);
    listZones(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>>;
    getZone(zoneId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    createZone(user: AuthenticatedUser, body: CreatePricingZoneDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>>;
    updateZone(user: AuthenticatedUser, zoneId: string, body: UpdatePricingZoneDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>>;
}
