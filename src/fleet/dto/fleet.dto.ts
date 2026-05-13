import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateFleetProfileDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpsertFleetBranchDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, unknown>;
}

export class PatchFleetBranchDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, unknown>;
}

export class CreateFleetDriverDto {
  @IsString()
  fullName!: string;

  @IsString()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  serviceModes?: string[];
}

export class UpdateFleetDriverDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

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
  branchId?: string;

  @IsOptional()
  @IsIn(['invited', 'active', 'suspended'])
  status?: 'invited' | 'active' | 'suspended';

  @IsOptional()
  serviceModes?: string[];
}

export class CreateFleetDispatchDto {
  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  pickup!: string;

  @IsString()
  dropoff!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateFleetServiceDto {
  @IsString()
  customerName!: string;

  @IsOptional()
  @IsString()
  assetId?: string;

  @Type(() => Number)
  @IsNumber()
  scheduledAt!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class FleetEarningsQueryDto {
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'quarter', 'year'])
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export class CreateFleetComplianceIncidentDto {
  @IsString()
  category!: string;

  @IsIn(['low', 'medium', 'high', 'critical'])
  severity!: 'low' | 'medium' | 'high' | 'critical';

  @IsString()
  description!: string;
}

export class CreateFleetTrainingCourseDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
