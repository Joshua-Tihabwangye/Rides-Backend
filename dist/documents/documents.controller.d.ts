import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PatchDocumentDto, UpsertDocumentDto } from './dto/document.dto';
import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    private readonly apiResponse;
    constructor(documentsService: DocumentsService, apiResponse: ApiResponseService);
    postDocument(user: AuthenticatedUser, userTypeParam: string, body: UpsertDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/user-document.entity").UserDocument>>;
    listDocuments(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/user-document.entity").UserDocument[]>>;
    getStatus(user: AuthenticatedUser, userTypeParam: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        userType: "driver" | "rider" | "fleet" | "admin";
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
            reviewStatus: string;
            expiryStatus: "expired" | "valid" | "expiring_soon";
            daysUntilExpiry: number;
        })[];
    }>>;
    patchDocument(user: AuthenticatedUser, userTypeParam: string, documentId: string, body: PatchDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/user-document.entity").UserDocument>>;
    resubmit(user: AuthenticatedUser, userTypeParam: string, documentId: string, body: PatchDocumentDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/user-document.entity").UserDocument>>;
    deleteDocument(user: AuthenticatedUser, userTypeParam: string, documentId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
