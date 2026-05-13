import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { DriverProfileService } from './driver-profile.service';
import { UpdateDriverPreferencesDto, UpdateDriverProfileDto } from './dto/driver-profile.dto';
export declare class DriverProfileController {
    private readonly driverProfileService;
    private readonly apiResponse;
    constructor(driverProfileService: DriverProfileService, apiResponse: ApiResponseService);
    getMe(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/driver-profile.entity").DriverProfile>>;
    patchMe(user: AuthenticatedUser, body: UpdateDriverProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/driver-profile.entity").DriverProfile>>;
    getPreferences(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, any>>>;
    patchPreferences(user: AuthenticatedUser, body: UpdateDriverPreferencesDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<Record<string, any>>>;
}
