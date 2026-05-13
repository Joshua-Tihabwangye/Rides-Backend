import { Repository } from 'typeorm';
import { UserDocument } from '../entities/user-document.entity';
type UserType = 'driver' | 'rider' | 'fleet' | 'admin';
type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired';
export declare class DocumentsService {
    private documentRepo;
    constructor(documentRepo: Repository<UserDocument>);
    upsertForUser(userType: UserType, userId: string, input: {
        documentType: string;
        fileUrl: string;
        expiryDate: string;
    }): Promise<UserDocument>;
    listForUser(userType: UserType, userId: string): Promise<UserDocument[]>;
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
            reviewStatus: string;
            expiryStatus: ExpiryStatus;
            daysUntilExpiry: number;
        })[];
    }>;
    patchForUser(userType: UserType, userId: string, documentId: string, patch: Partial<{
        status: string;
        rejectionReason: string;
        fileUrl: string;
        expiryDate: string;
    }>): Promise<UserDocument>;
    resubmitForUser(userType: UserType, userId: string, documentId: string, input: {
        fileUrl?: string;
        expiryDate?: string;
    }): Promise<UserDocument>;
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
