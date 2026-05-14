import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { ReviewApprovalDto, UpdateFeatureFlagDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminCompatController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getFeatureFlags(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }[]>>;
    patchFeatureFlag(user: AuthenticatedUser, flagKey: string, body: UpdateFeatureFlagDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }>>;
    getAuditEvents(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    listRiskCases(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.RiskStatus;
        notes: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        subjectType: string;
        subjectId: string;
    }[]>>;
    getRiskCase(caseId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.RiskStatus;
        notes: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        subjectType: string;
        subjectId: string;
    }>>;
    reviewApprovalCompat(user: AuthenticatedUser, approvalId: string, body: ReviewApprovalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.ApprovalStatus;
        notes: string | null;
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.ApprovalEntityType;
        entityId: string;
        requestedBy: string;
        reviewedBy: string | null;
        reviewedAt: bigint | null;
    }>>;
}
