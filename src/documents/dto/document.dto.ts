import { IsIn, IsOptional, IsString, Matches } from 'class-validator';

export class UpsertDocumentDto {
  @IsString()
  documentType!: string;

  @IsString()
  fileUrl!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  expiryDate!: string;
}

export class PatchDocumentDto {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  expiryDate?: string;

  @IsOptional()
  @IsIn(['pending', 'under_review', 'verified', 'rejected'])
  status?: 'pending' | 'under_review' | 'verified' | 'rejected';

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
