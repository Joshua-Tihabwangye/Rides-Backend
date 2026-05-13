export declare class UserDocument {
    id: string;
    userId: string;
    userType: string;
    documentType: string;
    fileUrl: string;
    expiryDate: string;
    status: string;
    rejectionReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
