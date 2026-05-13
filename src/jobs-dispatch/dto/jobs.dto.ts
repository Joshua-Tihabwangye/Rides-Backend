import { IsOptional, IsString } from 'class-validator';

export class JobsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class RejectJobDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
