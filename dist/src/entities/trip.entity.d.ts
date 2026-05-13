export type TripStatus = 'requested' | 'driver_assigned' | 'driver_arriving' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type TripType = 'ride' | 'delivery' | 'rental' | 'tour' | 'ambulance' | 'school';
export declare class Trip {
    id: string;
    riderId: string;
    driverId: string;
    fleetPartnerId: string;
    fleetId: string;
    type: TripType;
    status: TripStatus;
    pickupLocation: {
        lat: number;
        lng: number;
    };
    dropoffLocation: {
        lat: number;
        lng: number;
    };
    pickup: string;
    dropoff: string;
    pickupAddress: string;
    dropoffAddress: string;
    route: Record<string, any>;
    fare: number;
    driverEarnings: number;
    platformFee: number;
    payment: Record<string, any>;
    otpCode: string;
    scheduledAt: Date;
    startedAt: Date;
    completedAt: Date;
    cancelledAt: Date;
    cancellationReason: Record<string, any>;
    rating: Record<string, any>;
    driverArrivedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
