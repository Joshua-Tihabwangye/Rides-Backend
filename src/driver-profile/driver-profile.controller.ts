import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { DriverProfileService } from './driver-profile.service';
import { UpdateDriverPreferencesDto, UpdateDriverProfileDto } from './dto/driver-profile.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller('drivers/me')
export class DriverProfileController {
  constructor(
    private readonly driverProfileService: DriverProfileService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async getMe(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'DRIVER_PROFILE_FETCHED',
      message: 'Driver profile fetched',
      requestId: getRequestId(req),
      data: await this.driverProfileService.getProfile(driverId),
    });
  }

  @Patch()
  async patchMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateDriverProfileDto,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'DRIVER_PROFILE_UPDATED',
      message: 'Driver profile updated',
      requestId: getRequestId(req),
      data: await this.driverProfileService.updateProfile(driverId, body),
    });
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'DRIVER_PREFERENCES_FETCHED',
      message: 'Driver preferences fetched',
      requestId: getRequestId(req),
      data: await this.driverProfileService.getPreferences(driverId),
    });
  }

  @Patch('preferences')
  async patchPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateDriverPreferencesDto,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'DRIVER_PREFERENCES_UPDATED',
      message: 'Driver preferences updated',
      requestId: getRequestId(req),
      data: await this.driverProfileService.updatePreferences(driverId, body),
    });
  }
}
