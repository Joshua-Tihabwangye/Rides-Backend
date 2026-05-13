export declare class RegisterDto {
    email: string;
    password: string;
    phone?: string;
    fullName?: string;
    roles?: Array<'rider' | 'driver' | 'fleet_owner'>;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken: string;
}
export declare class LogoutDto {
    refreshToken: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
    newPassword?: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
