import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PatchFleetBranchDto, UpdateFleetProfileDto, UpsertFleetBranchDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';
export declare class FleetController {
    private readonly fleetService;
    private readonly apiResponse;
    constructor(fleetService: FleetService, apiResponse: ApiResponseService);
    getProfile(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-partner-profile.entity").FleetPartnerProfile>>;
    patchProfile(user: AuthenticatedUser, body: UpdateFleetProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-partner-profile.entity").FleetPartnerProfile>>;
    listBranches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-branch.entity").FleetBranch[]>>;
    createBranch(user: AuthenticatedUser, body: UpsertFleetBranchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-branch.entity").FleetBranch>>;
    patchBranch(user: AuthenticatedUser, branchId: string, body: PatchFleetBranchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<import("../entities/fleet-branch.entity").FleetBranch>>;
    deleteBranch(user: AuthenticatedUser, branchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
