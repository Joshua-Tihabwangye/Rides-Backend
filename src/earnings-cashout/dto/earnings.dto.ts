import { IsIn, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class EarningsSummaryQueryDto {
  @IsOptional()
  @IsIn(['day', 'week', 'month', 'quarter', 'year'])
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export class CashoutRequestDto {
  @IsString()
  methodId!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;
}
