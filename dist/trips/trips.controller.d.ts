import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CancelTripDto, TripsQueryDto, VerifyRiderDto } from './dto/trips.dto';
import { TripsService } from './trips.service';
export declare class TripsController {
    private readonly tripsService;
    private readonly apiResponse;
    constructor(tripsService: TripsService, apiResponse: ApiResponseService);
    getActive(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip | null>>;
    list(user: AuthenticatedUser, query: TripsQueryDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        items: import("../entities/trip.entity").Trip[];
        nextCursor: string | null;
    }>>;
    getById(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    arrive(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    verifyRider(user: AuthenticatedUser, tripId: string, body: VerifyRiderDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    verifyRiderCompat(user: AuthenticatedUser, tripId: string, body: VerifyRiderDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    start(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    complete(user: AuthenticatedUser, tripId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
    cancel(user: AuthenticatedUser, tripId: string, body: CancelTripDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/trip.entity").Trip>>;
}
