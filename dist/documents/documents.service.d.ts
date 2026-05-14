import { PrismaService } from '../prisma/prisma.service';
type UserType = 'driver' | 'rider' | 'fleet' | 'admin';
type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired';
export declare class DocumentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertForUser(userType: UserType, userId: string, input: {
        documentType: string;
        fileUrl: string;
        expiryDate: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: string;
        fileUrl: string;
        expiryDate: string;
        rejectionReason: string | null;
        userType: string;
    }>;
    listForUser(userType: UserType, userId: string): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: string;
        fileUrl: string;
        expiryDate: string;
        rejectionReason: string | null;
        userType: string;
    }[]>;
    getDocumentsStatusForUser(userType: UserType, userId: string): Promise<{
        userType: UserType;
        documents: ({
            id: string;
            documentType: string;
            fileUrl: string;
            expiryDate: string;
            reviewStatus: string;
            expiryStatus: ExpiryStatus;
            daysUntilExpiry: null;
        } | {
            id: string;
            documentType: string;
            fileUrl: string;
            expiryDate: string;
            reviewStatus: import(".prisma/client").$Enums.DocumentStatus;
            expiryStatus: ExpiryStatus;
            daysUntilExpiry: number;
        })[];
    }>;
    patchForUser(userType: UserType, userId: string, documentId: string, patch: Partial<{
        status: string;
        rejectionReason: string;
        fileUrl: string;
        expiryDate: string;
    }>): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: string;
        fileUrl: string;
        expiryDate: string;
        rejectionReason: string | null;
        userType: string;
    }>;
    resubmitForUser(userType: UserType, userId: string, documentId: string, input: {
        fileUrl?: string;
        expiryDate?: string;
    }): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        documentType: string;
        fileUrl: string;
        expiryDate: string;
        rejectionReason: string | null;
        userType: string;
    }>;
    deleteForUser(userType: UserType, userId: string, documentId: string): Promise<{
        deleted: boolean;
    }>;
    private buildStatusPayload;
    private ensureFutureDate;
    private parseDate;
    private getDaysUntilExpiry;
    private getExpiryStatus;
}
export {};
