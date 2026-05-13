import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { OnboardingService } from './onboarding.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller('drivers/me/onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('checkpoints')
  getCheckpoints(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'DRIVER_ONBOARDING_CHECKPOINTS_FETCHED',
      message: 'Onboarding checkpoints fetched',
      requestId: getRequestId(req),
      data: this.onboardingService.getCheckpoints(driverId),
    });
  }
}
