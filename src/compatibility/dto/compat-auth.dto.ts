import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CompatSignInDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  selectedService?: string;
}
