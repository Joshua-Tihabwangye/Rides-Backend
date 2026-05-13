import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { UpdateLocationDto } from './dto/location.dto';
import { PresenceLocationService } from './presence-location.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller()
export class PresenceLocationController {
  constructor(
    private readonly presenceLocationService: PresenceLocationService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Post('drivers/me/presence/online')
  async goOnline(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'DRIVER_ONLINE',
      message: 'Driver is now online',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.goOnline(user.driverId),
    });
  }

  @Post('drivers/me/presence/offline')
  async goOffline(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'DRIVER_OFFLINE',
      message: 'Driver is now offline',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.goOffline(user.driverId),
    });
  }

  @Patch('drivers/me/location')
  async patchLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateLocationDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DRIVER_LOCATION_UPDATED',
      message: 'Driver location updated',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.updateLocation(user.driverId, body),
    });
  }

  @Post('locations/heartbeat')
  async heartbeat(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateLocationDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DRIVER_HEARTBEAT_ACCEPTED',
      message: 'Heartbeat accepted',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.heartbeat(user.driverId, body),
    });
  }

  @Post('drivers/me/location/heartbeat')
  async heartbeatCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateLocationDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'DRIVER_HEARTBEAT_ACCEPTED',
      message: 'Heartbeat accepted',
      requestId: getRequestId(req),
      data: await this.presenceLocationService.heartbeat(user.driverId, body),
    });
  }
}
