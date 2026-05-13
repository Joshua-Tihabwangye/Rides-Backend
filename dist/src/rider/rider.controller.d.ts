import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { RequestRiderTripDto, UpdateRiderProfileDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderService } from './rider.service';
export declare class RiderController {
    private readonly riderService;
    private readonly apiResponse;
    constructor(riderService: RiderService, apiResponse: ApiResponseService);
    getMe(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    getProfile(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    patchMe(user: AuthenticatedUser, body: UpdateRiderProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/rider-profile.entity").RiderProfile>>;
    listTripHistory(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip[]>>;
    getActiveTrip(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip | null>>;
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
    updateTripTracking(user: AuthenticatedUser, tripId: string, body: UpdateRiderTripTrackingDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
}
