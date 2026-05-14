import type { Request, Response } from 'express';
import { DocumentsService } from '../documents/documents.service';
import { JobsDispatchService } from '../jobs-dispatch/jobs-dispatch.service';
export declare class CompatibilityController {
    private readonly documentsService;
    private readonly jobsDispatchService;
    constructor(documentsService: DocumentsService, jobsDispatchService: JobsDispatchService);
    postLegacyDocument(driverId: string, body: {
        documentType: string;
        fileUrl: string;
        expiryDate: string;
    }, res: Response): Promise<{
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
    getLegacyDocumentStatus(driverId: string, res: Response): Promise<{
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
    }>;
    getLegacyOrders(driverId: string, req: Request, res: Response): Promise<{
        code: string;
        message: string;
        requestId: string | string[];
        orders?: undefined;
    } | {
        orders: {
            status: import(".prisma/client").$Enums.JobOfferStatus;
            type: string | null;
            expiresAt: Date | null;
            id: string;
            driverId: string;
            riderId: string | null;
            createdAt: Date;
            tripId: string;
            pickupLocation: import("@prisma/client/runtime/client").JsonValue | null;
            dropoffLocation: import("@prisma/client/runtime/client").JsonValue | null;
            pickup: string | null;
            dropoff: string | null;
            route: import("@prisma/client/runtime/client").JsonValue | null;
            estimatedFare: import("@prisma/client-runtime-utils").Decimal;
            respondedAt: Date | null;
        }[];
        code?: undefined;
        message?: undefined;
        requestId?: undefined;
    }>;
}
