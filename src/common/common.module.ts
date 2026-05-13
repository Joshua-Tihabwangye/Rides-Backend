import { Global, Module } from '@nestjs/common';
import { ApiResponseService } from './api/api-response.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [ApiResponseService, JwtAuthGuard, RolesGuard],
  exports: [ApiResponseService, JwtAuthGuard, RolesGuard],
})
export class CommonModule {}
