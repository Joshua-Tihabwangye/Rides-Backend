export declare class UpdateFleetProfileDto {
    companyName?: string;
    contactEmail?: string;
    contactPhone?: string;
    registrationNumber?: string;
    taxId?: string;
}
export declare class UpsertFleetBranchDto {
    name: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    managerName?: string;
    operatingHours?: Record<string, unknown>;
}
export declare class PatchFleetBranchDto {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
    managerName?: string;
    operatingHours?: Record<string, unknown>;
}
export declare class CreateFleetDriverDto {
    fullName: string;
    email: string;
    phone: string;
    city?: string;
    country?: string;
    branchId?: string;
    serviceModes?: string[];
}
export declare class UpdateFleetDriverDto {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
    country?: string;
    branchId?: string;
    status?: 'invited' | 'active' | 'suspended';
    serviceModes?: string[];
}
export declare class CreateFleetDispatchDto {
    driverId?: string;
    vehicleId?: string;
    type?: string;
    pickup: string;
    dropoff: string;
    notes?: string;
}
export declare class CreateFleetServiceDto {
    customerName: string;
    assetId?: string;
    scheduledAt: number;
    notes?: string;
}
export declare class FleetEarningsQueryDto {
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}
export declare class CreateFleetComplianceIncidentDto {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
}
export declare class CreateFleetTrainingCourseDto {
    title: string;
    assignedTo?: string;
}
