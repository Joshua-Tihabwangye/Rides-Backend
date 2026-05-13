import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { DriverDocumentsGuard } from '../common/auth/driver-documents.guard';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import { CancelTripDto, TripsQueryDto, VerifyRiderDto } from './dto/trips.dto';
import { TripsService } from './trips.service';

@UseGuards(JwtAuthGuard, RolesGuard, DriverDocumentsGuard)
@Roles('driver')
@Controller('drivers/me/trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('active')
  async getActive(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'TRIP_ACTIVE_FETCHED',
      message: 'Active trip fetched',
      requestId: getRequestId(req),
      data: await this.tripsService.getActive(user.driverId),
    });
  }

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser, @Query() query: TripsQueryDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'TRIPS_FETCHED',
      message: 'Trips fetched',
      requestId: getRequestId(req),
      data: await this.tripsService.list(user.driverId, query),
    });
  }

  @Get(':tripId')
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_FETCHED',
      message: 'Trip fetched',
      requestId: getRequestId(req),
      data: await this.tripsService.getById(user.driverId, tripId),
    });
  }

  @Post(':tripId/arrive')
  async arrive(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_ARRIVED',
      message: 'Driver marked as arrived',
      requestId: getRequestId(req),
      data: await this.tripsService.arrive(user.driverId, tripId),
    });
  }

  @Post(':tripId/verify-rider')
  async verifyRider(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: VerifyRiderDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_RIDER_VERIFIED',
      message: 'Rider verified',
      requestId: getRequestId(req),
      data: await this.tripsService.verifyRider(user.driverId, tripId, body.otp),
    });
  }

  @Post(':tripId/verify')
  async verifyRiderCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: VerifyRiderDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_RIDER_VERIFIED',
      message: 'Rider verified',
      requestId: getRequestId(req),
      data: await this.tripsService.verifyRider(user.driverId, tripId, body.otp),
    });
  }

  @Post(':tripId/start')
  async start(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_STARTED',
      message: 'Trip started',
      requestId: getRequestId(req),
      data: await this.tripsService.start(user.driverId, tripId),
    });
  }

  @Post(':tripId/complete')
  async complete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_COMPLETED',
      message: 'Trip completed',
      requestId: getRequestId(req),
      data: await this.tripsService.complete(user.driverId, tripId),
    });
  }

  @Post(':tripId/cancel')
  async cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: CancelTripDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRIP_CANCELLED',
      message: 'Trip cancelled',
      requestId: getRequestId(req),
      data: await this.tripsService.cancel(
        user.driverId,
        tripId,
        body.reason ?? 'cancelled_by_driver',
        body.details,
        body.cancelledBy,
      ),
    });
  }
}
