import { Repository } from 'typeorm';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import type { RequestRiderTripDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderProfile } from '../entities/rider-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';
export declare class RiderService {
    private riderProfileRepo;
    private tripRepo;
    private jobOfferRepo;
    private notificationRepo;
    private userRepo;
    private walletRepo;
    private earningsLedgerRepo;
    private riderServiceRequestRepo;
    private readonly presenceLocationService?;
    private readonly realtimeGateway?;
    private readonly riderRealtimeGateway?;
    constructor(riderProfileRepo: Repository<RiderProfile>, tripRepo: Repository<Trip>, jobOfferRepo: Repository<JobOffer>, notificationRepo: Repository<Notification>, userRepo: Repository<User>, walletRepo: Repository<WalletAccount>, earningsLedgerRepo: Repository<EarningsLedger>, riderServiceRequestRepo: Repository<RiderServiceRequest>, presenceLocationService?: PresenceLocationService | undefined, realtimeGateway?: RealtimeGateway | undefined, riderRealtimeGateway?: RiderRealtimeGateway | undefined);
    getProfile(userId: string): Promise<RiderProfile>;
    updateProfile(userId: string, patch: Partial<{
        fullName: string;
        phone: string;
        city: string;
        country: string;
        preferredCurrency: string;
    }>): Promise<RiderProfile>;
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
    listRentals(userId: string): Promise<{
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
    }[]>;
    getRentalById(userId: string, rentalId: string): Promise<{
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
    }>;
    patchRental(userId: string, rentalId: string, patch: Partial<Record<string, unknown>>): Promise<{
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
    }>;
    cancelRental(userId: string, rentalId: string, reason?: string): Promise<{
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
    }>;
    listTours(userId: string): Promise<{
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
    }[]>;
    getTourById(userId: string, tourId: string): Promise<{
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
    }>;
    createTour(userId: string, input: {
        tourId: string;
        scheduledDate: string;
        participantsCount: number;
        specialRequests?: string;
    }): Promise<{
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
    }>;
    cancelTour(userId: string, tourId: string, reason?: string): Promise<{
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
    }>;
    listAmbulances(userId: string): Promise<{
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
    }[]>;
    getAmbulanceById(userId: string, ambulanceId: string): Promise<{
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
    }>;
    createAmbulance(userId: string, input: {
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress?: string;
        hospitalName?: string;
        priority?: 'normal' | 'urgent' | 'emergency';
    }): Promise<{
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
    }>;
    patchAmbulance(userId: string, ambulanceId: string, patch: Partial<Record<string, unknown>>): Promise<{
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
    }>;
    cancelAmbulance(userId: string, ambulanceId: string, reason?: string): Promise<{
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
    }>;
    listTrips(userId: string): Promise<Trip[]>;
    getActiveTrip(userId: string): Promise<Trip | null>;
    getTripById(userId: string, tripId: string): Promise<Trip>;
    requestTrip(userId: string, input: RequestRiderTripDto): Promise<{
        trip: Trip;
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
    }>;
    updateTripTracking(userId: string, tripId: string, patch: UpdateRiderTripTrackingDto): Promise<Trip>;
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
