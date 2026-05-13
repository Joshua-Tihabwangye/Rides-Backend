import { IsOptional, IsString } from 'class-validator';

export class CursorPaginationQueryDto {
  @IsOptional()
  @IsString()
  cursor?: string;
}
