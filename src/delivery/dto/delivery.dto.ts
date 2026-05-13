import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryOrderDto {
  @IsString()
  pickupAddress!: string;

  @IsString()
  dropoffAddress!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pickupLat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pickupLng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dropoffLat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dropoffLng?: number;

  @IsOptional()
  @IsString()
  itemDescription?: string;

  @IsOptional()
  @IsString()
  routeSummary?: string;
}

export class VerifyDeliveryQrDto {
  @IsString()
  qrValue!: string;

  @IsOptional()
  @IsString()
  scanType?: string;
}

export class PatchRiderDeliveryDto {
  @IsOptional()
  @IsIn(['requested', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed'])
  status?: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'failed';
}

export class CancelRiderDeliveryDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
