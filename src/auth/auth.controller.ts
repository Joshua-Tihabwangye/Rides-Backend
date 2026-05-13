import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiResponseService } from '../common/api/api-response.service';
import {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { getRequestId } from '../common/utils/request-id';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private apiResponse: ApiResponseService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @Req() req: Request) {
    const result = await this.authService.register(body);
    return this.apiResponse.success({ code: 'REGISTER_SUCCESS', message: 'Registration successful', requestId: getRequestId(req), data: result });
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const result = await this.authService.login(body.email, body.password);
    return this.apiResponse.success({ code: 'LOGIN_SUCCESS', message: 'Login successful', requestId: getRequestId(req), data: result });
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto, @Req() req: Request) {
    const result = await this.authService.refresh(body.refreshToken);
    return this.apiResponse.success({ code: 'TOKEN_REFRESHED', message: 'Token refreshed', requestId: getRequestId(req), data: result });
  }

  @Post('logout')
  async logout(@Body() body: LogoutDto, @Req() req: Request) {
    await this.authService.logout(body.refreshToken);
    return this.apiResponse.success({ code: 'LOGOUT_SUCCESS', message: 'Logged out successfully', requestId: getRequestId(req), data: null });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    const result = await this.authService.requestPasswordReset(dto.email);
    return this.apiResponse.success({
      code: 'PASSWORD_RESET_INITIATED',
      message: result.sent ? 'Password reset OTP sent' : 'Failed to send OTP',
      requestId: getRequestId(req),
      data: result,
    });
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Req() req: Request) {
    const result = await this.authService.verifyOtp(dto.email, dto.otp);
    return this.apiResponse.success({ code: 'OTP_VERIFIED', message: 'OTP verified', requestId: getRequestId(req), data: result });
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const result = await this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
    return this.apiResponse.success({ code: 'PASSWORD_RESET_COMPLETE', message: 'Password reset successful', requestId: getRequestId(req), data: result });
  }
}
