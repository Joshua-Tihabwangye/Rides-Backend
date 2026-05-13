export declare class UpdateRiderProfileDto {
    fullName?: string;
    phone?: string;
    city?: string;
    country?: string;
    preferredCurrency?: string;
}
export declare class RequestRiderTripDto {
    type?: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    radiusMeters?: number;
}
export declare class UpdateRiderTripTrackingDto {
    status?: 'assigned' | 'driver_en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
    etaMinutes?: number;
    routeSummary?: string;
    distance?: string;
}
