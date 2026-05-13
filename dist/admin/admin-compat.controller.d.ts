import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { ReviewApprovalDto, UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminCompatController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getFeatureFlags(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/feature-flag.entity").FeatureFlag[]>>;
    patchFeatureFlag(user: AuthenticatedUser, flagKey: string, body: UpdateFeatureFlagDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/feature-flag.entity").FeatureFlag>>;
    getAuditEvents(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/audit-log.entity").AuditLog[]>>;
    listRiskCases(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/risk-case.entity").RiskCase[]>>;
    getRiskCase(caseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/risk-case.entity").RiskCase>>;
    reviewApprovalCompat(user: AuthenticatedUser, approvalId: string, body: ReviewApprovalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/approval.entity").Approval>>;
}
