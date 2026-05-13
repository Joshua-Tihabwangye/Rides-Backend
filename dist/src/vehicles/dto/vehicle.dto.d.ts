export declare class CreateVehicleDto {
    make: string;
    model: string;
    year: number;
    plate: string;
    type: string;
    status?: 'active' | 'inactive' | 'maintenance';
}
export declare class UpdateVehicleDto {
    make?: string;
    model?: string;
    year?: number;
    plate?: string;
    type?: string;
    status?: 'active' | 'inactive' | 'maintenance';
}
export declare class UpdateAccessoriesDto {
    accessories: Record<string, 'Available' | 'Missing' | 'Required'>;
}
export declare class UploadVehicleDocumentDto {
    documentType: string;
    fileUrl: string;
    expiryDate: string;
}
