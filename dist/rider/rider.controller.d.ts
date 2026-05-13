import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CancelRiderServiceDto, CreateRiderAmbulanceDto, CreateRiderRentalDto, CreateRiderEmergencyContactDto, CreateRiderTourDto, PatchRiderAmbulanceDto, PatchRiderPreferencesDto, PatchRiderRentalDto, RequestRiderTripDto, TriggerRiderSosDto, UpdateRiderEmergencyContactDto, UpdateRiderProfileDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderService } from './rider.service';
export declare class RiderController {
    private readonly riderService;
    private readonly apiResponse;
    constructor(riderService: RiderService, apiResponse: ApiResponseService);
    getMe(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    getProfile(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    patchMe(user: AuthenticatedUser, body: UpdateRiderProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    getPreferences(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    patchPreferences(user: AuthenticatedUser, body: PatchRiderPreferencesDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    listEmergencyContacts(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any[]>>;
    createEmergencyContact(user: AuthenticatedUser, body: CreateRiderEmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        phone: string;
        relationship: string;
        isPrimary: boolean;
    }>>;
    patchEmergencyContact(user: AuthenticatedUser, contactId: string, body: UpdateRiderEmergencyContactDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any>>;
    deleteEmergencyContact(user: AuthenticatedUser, contactId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    triggerSos(user: AuthenticatedUser, body: TriggerRiderSosDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
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
    }>>;
    listSosHistory(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<any[]>>;
    getWallet(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        balance: number;
        currency: string;
        pendingAmount: number;
        lastUpdatedAt: number;
    }>>;
    listWalletTransactions(user: AuthenticatedUser, limitRaw: string | undefined, offsetRaw: string | undefined, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        type: "adjustment" | "top_up" | "ride_payment" | "delivery_payment" | "rental_payment" | "tour_payment" | "ambulance_payment" | "refund";
        amount: number;
        currency: string;
        status: "completed";
        description: any;
        createdAt: number;
        relatedTripId: string | undefined;
    }[]>>;
    listPaymentMethods(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        type: string;
        label: string;
        enabled: boolean;
        isDefault: boolean;
    }[]>>;
    createPaymentIntent(user: AuthenticatedUser, body: {
        amount: number;
        currency?: string;
        serviceType?: string;
        referenceId?: string;
        methodId?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        userId: string;
        amount: number;
        currency: string;
        methodId: string;
        serviceType: string;
        referenceId: string | undefined;
        status: string;
        createdAt: number;
    }>>;
    verifyPaymentIntent(user: AuthenticatedUser, intentId: string, body: {
        verificationCode?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    listEligiblePromos(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        code: string;
        description: string;
        discountType: string;
        discountValue: number;
    }[]>>;
    applyPromo(user: AuthenticatedUser, body: {
        code: string;
        orderAmount?: number;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        code: string;
        applied: boolean;
        discountAmount: number;
        currency: string;
        finalAmount: number;
    }>>;
    listCommutes(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    createCommute(user: AuthenticatedUser, body: {
        name?: string;
        pickupAddress: string;
        dropoffAddress: string;
        schedule?: Record<string, unknown>;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        pickupAddress: string;
        dropoffAddress: string;
        schedule: Record<string, unknown>;
        active: boolean;
        createdAt: number;
        updatedAt: number;
    }>>;
    patchCommute(user: AuthenticatedUser, commuteId: string, body: Record<string, unknown>, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>>>;
    deleteCommute(user: AuthenticatedUser, commuteId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
    createWalletTransfer(user: AuthenticatedUser, body: {
        amount: number;
        destination: string;
        method?: string;
        note?: string;
    }, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        amount: number;
        currency: string;
        destination: string;
        method: string;
        note: string | undefined;
        status: string;
        createdAt: number;
    }>>;
    listWalletTransfers(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, unknown>[]>>;
    listTripHistory(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip[]>>;
    getActiveTrip(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip | null>>;
    getTripById(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    requestTrip(user: AuthenticatedUser, body: RequestRiderTripDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        trip: import("../entities/trip.entity").Trip;
        jobOffers: {
            distanceMeters: number;
            id: string;
            tripId: string;
            driverId: string;
            riderId: string;
            status: string;
            type: string;
            pickup: string;
            dropoff: string;
            pickupLocation: {
                lat: number;
                lng: number;
            };
            dropoffLocation: {
                lat: number;
                lng: number;
            };
            estimatedFare: number;
            route: Record<string, any>;
            expiresAt: Date;
            respondedAt: Date;
            createdAt: Date;
        }[];
        nearbyDriverCount: number;
    }>>;
    requestTripCompat(user: AuthenticatedUser, body: RequestRiderTripDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        trip: import("../entities/trip.entity").Trip;
        jobOffers: {
            distanceMeters: number;
            id: string;
            tripId: string;
            driverId: string;
            riderId: string;
            status: string;
            type: string;
            pickup: string;
            dropoff: string;
            pickupLocation: {
                lat: number;
                lng: number;
            };
            dropoffLocation: {
                lat: number;
                lng: number;
            };
            estimatedFare: number;
            route: Record<string, any>;
            expiresAt: Date;
            respondedAt: Date;
            createdAt: Date;
        }[];
        nearbyDriverCount: number;
    }>>;
    updateTripTracking(user: AuthenticatedUser, tripId: string, body: UpdateRiderTripTrackingDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    updateTripTrackingCompat(user: AuthenticatedUser, tripId: string, body: UpdateRiderTripTrackingDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    listRentals(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }[]>>;
    getRental(user: AuthenticatedUser, rentalId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>>;
    createRental(user: AuthenticatedUser, body: CreateRiderRentalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>>;
    patchRental(user: AuthenticatedUser, rentalId: string, body: PatchRiderRentalDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>>;
    cancelRental(user: AuthenticatedUser, rentalId: string, body: CancelRiderServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        vehicleId: string;
        vehicleName: string;
        status: "active" | "completed" | "cancelled" | "upcoming";
        startDate: string;
        endDate: string;
        totalAmount: number;
        currency: string;
        createdAt: number;
    }>>;
    listTours(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }[]>>;
    getTour(user: AuthenticatedUser, tourId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>>;
    createTour(user: AuthenticatedUser, body: CreateRiderTourDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>>;
    cancelTour(user: AuthenticatedUser, tourId: string, body: CancelRiderServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        tourId: string;
        tourName: string;
        status: "in_progress" | "completed" | "cancelled" | "booked";
        scheduledDate: string;
        participantsCount: number;
        totalPrice: number;
        currency: string;
        createdAt: number;
    }>>;
    listAmbulances(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | undefined;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }[]>>;
    getAmbulance(user: AuthenticatedUser, ambulanceId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | undefined;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>>;
    createAmbulance(user: AuthenticatedUser, body: CreateRiderAmbulanceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | undefined;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>>;
    patchAmbulance(user: AuthenticatedUser, ambulanceId: string, body: PatchRiderAmbulanceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | undefined;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>>;
    cancelAmbulance(user: AuthenticatedUser, ambulanceId: string, body: CancelRiderServiceDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        riderId: string;
        driverId: string | undefined;
        status: "requested" | "arrived" | "in_progress" | "completed" | "cancelled" | "dispatched" | "en_route";
        pickupAddress: string;
        dropoffAddress: string | undefined;
        hospitalName: string | undefined;
        priority: "emergency" | "normal" | "urgent";
        requestedAt: number;
        updatedAt: number;
    }>>;
}
