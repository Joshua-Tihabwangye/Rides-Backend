import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { OnboardingService } from './onboarding.service';
export declare class OnboardingController {
    private readonly onboardingService;
    private readonly apiResponse;
    constructor(onboardingService: OnboardingService, apiResponse: ApiResponseService);
    getCheckpoints(user: AuthenticatedUser, req: Request): import("../common/api/api.types").ApiSuccessResponse<Promise<{
        onboardingComplete: boolean;
    }>>;
}
