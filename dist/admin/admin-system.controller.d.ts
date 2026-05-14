import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminSystemController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getAuditLog(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        createdAt: Date;
        actorId: string;
        ipAddress: string | null;
        userAgent: string | null;
        actorType: string;
        action: string;
        resource: string;
        resourceId: string | null;
        before: import("@prisma/client/runtime/client").JsonValue | null;
        after: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>>;
    getFlags(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }[]>>;
    patchFlag(user: AuthenticatedUser, flagKey: string, body: UpdateFeatureFlagDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }>>;
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
