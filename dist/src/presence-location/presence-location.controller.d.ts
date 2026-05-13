import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { UpdateLocationDto } from './dto/location.dto';
import { PresenceLocationService } from './presence-location.service';
export declare class PresenceLocationController {
    private readonly presenceLocationService;
    private readonly apiResponse;
    constructor(presenceLocationService: PresenceLocationService, apiResponse: ApiResponseService);
    goOnline(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
    }>>;
    goOffline(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: string;
    }>>;
    patchLocation(user: AuthenticatedUser, body: UpdateLocationDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        driverId: string;
        latitude: number;
        longitude: number;
        accuracy: number | undefined;
        timestamp: number;
    }>>;
    heartbeat(user: AuthenticatedUser, body: UpdateLocationDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        driverId: string;
        latitude: number;
        longitude: number;
        accuracy: number | undefined;
        timestamp: number;
    }>>;
}
