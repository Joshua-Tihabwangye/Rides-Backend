import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateDriverProfileDto {
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
}

export class UpdateDriverPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areaIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirementIds?: string[];
}
