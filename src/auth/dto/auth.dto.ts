import { ArrayMaxSize, IsArray, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  @IsIn(['rider', 'driver', 'fleet_owner'], { each: true })
  roles?: Array<'rider' | 'driver' | 'fleet_owner'>;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;

  @IsOptional()
  @IsString()
  newPassword?: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}
