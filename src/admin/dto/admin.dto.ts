import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateAdminProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class CreateAdminUserDto {
  @IsString()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsIn(['active', 'deleted'])
  status?: 'active' | 'deleted';
}

export class CreateAdminRoleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}

export class UpdateAdminRoleDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class CreateAdminCompanyDto {
  @IsString()
  companyName!: string;

  @IsString()
  contactEmail!: string;

  @IsString()
  contactPhone!: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpdateAdminCompanyDto {
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

  @IsOptional()
  @IsIn(['pending', 'approved', 'suspended'])
  status?: 'pending' | 'approved' | 'suspended';
}

export class ReviewApprovalDto {
  @IsIn(['approved', 'rejected'])
  decision!: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AdminAnalyticsQueryDto {
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'quarter', 'year'])
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export class CreatePricingConfigDto {
  @IsString()
  name!: string;

  @IsString()
  service!: string;

  @IsObject()
  pricingRules!: Record<string, unknown>;
}

export class UpdatePricingConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsObject()
  pricingRules?: Record<string, unknown>;
}

export class CreatePromoDto {
  @IsString()
  code!: string;

  @IsString()
  description!: string;

  @IsIn(['percent', 'flat'])
  discountType!: 'percent' | 'flat';

  @Type(() => Number)
  @IsNumber()
  discountValue!: number;
}

export class UpdatePromoDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['percent', 'flat'])
  discountType?: 'percent' | 'flat';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsIn(['draft', 'active', 'expired'])
  status?: 'draft' | 'active' | 'expired';
}

export class CreateServiceConfigDto {
  @IsString()
  key!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsObject()
  configuration!: Record<string, unknown>;
}

export class UpdateServiceConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}

export class UpdateFeatureFlagDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePricingZoneDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  boundaries!: Record<string, unknown>; // GeoJSON Polygon

  @IsObject()
  pricingRules!: Record<string, unknown>;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class UpdatePricingZoneDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  boundaries?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  pricingRules?: Record<string, unknown>;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
