import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { AdminAnalyticsQueryDto, CreateAdminCompanyDto, ReviewApprovalDto, UpdateAdminCompanyDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminOperationsController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    listCompanies(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }[]>>;
    getCompany(companyId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    createCompany(user: AuthenticatedUser, body: CreateAdminCompanyDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        approvalId: string;
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    patchCompany(user: AuthenticatedUser, companyId: string, body: UpdateAdminCompanyDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    listApprovals(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.ApprovalStatus;
        notes: string | null;
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.ApprovalEntityType;
        entityId: string;
        requestedBy: string;
        reviewedBy: string | null;
        reviewedAt: bigint | null;
    }[]>>;
    getApproval(approvalId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    reviewApproval(user: AuthenticatedUser, approvalId: string, body: ReviewApprovalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    listSafetyIncidents(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
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
    listRiderServiceRequests(serviceType: 'rental' | 'tour' | 'ambulance' | undefined, status: string | undefined, riderId: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }[]>>;
    getRiderServiceRequest(requestId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }>>;
    listAgents(req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region?: string;
        metadata?: Record<string, unknown>;
        createdAt: number;
        updatedAt: number;
    }[]>>;
    getAgent(agentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region?: string;
        metadata?: Record<string, unknown>;
        createdAt: number;
        updatedAt: number;
    }>>;
    createAgent(user: AuthenticatedUser, body: {
        name: string;
        email: string;
        role: string;
        region?: string;
        status?: 'active' | 'inactive';
        metadata?: Record<string, unknown>;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region: string | undefined;
        metadata: Record<string, unknown> | undefined;
        createdAt: number;
        updatedAt: number;
    }>>;
    patchAgent(user: AuthenticatedUser, agentId: string, body: Partial<{
        name: string;
        email: string;
        role: string;
        region: string;
        status: 'active' | 'inactive';
        metadata: Record<string, unknown>;
    }>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        updatedAt: number;
        name: string;
        email: string;
        role: string;
        region?: string;
        status: "active" | "inactive";
        metadata?: Record<string, unknown>;
        id: string;
        createdAt: number;
    }>>;
    deleteAgent(user: AuthenticatedUser, agentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    search(query: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        query: string;
        totals: {
            users: number;
            riders: number;
            drivers: number;
            companies: number;
            trips: number;
        };
        results: {
            users: {
                roles: string[];
                email: string;
                phone: string | null;
                status: import(".prisma/client").$Enums.UserStatus;
                id: string;
                password: string;
                isActive: boolean;
                isEmailVerified: boolean;
                isPhoneVerified: boolean;
                driverId: string | null;
                riderId: string | null;
                fleetId: string | null;
                adminId: string | null;
                createdAt: Date;
                updatedAt: Date;
            }[];
            riders: {
                firstName: string | null;
                lastName: string | null;
                email: string | null;
                phone: string | null;
                fullName: string | null;
                city: string | null;
                country: string | null;
                id: string;
                riderId: string | null;
                userId: string;
                preferredCurrency: string;
                preferences: import("@prisma/client/runtime/client").JsonValue;
                rating: import("@prisma/client-runtime-utils").Decimal;
                totalTrips: number;
            }[];
            drivers: {
                firstName: string | null;
                lastName: string | null;
                email: string | null;
                phone: string | null;
                fullName: string | null;
                city: string | null;
                country: string | null;
                status: import(".prisma/client").$Enums.DriverStatus;
                id: string;
                driverId: string | null;
                fleetId: string | null;
                userId: string;
                preferences: import("@prisma/client/runtime/client").JsonValue;
                rating: import("@prisma/client-runtime-utils").Decimal;
                totalTrips: number;
                branchId: string | null;
                driverLicenseNumber: string | null;
                serviceMode: import(".prisma/client").$Enums.DriverServiceMode;
                checkpoints: import("@prisma/client/runtime/client").JsonValue;
                onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
                lastLocationAt: Date | null;
            }[];
            companies: {
                status: import(".prisma/client").$Enums.FleetPartnerStatus;
                companyName: string;
                contactEmail: string | null;
                contactPhone: string | null;
                registrationNumber: string | null;
                taxId: string | null;
                id: string;
                fleetId: string | null;
                userId: string;
                verticals: import("@prisma/client/runtime/client").JsonValue;
            }[];
            trips: {
                status: import(".prisma/client").$Enums.TripStatus;
                type: import(".prisma/client").$Enums.TripType;
                id: string;
                driverId: string | null;
                riderId: string;
                fleetId: string | null;
                createdAt: Date;
                updatedAt: Date;
                rating: import("@prisma/client/runtime/client").JsonValue | null;
                fleetPartnerId: string | null;
                pickupLocation: import("@prisma/client/runtime/client").JsonValue;
                dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
                pickup: string | null;
                dropoff: string | null;
                pickupAddress: string;
                dropoffAddress: string;
                route: import("@prisma/client/runtime/client").JsonValue | null;
                fare: import("@prisma/client-runtime-utils").Decimal;
                driverEarnings: import("@prisma/client-runtime-utils").Decimal;
                platformFee: import("@prisma/client-runtime-utils").Decimal;
                payment: import("@prisma/client/runtime/client").JsonValue | null;
                otpCode: string | null;
                scheduledAt: Date | null;
                startedAt: Date | null;
                completedAt: Date | null;
                cancelledAt: Date | null;
                cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
                driverArrivedAt: Date | null;
            }[];
        };
    }>>;
}
