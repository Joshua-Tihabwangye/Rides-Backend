export declare class UpdateRiderProfileDto {
    fullName?: string;
    phone?: string;
    city?: string;
    country?: string;
    preferredCurrency?: string;
}
export declare class RequestRiderTripDto {
    type?: string;
    pickupLabel?: string;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLabel?: string;
    dropoffLat: number;
    dropoffLng: number;
    radiusMeters?: number;
    routeSummary?: string;
}
export declare class UpdateRiderTripTrackingDto {
    status?: 'assigned' | 'driver_en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
    etaMinutes?: number;
    routeSummary?: string;
    distance?: string;
}
export declare class PatchRiderPreferencesDto {
    patch?: Record<string, unknown>;
}
export declare class CreateRiderEmergencyContactDto {
    name: string;
    phone: string;
    relationship: string;
    isPrimary?: boolean;
}
export declare class UpdateRiderEmergencyContactDto {
    name?: string;
    phone?: string;
    relationship?: string;
    isPrimary?: boolean;
}
export declare class TriggerRiderSosDto {
    message?: string;
    location?: {
        lat?: number;
        lng?: number;
    };
    type?: 'sos' | 'emergency';
    tripId?: string;
}
export declare class CreateRiderRentalDto {
    vehicleId: string;
    startDate: string;
    endDate: string;
    pickupLocation?: {
        lat: number;
        lng: number;
        address: string;
    };
}
export declare class PatchRiderRentalDto {
    vehicleName?: string;
    startDate?: string;
    endDate?: string;
    status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
    totalAmount?: number;
}
export declare class CreateRiderTourDto {
    tourId: string;
    scheduledDate: string;
    participantsCount: number;
    specialRequests?: string;
}
export declare class CreateRiderAmbulanceDto {
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress?: string;
    hospitalName?: string;
    priority?: 'normal' | 'urgent' | 'emergency';
}
export declare class PatchRiderAmbulanceDto {
    dropoffAddress?: string;
    hospitalName?: string;
    priority?: 'normal' | 'urgent' | 'emergency';
    status?: 'requested' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
}
export declare class CancelRiderServiceDto {
    reason?: string;
}
