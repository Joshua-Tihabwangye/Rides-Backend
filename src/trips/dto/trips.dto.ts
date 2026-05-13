import { IsIn, IsOptional, IsString } from 'class-validator';

export class TripsQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  cursor?: string;
}

export class VerifyRiderDto {
  @IsString()
  otp!: string;
}

export class CancelTripDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsIn(['driver', 'rider', 'system'])
  cancelledBy?: 'driver' | 'rider' | 'system';
}
