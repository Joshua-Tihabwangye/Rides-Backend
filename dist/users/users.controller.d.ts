import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    private readonly apiResponse;
    constructor(usersService: UsersService, apiResponse: ApiResponseService);
    getMe(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>>;
    patchMe(user: AuthenticatedUser, body: UpdateUserDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        id: string;
        email: string;
        phone: string;
        roles: string[];
        status: string;
    }>>;
    deleteMe(user: AuthenticatedUser, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        deleted: boolean;
    }>>;
}
