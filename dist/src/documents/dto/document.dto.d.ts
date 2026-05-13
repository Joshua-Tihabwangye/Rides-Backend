export declare class UpsertDocumentDto {
    documentType: string;
    fileUrl: string;
    expiryDate: string;
}
export declare class PatchDocumentDto {
    fileUrl?: string;
    expiryDate?: string;
    status?: 'pending' | 'under_review' | 'verified' | 'rejected';
    rejectionReason?: string;
}
