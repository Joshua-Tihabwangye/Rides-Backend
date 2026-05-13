import { IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  make!: string;

  @IsString()
  model!: string;

  @IsInt()
  @Min(1980)
  year!: number;

  @IsString()
  plate!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'maintenance'])
  status?: 'active' | 'inactive' | 'maintenance';
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1980)
  year?: number;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['active', 'inactive', 'maintenance'])
  status?: 'active' | 'inactive' | 'maintenance';
}

export class UpdateAccessoriesDto {
  @IsObject()
  accessories!: Record<string, 'Available' | 'Missing' | 'Required'>;
}

export class UploadVehicleDocumentDto {
  @IsString()
  documentType!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  expiryDate!: string;
}
