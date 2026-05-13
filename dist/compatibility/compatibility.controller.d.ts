import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CompatSignInDto } from './dto/compat-auth.dto';
import type { AppId } from './contracts.types';
import { CompatibilityContractService } from './compatibility.service';
export declare class CompatibilityContractController {
    private readonly compatibilityService;
    private readonly apiResponse;
    constructor(compatibilityService: CompatibilityContractService, apiResponse: ApiResponseService);
    getContracts(req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./contracts.types").AppBehaviorContract[]>;
    getCanonicalContracts(req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./contracts.types").AppCanonicalContract[]>;
    getContract(appId: AppId, req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./contracts.types").AppBehaviorContract>;
    getCanonicalContract(appId: AppId, req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./contracts.types").AppCanonicalContract>;
    getBootstrap(appId: AppId, req: Request): import("../common/api/api.types").ApiSuccessResponse<import("./contracts.types").CompatibilityBootstrapPayload>;
    getRuntimeFlags(appId: AppId, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        appId: AppId;
        backendEnabled: boolean;
        flags: import("../entities/feature-flag.entity").FeatureFlag[];
    }>>;
    compatSignIn(appId: AppId, body: CompatSignInDto, req: Request): import("../common/api/api.types").ApiSuccessResponse<{
        user: {
            id: string;
            fullName: string;
            email: string;
            phone: string;
            avatarUrl: null;
            provider: string;
            role: string;
            initials: string;
            name?: undefined;
            selectedService?: undefined;
        };
        token: string;
        isLoggedIn?: undefined;
        isAuthenticated?: undefined;
        hasFinishedOnboarding?: undefined;
        name?: undefined;
        email?: undefined;
        role?: undefined;
    } | {
        isLoggedIn: boolean;
        user: {
            name: string;
            initials: string;
            email: string;
            phone: string;
            selectedService: string;
            id?: undefined;
            fullName?: undefined;
            avatarUrl?: undefined;
            provider?: undefined;
            role?: undefined;
        };
        token?: undefined;
        isAuthenticated?: undefined;
        hasFinishedOnboarding?: undefined;
        name?: undefined;
        email?: undefined;
        role?: undefined;
    } | {
        isAuthenticated: boolean;
        hasFinishedOnboarding: boolean;
        user: {
            email: string;
            role: string;
            name: string;
            id?: undefined;
            fullName?: undefined;
            phone?: undefined;
            avatarUrl?: undefined;
            provider?: undefined;
            initials?: undefined;
            selectedService?: undefined;
        };
        token?: undefined;
        isLoggedIn?: undefined;
        name?: undefined;
        email?: undefined;
        role?: undefined;
    } | {
        name: string;
        email: string;
        role: string;
        user?: undefined;
        token?: undefined;
        isLoggedIn?: undefined;
        isAuthenticated?: undefined;
        hasFinishedOnboarding?: undefined;
    }>;
}
