import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { CreateFleetDriverDto, UpdateFleetDriverDto } from './dto/fleet.dto';
import { FleetService } from './fleet.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('fleet_owner', 'fleet_manager', 'fleet_dispatcher')
@Controller('fleet/drivers')
export class FleetDriversController {
  constructor(
    private readonly fleetService: FleetService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_DRIVERS_FETCHED',
      message: 'Fleet drivers fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listDrivers(user.userId),
    });
  }

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateFleetDriverDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_DRIVER_CREATED',
      message: 'Fleet driver created',
      requestId: getRequestId(req),
      data: await this.fleetService.createDriver(user.userId, body),
    });
  }

  @Patch(':driverId')
  async patch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('driverId') driverId: string,
    @Body() body: UpdateFleetDriverDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DRIVER_UPDATED',
      message: 'Fleet driver updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchDriver(user.userId, driverId, body),
    });
  }
}
