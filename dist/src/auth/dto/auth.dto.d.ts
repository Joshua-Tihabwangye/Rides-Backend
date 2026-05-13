export declare class RegisterDto {
    email: string;
    password: string;
    phone?: string;
    fullName?: string;
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
