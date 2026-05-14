import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PatchDocumentDto, UpsertDocumentDto } from './dto/document.dto';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    private readonly apiResponse;
    constructor(documentsService: DocumentsService, apiResponse: ApiResponseService);
    postDocument(user: AuthenticatedUser, userTypeParam: string, body: UpsertDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    listDocuments(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }[]>>;
    getStatus(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        userType: "rider" | "driver" | "fleet" | "admin";
        documents: ({
            id: string;
            documentType: string;
            fileUrl: string;
            expiryDate: string;
            reviewStatus: string;
            expiryStatus: "expired" | "valid" | "expiring_soon";
            daysUntilExpiry: null;
        } | {
            id: string;
            documentType: string;
            fileUrl: string;
            expiryDate: string;
            reviewStatus: import(".prisma/client").$Enums.DocumentStatus;
            expiryStatus: "expired" | "valid" | "expiring_soon";
            daysUntilExpiry: number;
        })[];
    }>>;
    patchDocument(user: AuthenticatedUser, userTypeParam: string, documentId: string, body: PatchDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    resubmit(user: AuthenticatedUser, userTypeParam: string, documentId: string, body: PatchDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    deleteDocument(user: AuthenticatedUser, userTypeParam: string, documentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
