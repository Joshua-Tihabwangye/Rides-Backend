import { PrismaService } from '../prisma/prisma.service';
export declare class DriverProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(driverId: string): Promise<{
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
    }>;
    updateProfile(driverId: string, patch: Partial<{
        fullName: string;
        phone: string;
        city: string;
        country: string;
    }>): Promise<{
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
    }>;
    getPreferences(driverId: string): Promise<Record<string, unknown>>;
    updatePreferences(driverId: string, patch: Partial<{
        areaIds: string[];
        serviceIds: string[];
        requirementIds: string[];
    }>): Promise<{
        areaIds?: string[] | undefined;
        serviceIds?: string[] | undefined;
        requirementIds?: string[] | undefined;
    }>;
    getCheckpoints(driverId: string): Promise<{
        onboardingComplete: boolean;
    }>;
}
