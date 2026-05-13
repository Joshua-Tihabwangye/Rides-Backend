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
    getTaxConfig(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        regionId: string;
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes?: string;
        updatedAt: number;
    }[]>>;
    patchTaxConfig(user: AuthenticatedUser, regionId: string, body: Partial<{
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updatedAt: number;
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes?: string;
        regionId: string;
    } | {
        updatedAt: number;
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes?: string | undefined;
        regionId: string;
    }>>;
    getInvoiceTemplates(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer?: string;
        updatedAt: number;
    }[]>>;
    patchInvoiceTemplate(user: AuthenticatedUser, templateId: string, body: Partial<{
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updatedAt: number;
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer?: string;
        id: string;
    } | {
        updatedAt: number;
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer?: string | undefined;
        id: string;
    }>>;
    listTrainingModules(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        version: number;
        content?: string;
        updatedAt: number;
        createdAt: number;
    }[]>>;
    createTrainingModule(user: AuthenticatedUser, body: {
        title: string;
        category: string;
        status?: 'draft' | 'published' | 'archived';
        content?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        content: string | undefined;
        version: number;
        createdAt: number;
        updatedAt: number;
    }>>;
    patchTrainingModule(user: AuthenticatedUser, moduleId: string, body: Partial<{
        title: string;
        category: string;
        status: 'draft' | 'published' | 'archived';
        content: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        version: number;
        updatedAt: number;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        content?: string;
        id: string;
        createdAt: number;
    }>>;
    deleteTrainingModule(user: AuthenticatedUser, moduleId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    listPolicies(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        key: string;
        title: string;
        scope: "global" | "rider" | "driver" | "fleet" | "admin";
        status: "draft" | "active" | "archived";
        content: string;
        version: number;
        updatedAt: number;
        createdAt: number;
    }[]>>;
    createPolicy(user: AuthenticatedUser, body: {
        key: string;
        title: string;
        scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin';
        status?: 'draft' | 'active' | 'archived';
        content: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        key: string;
        title: string;
        scope: "driver" | "rider" | "fleet" | "global" | "admin";
        status: "active" | "draft" | "archived";
        content: string;
        version: number;
        createdAt: number;
        updatedAt: number;
    }>>;
    patchPolicy(user: AuthenticatedUser, policyId: string, body: Partial<{
        key: string;
        title: string;
        scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin';
        status: 'draft' | 'active' | 'archived';
        content: string;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        version: number;
        updatedAt: number;
        key: string;
        title: string;
        scope: "global" | "rider" | "driver" | "fleet" | "admin";
        status: "draft" | "active" | "archived";
        content: string;
        id: string;
        createdAt: number;
    }>>;
    listVerticalPolicies(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        verticalId: string;
        name: string;
        status: "active" | "inactive";
        rules: Record<string, unknown>;
        updatedAt: number;
    }[]>>;
    patchVerticalPolicy(user: AuthenticatedUser, verticalId: string, body: Partial<{
        name: string;
        status: 'active' | 'inactive';
        rules: Record<string, unknown>;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updatedAt: number;
        name: string;
        status: "active" | "inactive";
        rules: Record<string, unknown>;
        verticalId: string;
    } | {
        updatedAt: number;
        name: string;
        status: "active" | "inactive";
        rules: {};
        verticalId: string;
    }>>;
}
