export declare class UpdateAdminProfileDto {
    firstName?: string;
    lastName?: string;
    department?: string;
    permissions?: string[];
}
export declare class CreateAdminUserDto {
    email: string;
    phone?: string;
    roles?: string[];
    fullName?: string;
    city?: string;
    country?: string;
}
export declare class UpdateAdminUserDto {
    email?: string;
    phone?: string;
    fullName?: string;
    city?: string;
    country?: string;
    roles?: string[];
    status?: 'active' | 'deleted';
}
export declare class CreateAdminRoleDto {
    name: string;
    description?: string;
    permissions: string[];
}
export declare class UpdateAdminRoleDto {
    description?: string;
    permissions?: string[];
}
export declare class CreateAdminCompanyDto {
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    registrationNumber?: string;
    taxId?: string;
}
export declare class UpdateAdminCompanyDto {
    companyName?: string;
    contactEmail?: string;
    contactPhone?: string;
    registrationNumber?: string;
    taxId?: string;
    status?: 'pending' | 'approved' | 'suspended';
}
export declare class ReviewApprovalDto {
    decision: 'approved' | 'rejected';
    notes?: string;
}
export declare class AdminAnalyticsQueryDto {
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}
export declare class CreatePricingConfigDto {
    name: string;
    service: string;
    pricingRules: Record<string, unknown>;
}
export declare class UpdatePricingConfigDto {
    name?: string;
    service?: string;
    status?: 'active' | 'inactive';
    pricingRules?: Record<string, unknown>;
}
export declare class CreatePromoDto {
    code: string;
    description: string;
    discountType: 'percent' | 'flat';
    discountValue: number;
}
export declare class UpdatePromoDto {
    description?: string;
    discountType?: 'percent' | 'flat';
    discountValue?: number;
    status?: 'draft' | 'active' | 'expired';
}
export declare class CreateServiceConfigDto {
    key: string;
    name: string;
    enabled?: boolean;
    configuration: Record<string, unknown>;
}
export declare class UpdateServiceConfigDto {
    name?: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
}
export declare class UpdateFeatureFlagDto {
    enabled?: boolean;
    description?: string;
}
