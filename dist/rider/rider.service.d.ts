import { PrismaService } from '../prisma/prisma.service';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import type { RequestRiderTripDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
export declare class RiderService {
    private readonly prisma;
    private readonly presenceLocationService?;
    private readonly realtimeGateway?;
    private readonly riderRealtimeGateway?;
    private readonly commuteStore;
    private readonly paymentIntentStore;
    constructor(prisma: PrismaService, presenceLocationService?: PresenceLocationService | undefined, realtimeGateway?: RealtimeGateway | undefined, riderRealtimeGateway?: RiderRealtimeGateway | undefined);
    getProfile(userId: string): Promise<{
        preferences: any;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        userId: string;
        preferredCurrency: string;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }>;
    updateProfile(userId: string, patch: Partial<{
        fullName: string;
        phone: string;
        city: string;
        country: string;
        preferredCurrency: string;
    }>): Promise<{
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
        fullName: string | null;
        city: string | null;
        country: string | null;
        id: string;
        riderId: string | null;
        userId: string;
        preferredCurrency: string;
        preferences: import("@prisma/client/runtime/client").JsonValue;
        rating: import("@prisma/client-runtime-utils").Decimal;
        totalTrips: number;
    }>;
    getPreferences(userId: string): Promise<{
        preferredLanguages: any[];
        notificationSettings: {
            email: any;
            sms: any;
            push: any;
        };
        privacySettings: {
            shareLocation: any;
            shareRideHistory: any;
        };
        ridePreferences: {
            vehicleType: any;
            comfortLevel: any;
        };
        emergencyContacts: any[];
        sosHistory: any[];
    }>;
    patchPreferences(userId: string, patch: Record<string, unknown>): Promise<{
        preferredLanguages: any[];
        notificationSettings: {
            email: any;
            sms: any;
            push: any;
        };
        privacySettings: {
            shareLocation: any;
            shareRideHistory: any;
        };
        ridePreferences: {
            vehicleType: any;
            comfortLevel: any;
        };
        emergencyContacts: any[];
        sosHistory: any[];
    }>;
    listEmergencyContacts(userId: string): Promise<any[]>;
    createEmergencyContact(userId: string, input: {
        name: string;
        phone: string;
        relationship: string;
        isPrimary?: boolean;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        phone: string;
        relationship: string;
        isPrimary: boolean;
    }>;
    patchEmergencyContact(userId: string, contactId: string, patch: Partial<{
        name: string;
        phone: string;
        relationship: string;
        isPrimary: boolean;
    }>): Promise<any>;
    deleteEmergencyContact(userId: string, contactId: string): Promise<{
        deleted: boolean;
    }>;
    triggerSos(userId: string, input: {
        message?: string;
        location?: {
            lat?: number;
            lng?: number;
        };
        type?: 'sos' | 'emergency';
        tripId?: string;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        tripId: string | undefined;
        type: "sos" | "emergency";
        location: {
            lat: number;
            lng: number;
        } | undefined;
        message: string | undefined;
        status: "active";
        createdAt: number;
    }>;
    listSosHistory(userId: string): Promise<any[]>;
    getWallet(userId: string): Promise<{
        balance: number;
        currency: string;
        pendingAmount: number;
        lastUpdatedAt: number;
    }>;
    listWalletTransactions(userId: string, limit?: number, offset?: number): Promise<{
        id: string;
        type: "adjustment" | "top_up" | "ride_payment" | "delivery_payment" | "rental_payment" | "tour_payment" | "ambulance_payment" | "refund";
        amount: number;
        currency: string;
        status: "completed";
        description: any;
        createdAt: number;
        relatedTripId: string | undefined;
    }[]>;
    listPaymentMethods(userId: string): Promise<{
        id: string;
        type: string;
        label: string;
        enabled: boolean;
        isDefault: boolean;
    }[]>;
    createPaymentIntent(userId: string, input: {
        amount: number;
        currency?: string;
        serviceType?: string;
        referenceId?: string;
        methodId?: string;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        userId: string;
        amount: number;
        currency: string;
        methodId: string;
        serviceType: string;
        referenceId: string | undefined;
        status: string;
        createdAt: number;
    }>;
    verifyPaymentIntent(userId: string, intentId: string, input: {
        verificationCode?: string;
    }): Promise<Record<string, unknown>>;
    listEligiblePromos(userId: string): Promise<{
        code: string;
        description: string;
        discountType: string;
        discountValue: number;
    }[]>;
    applyPromo(userId: string, input: {
        code: string;
        orderAmount?: number;
    }): Promise<{
        code: string;
        applied: boolean;
        discountAmount: number;
        currency: string;
        finalAmount: number;
    }>;
    listCommutes(userId: string): Promise<Record<string, unknown>[]>;
    createCommute(userId: string, input: {
        name?: string;
        pickupAddress: string;
        dropoffAddress: string;
        schedule?: Record<string, unknown>;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        pickupAddress: string;
        dropoffAddress: string;
        schedule: Record<string, unknown>;
        active: boolean;
        createdAt: number;
        updatedAt: number;
    }>;
    patchCommute(userId: string, commuteId: string, patch: Record<string, unknown>): Promise<Record<string, unknown>>;
    deleteCommute(userId: string, commuteId: string): Promise<{
        deleted: boolean;
    }>;
    createWalletTransfer(userId: string, input: {
        amount: number;
        destination: string;
        method?: string;
        note?: string;
    }): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        amount: number;
        currency: string;
        destination: string;
        method: string;
        note: string | undefined;
        status: string;
        createdAt: number;
    }>;
    listWalletTransfers(userId: string): Promise<Record<string, unknown>[]>;
    listRentals(userId: string): Promise<{
        id: any;
        riderId: any;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }[]>;
    getRentalById(userId: string, rentalId: string): Promise<{
        id: any;
        riderId: any;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>;
    createRental(userId: string, input: {
        vehicleId: string;
        startDate: string;
        endDate: string;
        pickupLocation?: {
            lat: number;
            lng: number;
            address: string;
        };
    }): Promise<{
        id: any;
        riderId: any;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>;
    patchRental(userId: string, rentalId: string, patch: Partial<Record<string, unknown>>): Promise<{
        id: any;
        riderId: any;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>;
    cancelRental(userId: string, rentalId: string, reason?: string): Promise<{
        id: any;
        riderId: any;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>;
    listTours(userId: string): Promise<{
        id: any;
        riderId: any;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }[]>;
    getTourById(userId: string, tourId: string): Promise<{
        id: any;
        riderId: any;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>;
    createTour(userId: string, input: {
        tourId: string;
        scheduledDate: string;
        participantsCount: number;
        specialRequests?: string;
    }): Promise<{
        id: any;
        riderId: any;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>;
    cancelTour(userId: string, tourId: string, reason?: string): Promise<{
        id: any;
        riderId: any;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>;
    listAmbulances(userId: string): Promise<{
        id: any;
        riderId: any;
        driverId: any;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }[]>;
    getAmbulanceById(userId: string, ambulanceId: string): Promise<{
        id: any;
        riderId: any;
        driverId: any;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>;
    createAmbulance(userId: string, input: {
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress?: string;
        hospitalName?: string;
        priority?: 'normal' | 'urgent' | 'emergency';
    }): Promise<{
        id: any;
        riderId: any;
        driverId: any;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>;
    patchAmbulance(userId: string, ambulanceId: string, patch: Partial<Record<string, unknown>>): Promise<{
        id: any;
        riderId: any;
        driverId: any;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>;
    cancelAmbulance(userId: string, ambulanceId: string, reason?: string): Promise<{
        id: any;
        riderId: any;
        driverId: any;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>;
    listTrips(userId: string): Promise<{
        status: import(".prisma/client").$Enums.TripStatus;
        type: import(".prisma/client").$Enums.TripType;
        id: string;
        driverId: string | null;
        riderId: string;
        fleetId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/client").JsonValue | null;
        fleetPartnerId: string | null;
        pickupLocation: import("@prisma/client/runtime/client").JsonValue;
        dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
        pickup: string | null;
        dropoff: string | null;
        pickupAddress: string;
        dropoffAddress: string;
        route: import("@prisma/client/runtime/client").JsonValue | null;
        fare: import("@prisma/client-runtime-utils").Decimal;
        driverEarnings: import("@prisma/client-runtime-utils").Decimal;
        platformFee: import("@prisma/client-runtime-utils").Decimal;
        payment: import("@prisma/client/runtime/client").JsonValue | null;
        otpCode: string | null;
        scheduledAt: Date | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
        driverArrivedAt: Date | null;
    }[]>;
    getActiveTrip(userId: string): Promise<{
        status: import(".prisma/client").$Enums.TripStatus;
        type: import(".prisma/client").$Enums.TripType;
        id: string;
        driverId: string | null;
        riderId: string;
        fleetId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/client").JsonValue | null;
        fleetPartnerId: string | null;
        pickupLocation: import("@prisma/client/runtime/client").JsonValue;
        dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
        pickup: string | null;
        dropoff: string | null;
        pickupAddress: string;
        dropoffAddress: string;
        route: import("@prisma/client/runtime/client").JsonValue | null;
        fare: import("@prisma/client-runtime-utils").Decimal;
        driverEarnings: import("@prisma/client-runtime-utils").Decimal;
        platformFee: import("@prisma/client-runtime-utils").Decimal;
        payment: import("@prisma/client/runtime/client").JsonValue | null;
        otpCode: string | null;
        scheduledAt: Date | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
        driverArrivedAt: Date | null;
    } | null>;
    getTripById(userId: string, tripId: string): Promise<{
        status: import(".prisma/client").$Enums.TripStatus;
        type: import(".prisma/client").$Enums.TripType;
        id: string;
        driverId: string | null;
        riderId: string;
        fleetId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/client").JsonValue | null;
        fleetPartnerId: string | null;
        pickupLocation: import("@prisma/client/runtime/client").JsonValue;
        dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
        pickup: string | null;
        dropoff: string | null;
        pickupAddress: string;
        dropoffAddress: string;
        route: import("@prisma/client/runtime/client").JsonValue | null;
        fare: import("@prisma/client-runtime-utils").Decimal;
        driverEarnings: import("@prisma/client-runtime-utils").Decimal;
        platformFee: import("@prisma/client-runtime-utils").Decimal;
        payment: import("@prisma/client/runtime/client").JsonValue | null;
        otpCode: string | null;
        scheduledAt: Date | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
        driverArrivedAt: Date | null;
    }>;
    requestTrip(userId: string, input: RequestRiderTripDto): Promise<{
        trip: {
            status: import(".prisma/client").$Enums.TripStatus;
            type: import(".prisma/client").$Enums.TripType;
            id: string;
            driverId: string | null;
            riderId: string;
            fleetId: string | null;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client/runtime/client").JsonValue | null;
            fleetPartnerId: string | null;
            pickupLocation: import("@prisma/client/runtime/client").JsonValue;
            dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
            pickup: string | null;
            dropoff: string | null;
            pickupAddress: string;
            dropoffAddress: string;
            route: import("@prisma/client/runtime/client").JsonValue | null;
            fare: import("@prisma/client-runtime-utils").Decimal;
            driverEarnings: import("@prisma/client-runtime-utils").Decimal;
            platformFee: import("@prisma/client-runtime-utils").Decimal;
            payment: import("@prisma/client/runtime/client").JsonValue | null;
            otpCode: string | null;
            scheduledAt: Date | null;
            startedAt: Date | null;
            completedAt: Date | null;
            cancelledAt: Date | null;
            cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
            driverArrivedAt: Date | null;
        };
        jobOffers: {
            distanceMeters: number;
            status: import(".prisma/client").$Enums.JobOfferStatus;
            type: string | null;
            expiresAt: Date | null;
            id: string;
            driverId: string;
            riderId: string | null;
            createdAt: Date;
            tripId: string;
            pickupLocation: import("@prisma/client/runtime/client").JsonValue | null;
            dropoffLocation: import("@prisma/client/runtime/client").JsonValue | null;
            pickup: string | null;
            dropoff: string | null;
            route: import("@prisma/client/runtime/client").JsonValue | null;
            estimatedFare: import("@prisma/client-runtime-utils").Decimal;
            respondedAt: Date | null;
        }[];
        nearbyDriverCount: number;
    }>;
    updateTripTracking(userId: string, tripId: string, patch: UpdateRiderTripTrackingDto): Promise<{
        status: import(".prisma/client").$Enums.TripStatus;
        type: import(".prisma/client").$Enums.TripType;
        id: string;
        driverId: string | null;
        riderId: string;
        fleetId: string | null;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client/runtime/client").JsonValue | null;
        fleetPartnerId: string | null;
        pickupLocation: import("@prisma/client/runtime/client").JsonValue;
        dropoffLocation: import("@prisma/client/runtime/client").JsonValue;
        pickup: string | null;
        dropoff: string | null;
        pickupAddress: string;
        dropoffAddress: string;
        route: import("@prisma/client/runtime/client").JsonValue | null;
        fare: import("@prisma/client-runtime-utils").Decimal;
        driverEarnings: import("@prisma/client-runtime-utils").Decimal;
        platformFee: import("@prisma/client-runtime-utils").Decimal;
        payment: import("@prisma/client/runtime/client").JsonValue | null;
        otpCode: string | null;
        scheduledAt: Date | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledAt: Date | null;
        cancellationReason: import("@prisma/client/runtime/client").JsonValue | null;
        driverArrivedAt: Date | null;
    }>;
    private createRequestedTrip;
    private mapTrackingStatus;
    private mapRentalRecord;
    private mapTourRecord;
    private mapAmbulanceRecord;
    private normalizeRentalStatus;
    private normalizeTourStatus;
    private normalizeAmbulanceStatus;
    private normalizePriority;
    private publishRiderServiceEvent;
    private normalizeRiderPreferences;
    private deepMerge;
    private mapWalletTransactionType;
}
