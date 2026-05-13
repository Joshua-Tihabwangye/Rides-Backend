import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreatePricingConfigDto, CreatePromoDto, CreateServiceConfigDto, UpdatePricingConfigDto, UpdatePromoDto, UpdateServiceConfigDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminConfigController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    listPricing(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-config.entity").PricingConfig[]>>;
    getPricing(pricingId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-config.entity").PricingConfig>>;
    createPricing(user: AuthenticatedUser, body: CreatePricingConfigDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-config.entity").PricingConfig>>;
    patchPricing(user: AuthenticatedUser, pricingId: string, body: UpdatePricingConfigDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/pricing-config.entity").PricingConfig>>;
    listPromos(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/promo.entity").Promo[]>>;
    getPromo(promoId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/promo.entity").Promo>>;
    createPromo(user: AuthenticatedUser, body: CreatePromoDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/promo.entity").Promo>>;
    patchPromo(user: AuthenticatedUser, promoId: string, body: UpdatePromoDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/promo.entity").Promo>>;
    listServices(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/service-config.entity").ServiceConfig[]>>;
    getService(serviceId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/service-config.entity").ServiceConfig>>;
    createServiceConfig(user: AuthenticatedUser, body: CreateServiceConfigDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/service-config.entity").ServiceConfig>>;
    patchServiceConfig(user: AuthenticatedUser, serviceId: string, body: UpdateServiceConfigDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/service-config.entity").ServiceConfig>>;
}
