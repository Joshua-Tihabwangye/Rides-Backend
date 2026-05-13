import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { RedisService } from '../redis/redis.service';
export declare class AuthService {
    private userRepo;
    private roleRepo;
    private userRoleRepo;
    private redis;
    private readonly logger;
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    private readonly REFRESH_EXPIRES_IN;
    constructor(userRepo: Repository<User>, roleRepo: Repository<Role>, userRoleRepo: Repository<UserRole>, redis: RedisService);
    register(data: {
        email: string;
        password: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        roles?: string[];
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
    private generateTokens;
    verifyAccessToken(token: string): {
        sub: string;
        email: string;
        roles: string[];
    };
}
