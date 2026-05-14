import { PrismaService } from '../prisma/prisma.service';
import type { AppBehaviorContract, AppCanonicalContract, AppId, CompatibilityBootstrapPayload } from './contracts.types';
export declare class CompatibilityContractService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly contracts;
    private readonly canonicalContracts;
    getContracts(): AppBehaviorContract[];
    getCanonicalContracts(): AppCanonicalContract[];
    getContract(appId: AppId): AppBehaviorContract;
    getCanonicalContract(appId: AppId): AppCanonicalContract;
    getBootstrap(appId: AppId): CompatibilityBootstrapPayload;
    getRuntimeFlags(appId: AppId): Promise<{
        appId: AppId;
        backendEnabled: boolean;
        flags: {
            description: string | null;
            key: string;
            enabled: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            scope: import(".prisma/client").$Enums.FeatureFlagScope;
        }[];
    }>;
    signInCompat(appId: AppId, input: {
        email: string;
        fullName?: string;
        selectedService?: string;
    }): {
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
    };
}
