import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { PatchFleetBranchDto, UpdateFleetProfileDto, UpsertFleetBranchDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';
export declare class FleetController {
    private readonly fleetService;
    private readonly apiResponse;
    constructor(fleetService: FleetService, apiResponse: ApiResponseService);
    getProfile(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    patchProfile(user: AuthenticatedUser, body: UpdateFleetProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        status: import(".prisma/client").$Enums.FleetPartnerStatus;
        companyName: string;
        contactEmail: string | null;
        contactPhone: string | null;
        registrationNumber: string | null;
        taxId: string | null;
        id: string;
        fleetId: string | null;
        userId: string;
        verticals: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    listBranches(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }[]>>;
    getBranchById(user: AuthenticatedUser, branchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    createBranch(user: AuthenticatedUser, body: UpsertFleetBranchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    patchBranch(user: AuthenticatedUser, branchId: string, body: PatchFleetBranchDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        phone: string | null;
        city: string | null;
        country: string | null;
        name: string;
        id: string;
        fleetId: string | null;
        fleetPartnerId: string;
        address: string | null;
        managerName: string | null;
        operatingHours: import("@prisma/client/runtime/client").JsonValue;
    }>>;
    deleteBranch(user: AuthenticatedUser, branchId: string, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
