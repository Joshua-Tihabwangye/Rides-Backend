import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminSystemController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getAuditLog(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/audit-log.entity").AuditLog[]>>;
    getFlags(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/feature-flag.entity").FeatureFlag[]>>;
    patchFlag(user: AuthenticatedUser, flagKey: string, body: UpdateFeatureFlagDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/feature-flag.entity").FeatureFlag>>;
    getHealth(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
        service: string;
        timestamp: string;
        modules: {
            users: number;
            trips: number;
            fleetCompanies: number;
            pendingApprovals: number;
        };
    }>>;
    getOverview(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        totals: {
            users: number;
            riders: number;
            drivers: number;
            companies: number;
            trips: number;
        };
        queues: {
            approvals: number;
            riskCases: number;
            safetyIncidents: number;
        };
    }>>;
}
