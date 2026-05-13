import { AuthService } from './auth.service';
import { ApiResponseService } from '../common/api/api-response.service';
export declare class AuthController {
    private authService;
    private apiResponse;
    constructor(authService: AuthService, apiResponse: ApiResponseService);
    register(body: {
        email: string;
        password: string;
        phone?: string;
        roles?: string[];
    }): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    login(body: {
        email: string;
        password: string;
    }): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    refresh(body: {
        refreshToken: string;
    }): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    logout(body: {
        refreshToken: string;
    }): Promise<import("../common/api/api.types").ApiSuccessResponse<null>>;
}
