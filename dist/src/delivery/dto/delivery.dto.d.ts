export declare class CreateDeliveryOrderDto {
    pickupAddress: string;
    dropoffAddress: string;
    pickupLat?: number;
    pickupLng?: number;
}
export declare class VerifyDeliveryQrDto {
    qrValue: string;
    scanType?: string;
}
