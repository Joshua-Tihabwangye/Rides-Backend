import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance')
@Controller('fleet/vehicles')
export class FleetVehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const fleetId = user.fleetId ?? user.userId;
    return this.apiResponse.success({
      code: 'FLEET_VEHICLES_FETCHED',
      message: 'Fleet vehicles fetched',
      requestId: getRequestId(req),
      data: await this.vehiclesService.listFleet(fleetId),
    });
  }

  @Get(':vehicleId')
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_FETCHED',
      message: 'Fleet vehicle fetched',
      requestId: getRequestId(req),
      data: await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId),
    });
  }

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateVehicleDto, @Req() req: Request) {
    const fleetId = user.fleetId ?? user.userId;
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_CREATED',
      message: 'Fleet vehicle created',
      requestId: getRequestId(req),
      data: await this.vehiclesService.createFleet(fleetId, { ...body, status: body.status ?? 'inactive' }),
    });
  }

  @Patch(':vehicleId')
  async patch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_UPDATED',
      message: 'Fleet vehicle updated',
      requestId: getRequestId(req),
      data: await this.vehiclesService.updateFleet(fleetId, vehicleId, body),
    });
  }
}
