import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

  @Delete(':vehicleId')
  async deleteById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_DELETED',
      message: 'Fleet vehicle deleted',
      requestId: getRequestId(req),
      data: await this.vehiclesService.removeFleet(fleetIdFromUser(user), vehicleId),
    });
  }

  @Get(':vehicleId/documents')
  async listDocuments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    const vehicle = await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId);
    const documents = vehicle.documents || {};
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_DOCUMENTS_FETCHED',
      message: 'Fleet vehicle documents fetched',
      requestId: getRequestId(req),
      data: Object.entries(documents).map(([documentType, payload]) => ({ documentType, ...(payload as object) })),
    });
  }

  @Post(':vehicleId/documents')
  async createDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: { documentType: string; fileUrl: string; expiryDate?: string },
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    const vehicle = await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId);
    const documents = vehicle.documents || {};
    documents[body.documentType] = {
      fileUrl: body.fileUrl,
      expiryDate: body.expiryDate || null,
      status: 'under_review',
      updatedAt: Date.now(),
    };
    await this.vehiclesService.updateFleet(fleetId, vehicleId, { documents } as any);
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_DOCUMENT_CREATED',
      message: 'Fleet vehicle document created',
      requestId: getRequestId(req),
      data: { documentType: body.documentType, ...documents[body.documentType] },
    });
  }

  @Get(':vehicleId/maintenance')
  async listMaintenance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    const vehicle = await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId);
    const accessories = vehicle.accessories || {};
    const history = Array.isArray((accessories as any).maintenanceHistory) ? (accessories as any).maintenanceHistory : [];
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_MAINTENANCE_FETCHED',
      message: 'Fleet vehicle maintenance history fetched',
      requestId: getRequestId(req),
      data: history,
    });
  }

  @Post(':vehicleId/maintenance')
  async createMaintenance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() body: { title: string; notes?: string; cost?: number; servicedAt?: number },
    @Req() req: Request,
  ) {
    const fleetId = user.fleetId ?? user.userId;
    const vehicle = await this.vehiclesService.findFleetVehicleById(fleetId, vehicleId);
    const accessories = vehicle.accessories || {};
    const history = Array.isArray((accessories as any).maintenanceHistory) ? (accessories as any).maintenanceHistory : [];
    const record = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: body.title,
      notes: body.notes,
      cost: Number(body.cost || 0),
      servicedAt: Number(body.servicedAt || Date.now()),
      createdAt: Date.now(),
    };
    history.unshift(record);
    (accessories as any).maintenanceHistory = history.slice(0, 500);
    await this.vehiclesService.updateFleet(fleetId, vehicleId, { accessories } as any);
    return this.apiResponse.success({
      code: 'FLEET_VEHICLE_MAINTENANCE_CREATED',
      message: 'Fleet vehicle maintenance record created',
      requestId: getRequestId(req),
      data: record,
    });
  }
}

function fleetIdFromUser(user: AuthenticatedUser) {
  return user.fleetId ?? user.userId;
}
