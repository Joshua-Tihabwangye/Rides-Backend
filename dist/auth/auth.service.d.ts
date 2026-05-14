import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class AuthService {
    private readonly prisma;
    private redis;
    private readonly logger;
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly REFRESH_EXPIRES_IN;
    constructor(prisma: PrismaService, redis: RedisService);
    register(data: {
        email: string;
        password: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        roles?: Array<'rider' | 'driver' | 'fleet_owner'>;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    logout(refreshToken: string): Promise<void>;
    requestPasswordReset(email: string): Promise<{
        sent: boolean;
    }>;
    verifyOtp(email: string, otp: string): Promise<{
        verified: boolean;
        resetRequired?: boolean;
    }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        reset: boolean;
    }>;
    private generateTokens;
    verifyAccessToken(token: string): {
        sub: string;
        email: string;
        roles: string[];
    };
}
