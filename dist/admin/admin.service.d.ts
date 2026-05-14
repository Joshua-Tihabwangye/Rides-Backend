import { PrismaService } from '../prisma/prisma.service';
import { AdminRealtimeGateway } from '../realtime/scoped-realtime.gateway';
export type AuditMeta = {
    actorId: string;
    ipAddress?: string;
    userAgent?: string | string[];
};
export declare class AdminService {
    private readonly prisma;
    private readonly adminRealtimeGateway;
    private readonly agentStore;
    private readonly taxConfigStore;
    private readonly invoiceTemplateStore;
    private readonly trainingModuleStore;
    private readonly policyStore;
    private readonly verticalPolicyStore;
    constructor(prisma: PrismaService, adminRealtimeGateway: AdminRealtimeGateway);
    getProfile(userId: string): Promise<{
        firstName: string | null;
        lastName: string | null;
        department: string | null;
        permissions: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        userId: string;
    }>;
    updateProfile(userId: string, patch: Partial<{
        firstName: string;
        lastName: string;
        department: string;
        permissions: string[];
    }>): Promise<{
        firstName: string | null;
        lastName: string | null;
        department: string | null;
        permissions: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        userId: string;
    }>;
    listRiders(): Promise<{
        userId: string | undefined;
        status: import(".prisma/client").$Enums.UserStatus;
        roles: string[];
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        preferredCurrency: string;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }[]>;
    getRider(riderId: string): Promise<{
        userId: string;
        status: import(".prisma/client").$Enums.UserStatus;
        roles: string[];
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        preferredCurrency: string;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }>;
    createRider(actorId: string, input: {
        email: string;
        phone?: string;
        fullName?: string;
        city?: string;
        country?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        userId: string;
        roles: string[];
        status: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        preferredCurrency: string;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }>;
    patchRider(actorId: string, userId: string, patch: Partial<{
        fullName: string;
        email: string;
        phone: string;
        city: string;
        country: string;
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        userId: string | undefined;
        roles: string[];
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        preferredCurrency: string;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }>;
    listDrivers(): Promise<{
        userId: string | undefined;
        roles: string[];
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        driverId: string | null;
        fleetId: string | null;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
        branchId: string | null;
        driverLicenseNumber: string | null;
        serviceMode: import(".prisma/client").$Enums.DriverServiceMode;
        checkpoints: import("@prisma/client/runtime/client").JsonValue;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        lastLocationAt: Date | null;
    }[]>;
    getDriver(driverId: string): Promise<{
        userId: string;
        roles: string[];
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        driverId: string | null;
        fleetId: string | null;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
        branchId: string | null;
        driverLicenseNumber: string | null;
        serviceMode: import(".prisma/client").$Enums.DriverServiceMode;
        checkpoints: import("@prisma/client/runtime/client").JsonValue;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        lastLocationAt: Date | null;
    }>;
    createDriver(actorId: string, input: {
        email: string;
        phone?: string;
        fullName?: string;
        city?: string;
        country?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        userId: string;
        roles: string[];
        status: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        driverId: string | null;
        fleetId: string | null;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
        branchId: string | null;
        driverLicenseNumber: string | null;
        serviceMode: import(".prisma/client").$Enums.DriverServiceMode;
        checkpoints: import("@prisma/client/runtime/client").JsonValue;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        lastLocationAt: Date | null;
    }>;
    patchDriver(actorId: string, userId: string, patch: Partial<{
        fullName: string;
        email: string;
        phone: string;
        city: string;
        country: string;
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        userId: string | undefined;
        roles: string[];
        status: import(".prisma/client").$Enums.UserStatus;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        driverId: string | null;
        fleetId: string | null;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
        branchId: string | null;
        driverLicenseNumber: string | null;
        serviceMode: import(".prisma/client").$Enums.DriverServiceMode;
        checkpoints: import("@prisma/client/runtime/client").JsonValue;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        lastLocationAt: Date | null;
    }>;
    listUsers(): Promise<{
        profileType: string;
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
    }[]>;
    createUser(actorId: string, input: {
        email: string;
        phone?: string;
        roles: string[];
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    patchUser(actorId: string, userId: string, patch: Partial<{
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    listRoles(): Promise<{
        permissions: string[];
        name: string;
        description: string | null;
        id: string;
    }[]>;
    getRole(roleId: string): Promise<{
        permissions: string[];
        name: string;
        description: string | null;
        id: string;
    }>;
    createRole(actorId: string, input: {
        name: string;
        description?: string;
        permissions: string[];
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        permissions: string[];
        name: string;
        description: string | null;
        id: string;
    }>;
    patchRole(actorId: string, roleId: string, patch: Partial<{
        description?: string;
        permissions: string[];
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        permissions: string[];
        name: string;
        description: string | null;
        id: string;
    }>;
    listCompanies(): Promise<{
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
    }[]>;
    getCompany(companyId: string): Promise<{
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
    }>;
    createCompany(actorId: string, input: {
        companyName: string;
        contactEmail: string;
        contactPhone: string;
        registrationNumber?: string;
        taxId?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    patchCompany(actorId: string, companyId: string, patch: Partial<{
        companyName: string;
        contactEmail: string;
        contactPhone: string;
        registrationNumber?: string;
        taxId?: string;
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    listApprovals(): Promise<{
        status: import(".prisma/client").$Enums.ApprovalStatus;
        notes: string | null;
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.ApprovalEntityType;
        entityId: string;
        requestedBy: string;
        reviewedBy: string | null;
        reviewedAt: bigint | null;
    }[]>;
    getApproval(approvalId: string): Promise<{
        status: import(".prisma/client").$Enums.ApprovalStatus;
        notes: string | null;
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.ApprovalEntityType;
        entityId: string;
        requestedBy: string;
        reviewedBy: string | null;
        reviewedAt: bigint | null;
    }>;
    reviewApproval(actorId: string, approvalId: string, input: {
        decision: 'approved' | 'rejected';
        notes?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.ApprovalStatus;
        notes: string | null;
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.ApprovalEntityType;
        entityId: string;
        requestedBy: string;
        reviewedBy: string | null;
        reviewedAt: bigint | null;
    }>;
    getOperationsAnalytics(period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
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
    }>;
    getFinanceAnalytics(period?: 'day' | 'week' | 'month' | 'quarter' | 'year'): Promise<{
        period: "day" | "week" | "month" | "quarter" | "year";
        grossEarnings: number;
        earningsCount: number;
        payoutsPending: number;
        walletExposure: number;
        currency: string;
    }>;
    listSafetyIncidents(): Promise<{
        type: import(".prisma/client").$Enums.SafetyEventType;
        id: string;
        driverId: string;
        createdAt: Date;
        tripId: string;
        payload: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    listRiskCases(): Promise<{
        status: import(".prisma/client").$Enums.RiskStatus;
        notes: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        subjectType: string;
        subjectId: string;
    }[]>;
    listRiderServiceRequests(query?: Partial<{
        serviceType: 'rental' | 'tour' | 'ambulance';
        status: string;
        riderId: string;
    }>): Promise<{
        id: string;
        riderId: string;
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }[]>;
    getRiderServiceRequest(requestId: string): Promise<{
        id: string;
        riderId: string;
        driverId: string | null;
        serviceType: import(".prisma/client").$Enums.ServiceRequestType;
        status: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        createdAt: number;
        updatedAt: number;
    }>;
    getRiskCase(riskCaseId: string): Promise<{
        status: import(".prisma/client").$Enums.RiskStatus;
        notes: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        severity: import(".prisma/client").$Enums.RiskSeverity;
        subjectType: string;
        subjectId: string;
    }>;
    listPricing(): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        service: string;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPricing(pricingId: string): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        service: string;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPricing(actorId: string, input: {
        name: string;
        service: string;
        pricingRules: Record<string, unknown>;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        service: string;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    patchPricing(actorId: string, pricingId: string, patch: Partial<{
        name: string;
        service: string;
        status: string;
        pricingRules: Record<string, unknown>;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        service: string;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listPromos(): Promise<{
        status: import(".prisma/client").$Enums.PromoStatus;
        description: string;
        code: string;
        discountType: import(".prisma/client").$Enums.PromoDiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPromo(promoId: string): Promise<{
        status: import(".prisma/client").$Enums.PromoStatus;
        description: string;
        code: string;
        discountType: import(".prisma/client").$Enums.PromoDiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createPromo(actorId: string, input: {
        code: string;
        description: string;
        discountType: string;
        discountValue: number;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PromoStatus;
        description: string;
        code: string;
        discountType: import(".prisma/client").$Enums.PromoDiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    patchPromo(actorId: string, promoId: string, patch: Partial<{
        description: string;
        discountType: string;
        discountValue: number;
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PromoStatus;
        description: string;
        code: string;
        discountType: import(".prisma/client").$Enums.PromoDiscountType;
        discountValue: import("@prisma/client-runtime-utils").Decimal;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listServices(): Promise<{
        name: string;
        key: string;
        enabled: boolean;
        configuration: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getService(serviceId: string): Promise<{
        name: string;
        key: string;
        enabled: boolean;
        configuration: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createServiceConfig(actorId: string, input: {
        key: string;
        name: string;
        enabled?: boolean;
        configuration: Record<string, unknown>;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        name: string;
        key: string;
        enabled: boolean;
        configuration: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    patchServiceConfig(actorId: string, serviceId: string, patch: Partial<{
        name: string;
        enabled: boolean;
        configuration: Record<string, unknown>;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        name: string;
        key: string;
        enabled: boolean;
        configuration: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAuditLog(): Promise<{
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
    }[]>;
    getFlags(): Promise<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }[]>;
    patchFeatureFlag(actorId: string, flagKey: string, patch: Partial<{
        enabled: boolean;
        description: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        description: string | null;
        key: string;
        enabled: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        scope: import(".prisma/client").$Enums.FeatureFlagScope;
    }>;
    listAgents(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region?: string;
        metadata?: Record<string, unknown>;
        createdAt: number;
        updatedAt: number;
    }[]>;
    getAgent(agentId: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region?: string;
        metadata?: Record<string, unknown>;
        createdAt: number;
        updatedAt: number;
    }>;
    createAgent(actorId: string, input: {
        name: string;
        email: string;
        role: string;
        region?: string;
        status?: 'active' | 'inactive';
        metadata?: Record<string, unknown>;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: "active" | "inactive";
        region: string | undefined;
        metadata: Record<string, unknown> | undefined;
        createdAt: number;
        updatedAt: number;
    }>;
    patchAgent(actorId: string, agentId: string, patch: Partial<{
        name: string;
        email: string;
        role: string;
        region: string;
        status: 'active' | 'inactive';
        metadata: Record<string, unknown>;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        updatedAt: number;
        name: string;
        email: string;
        role: string;
        region?: string;
        status: "active" | "inactive";
        metadata?: Record<string, unknown>;
        id: string;
        createdAt: number;
    }>;
    deleteAgent(actorId: string, agentId: string, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        deleted: boolean;
    }>;
    searchAdmin(query: string): Promise<{
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
    }>;
    getTaxConfig(): Promise<{
        regionId: string;
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes?: string;
        updatedAt: number;
    }[]>;
    patchTaxConfig(actorId: string, regionId: string, patch: Partial<{
        currency: string;
        vatPercent: number;
        serviceTaxPercent: number;
        surchargePercent: number;
        notes: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    getInvoiceTemplates(): Promise<{
        id: string;
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer?: string;
        updatedAt: number;
    }[]>;
    patchInvoiceTemplate(actorId: string, templateId: string, patch: Partial<{
        regionId: string;
        templateName: string;
        prefix: string;
        nextNumber: number;
        footer: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    listTrainingModules(): Promise<{
        id: string;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        version: number;
        content?: string;
        updatedAt: number;
        createdAt: number;
    }[]>;
    createTrainingModule(actorId: string, input: {
        title: string;
        category: string;
        status?: 'draft' | 'published' | 'archived';
        content?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        id: string;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        content: string | undefined;
        version: number;
        createdAt: number;
        updatedAt: number;
    }>;
    patchTrainingModule(actorId: string, moduleId: string, patch: Partial<{
        title: string;
        category: string;
        status: 'draft' | 'published' | 'archived';
        content: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        version: number;
        updatedAt: number;
        title: string;
        category: string;
        status: "draft" | "published" | "archived";
        content?: string;
        id: string;
        createdAt: number;
    }>;
    deleteTrainingModule(actorId: string, moduleId: string, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        deleted: boolean;
    }>;
    listPolicies(): Promise<{
        id: string;
        key: string;
        title: string;
        scope: "global" | "rider" | "driver" | "fleet" | "admin";
        status: "draft" | "active" | "archived";
        content: string;
        version: number;
        updatedAt: number;
        createdAt: number;
    }[]>;
    createPolicy(actorId: string, input: {
        key: string;
        title: string;
        scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin';
        status?: 'draft' | 'active' | 'archived';
        content: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        id: string;
        key: string;
        title: string;
        scope: "rider" | "driver" | "fleet" | "admin" | "global";
        status: "active" | "draft" | "archived";
        content: string;
        version: number;
        createdAt: number;
        updatedAt: number;
    }>;
    patchPolicy(actorId: string, policyId: string, patch: Partial<{
        key: string;
        title: string;
        scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin';
        status: 'draft' | 'active' | 'archived';
        content: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        version: number;
        updatedAt: number;
        key: string;
        title: string;
        scope: "global" | "rider" | "driver" | "fleet" | "admin";
        status: "draft" | "active" | "archived";
        content: string;
        id: string;
        createdAt: number;
    }>;
    listVerticalPolicies(): Promise<{
        verticalId: string;
        name: string;
        status: "active" | "inactive";
        rules: Record<string, unknown>;
        updatedAt: number;
    }[]>;
    patchVerticalPolicy(actorId: string, verticalId: string, patch: Partial<{
        name: string;
        status: 'active' | 'inactive';
        rules: Record<string, unknown>;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
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
    }>;
    getHealth(): Promise<{
        status: string;
        service: string;
        timestamp: string;
        modules: {
            users: number;
            trips: number;
            fleetCompanies: number;
            pendingApprovals: number;
        };
    }>;
    getOverview(): Promise<{
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
    }>;
    listPricingZones(): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createPricingZone(actorId: string, input: {
        name: string;
        description?: string;
        boundaries: any;
        pricingRules: Record<string, unknown>;
        status?: string;
    }, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    patchPricingZone(actorId: string, zoneId: string, patch: Partial<{
        name: string;
        description: string;
        boundaries: any;
        pricingRules: Record<string, unknown>;
        status: string;
    }>, meta?: Omit<AuditMeta, 'actorId'>): Promise<{
        status: import(".prisma/client").$Enums.PricingConfigStatus;
        name: string;
        description: string | null;
        pricingRules: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findPricingZoneByLocation(lat: number, lng: number): Promise<any>;
    private recordAudit;
    private periodThresholdDate;
    private pickDefined;
    private inferFeatureFlagScope;
}
