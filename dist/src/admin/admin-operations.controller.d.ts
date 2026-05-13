import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { AdminAnalyticsQueryDto, CreateAdminCompanyDto, ReviewApprovalDto, UpdateAdminCompanyDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminOperationsController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    listCompanies(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-partner-profile.entity").FleetPartnerProfile[]>>;
    createCompany(user: AuthenticatedUser, body: CreateAdminCompanyDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        approvalId: string;
        id: string;
        userId: string;
        user: import("../entities/user.entity").User;
        fleetId: string;
        companyName: string;
        contactEmail: string;
        contactPhone: string;
        registrationNumber: string;
        taxId: string;
        status: string;
        verticals: Record<string, boolean>;
        branches: import("../entities/fleet-branch.entity").FleetBranch[];
    }>>;
    patchCompany(user: AuthenticatedUser, companyId: string, body: UpdateAdminCompanyDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-partner-profile.entity").FleetPartnerProfile>>;
    listApprovals(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/approval.entity").Approval[]>>;
    reviewApproval(user: AuthenticatedUser, approvalId: string, body: ReviewApprovalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/approval.entity").Approval>>;
    getOperationsAnalytics(query: AdminAnalyticsQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        period: "day" | "week" | "month" | "quarter" | "year";
        trips: {
            total: number;
            completed: number;
            active: number;
        };
        dispatches: {
            total: number;
            pending: number;
        };
        drivers: {
            total: number;
            online: number;
        };
    }>>;
    getFinanceAnalytics(query: AdminAnalyticsQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        period: "day" | "week" | "month" | "quarter" | "year";
        grossEarnings: number;
        earningsCount: number;
        payoutsPending: number;
        walletExposure: number;
        currency: string;
    }>>;
    listSafetyIncidents(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/safety-event.entity").SafetyEvent[]>>;
    listRiskCases(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/risk-case.entity").RiskCase[]>>;
}
