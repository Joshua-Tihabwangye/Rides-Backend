import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { UpdateAdminProfileDto } from './dto/admin.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    private readonly apiResponse;
    constructor(adminService: AdminService, apiResponse: ApiResponseService);
    getProfile(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        firstName: string | null;
        lastName: string | null;
        department: string | null;
        permissions: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        userId: string;
    }>>;
    patchProfile(user: AuthenticatedUser, body: UpdateAdminProfileDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        firstName: string | null;
        lastName: string | null;
        department: string | null;
        permissions: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        userId: string;
    }>>;
}
