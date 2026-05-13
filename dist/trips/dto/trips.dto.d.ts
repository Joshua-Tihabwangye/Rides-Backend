export declare class TripsQueryDto {
    type?: string;
    status?: string;
    cursor?: string;
}
export declare class VerifyRiderDto {
    otp: string;
}
export declare class CancelTripDto {
    reason?: string;
    details?: string;
    cancelledBy?: 'driver' | 'rider' | 'system';
}
