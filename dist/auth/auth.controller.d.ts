import type { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiResponseService } from '../common/api/api-response.service';
import { ForgotPasswordDto, LoginDto, LogoutDto, RefreshDto, RegisterDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    private apiResponse;
    constructor(authService: AuthService, apiResponse: ApiResponseService);
    register(body: RegisterDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    login(body: LoginDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    refresh(body: RefreshDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>>;
    logout(body: LogoutDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<null>>;
    forgotPassword(dto: ForgotPasswordDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        sent: boolean;
    }>>;
    verifyOtp(dto: VerifyOtpDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        verified: boolean;
        resetRequired?: boolean;
    }>>;
    resetPassword(dto: ResetPasswordDto, req: Request): Promise<import("../common/api/api.types").ApiSuccessResponse<{
        reset: boolean;
    }>>;
}
