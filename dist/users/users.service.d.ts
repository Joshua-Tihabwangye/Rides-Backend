import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>;
    patchMe(userId: string, patch: {
        email?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>;
    deleteMe(userId: string): Promise<{
        deleted: boolean;
    }>;
}
