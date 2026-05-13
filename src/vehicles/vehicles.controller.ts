import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { CreateVehicleDto, UpdateAccessoriesDto, UpdateVehicleDto, UploadVehicleDocumentDto } from './dto/vehicle.dto';
import { VehiclesService } from './vehicles.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller('drivers/me/vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLES_FETCHED',
      message: 'Vehicles fetched',
      requestId: getRequestId(req),
      data: await this.vehiclesService.list(driverId),
    });
  }

  @Post()
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateVehicleDto, @Req() req: Request) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_CREATED',
      message: 'Vehicle created',
      requestId: getRequestId(req),
      data: await this.vehiclesService.create(driverId, { ...body, status: body.status ?? 'inactive' }),
    });
  }

  @Get(':vehicleId')
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_FETCHED',
      message: 'Vehicle fetched',
      requestId: getRequestId(req),
      data: await this.vehiclesService.findById(driverId, vehicleId),
    });
  }

  @Patch(':vehicleId')
  async patch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_UPDATED',
      message: 'Vehicle updated',
      requestId: getRequestId(req),
      data: await this.vehiclesService.update(driverId, vehicleId, body),
    });
  }

  @Delete(':vehicleId')
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_DELETED',
      message: 'Vehicle deleted',
      requestId: getRequestId(req),
      data: await this.vehiclesService.remove(driverId, vehicleId),
    });
  }

  @Patch(':vehicleId/accessories')
  async patchAccessories(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateAccessoriesDto,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_ACCESSORIES_UPDATED',
      message: 'Vehicle accessories updated',
      requestId: getRequestId(req),
      data: await this.vehiclesService.patchAccessories(driverId, vehicleId, body.accessories),
    });
  }

  @Post(':vehicleId/documents')
  async postDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: UploadVehicleDocumentDto,
    @Req() req: Request,
  ) {
    const driverId = user.driverId ?? user.userId;
    return this.apiResponse.success({
      code: 'VEHICLE_DOCUMENT_UPLOADED',
      message: 'Vehicle document uploaded',
      requestId: getRequestId(req),
      data: await this.vehiclesService.uploadDocument(driverId, vehicleId, body),
    });
  }
}
