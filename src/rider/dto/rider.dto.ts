import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateRiderProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  preferredCurrency?: string;
}

export class RequestRiderTripDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  pickupLabel?: string;

  @IsString()
  pickupAddress!: string;

  @Type(() => Number)
  @IsNumber()
  pickupLat!: number;

  @Type(() => Number)
  @IsNumber()
  pickupLng!: number;

  @IsString()
  dropoffAddress!: string;

  @IsOptional()
  @IsString()
  dropoffLabel?: string;

  @Type(() => Number)
  @IsNumber()
  dropoffLat!: number;

  @Type(() => Number)
  @IsNumber()
  dropoffLng!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsString()
  routeSummary?: string;
}

export class UpdateRiderTripTrackingDto {
  @IsOptional()
  @IsString()
  status?:
    | 'assigned'
    | 'driver_en_route'
    | 'arrived'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  etaMinutes?: number;

  @IsOptional()
  @IsString()
  routeSummary?: string;

  @IsOptional()
  @IsString()
  distance?: string;
}

export class PatchRiderPreferencesDto {
  @IsOptional()
  @IsObject()
  patch?: Record<string, unknown>;
}

export class CreateRiderEmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  relationship!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateRiderEmergencyContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class TriggerRiderSosDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsObject()
  location?: {
    lat?: number;
    lng?: number;
  };

  @IsOptional()
  @IsIn(['sos', 'emergency'])
  type?: 'sos' | 'emergency';

  @IsOptional()
  @IsString()
  tripId?: string;
}

export class CreateRiderRentalDto {
  @IsString()
  vehicleId!: string;

  @IsString()
  startDate!: string;

  @IsString()
  endDate!: string;

  @IsOptional()
  @IsObject()
  pickupLocation?: { lat: number; lng: number; address: string };
}

export class PatchRiderRentalDto {
  @IsOptional()
  @IsString()
  vehicleName?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsIn(['upcoming', 'active', 'completed', 'cancelled'])
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalAmount?: number;
}

export class CreateRiderTourDto {
  @IsString()
  tourId!: string;

  @IsString()
  scheduledDate!: string;

  @Type(() => Number)
  @IsNumber()
  participantsCount!: number;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}

export class CreateRiderAmbulanceDto {
  @IsString()
  pickupAddress!: string;

  @Type(() => Number)
  @IsNumber()
  pickupLat!: number;

  @Type(() => Number)
  @IsNumber()
  pickupLng!: number;

  @IsOptional()
  @IsString()
  dropoffAddress?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsIn(['normal', 'urgent', 'emergency'])
  priority?: 'normal' | 'urgent' | 'emergency';
}

export class PatchRiderAmbulanceDto {
  @IsOptional()
  @IsString()
  dropoffAddress?: string;

  @IsOptional()
  @IsString()
  hospitalName?: string;

  @IsOptional()
  @IsIn(['normal', 'urgent', 'emergency'])
  priority?: 'normal' | 'urgent' | 'emergency';

  @IsOptional()
  @IsIn(['requested', 'dispatched', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'])
  status?: 'requested' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
}

export class CancelRiderServiceDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
