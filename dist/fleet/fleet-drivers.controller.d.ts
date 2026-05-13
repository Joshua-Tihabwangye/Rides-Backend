import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { CreateFleetDriverDto, UpdateFleetDriverDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';
export declare class FleetDriversController {
    private readonly fleetService;
    private readonly apiResponse;
    constructor(fleetService: FleetService, apiResponse: ApiResponseService);
    list(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-driver.entity").FleetDriver[]>>;
    create(user: AuthenticatedUser, body: CreateFleetDriverDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-driver.entity").FleetDriver>>;
    patch(user: AuthenticatedUser, driverId: string, body: UpdateFleetDriverDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-driver.entity").FleetDriver>>;
    getById(user: AuthenticatedUser, driverId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-driver.entity").FleetDriver>>;
    deleteById(user: AuthenticatedUser, driverId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
