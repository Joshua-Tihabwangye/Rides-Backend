import { Repository } from 'typeorm';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import type { RequestRiderTripDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderProfile } from '../entities/rider-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
export declare class RiderService {
    private riderProfileRepo;
    private tripRepo;
    private jobOfferRepo;
    private notificationRepo;
    private userRepo;
    private readonly presenceLocationService?;
    private readonly realtimeGateway?;
    constructor(riderProfileRepo: Repository<RiderProfile>, tripRepo: Repository<Trip>, jobOfferRepo: Repository<JobOffer>, notificationRepo: Repository<Notification>, userRepo: Repository<User>, presenceLocationService?: PresenceLocationService | undefined, realtimeGateway?: RealtimeGateway | undefined);
    getProfile(userId: string): Promise<RiderProfile>;
    updateProfile(userId: string, patch: Partial<{
        fullName: string;
        phone: string;
        city: string;
        country: string;
        preferredCurrency: string;
    }>): Promise<RiderProfile>;
    listTrips(userId: string): Promise<Trip[]>;
    getActiveTrip(userId: string): Promise<Trip | null>;
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
}
