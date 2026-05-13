import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  CancelRiderServiceDto,
  CreateRiderAmbulanceDto,
  CreateRiderRentalDto,
  CreateRiderEmergencyContactDto,
  CreateRiderTourDto,
  PatchRiderAmbulanceDto,
  PatchRiderPreferencesDto,
  PatchRiderRentalDto,
  RequestRiderTripDto,
  TriggerRiderSosDto,
  UpdateRiderEmergencyContactDto,
  UpdateRiderProfileDto,
  UpdateRiderTripTrackingDto,
} from './dto/rider.dto';
import { RiderService } from './rider.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('rider')
@Controller('riders/me')
export class RiderController {
  constructor(
    private readonly riderService: RiderService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get()
  async getMe(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_PROFILE_FETCHED',
      message: 'Rider profile fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getProfile(user.userId),
    });
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_PROFILE_FETCHED',
      message: 'Rider profile fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getProfile(user.userId),
    });
  }

  @Patch()
  async patchMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdateRiderProfileDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_PROFILE_UPDATED',
      message: 'Rider profile updated',
      requestId: getRequestId(req),
      data: await this.riderService.updateProfile(user.userId, body),
    });
  }

  @Get('preferences')
  async getPreferences(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_PREFERENCES_FETCHED',
      message: 'Rider preferences fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getPreferences(user.userId),
    });
  }

  @Patch('preferences')
  async patchPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: PatchRiderPreferencesDto,
    @Req() req: Request,
  ) {
    const patchPayload = (body.patch ?? {}) as Record<string, unknown>;
    return this.apiResponse.success({
      code: 'RIDER_PREFERENCES_UPDATED',
      message: 'Rider preferences updated',
      requestId: getRequestId(req),
      data: await this.riderService.patchPreferences(user.userId, patchPayload),
    });
  }

  @Get('emergency-contacts')
  async listEmergencyContacts(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_EMERGENCY_CONTACTS_FETCHED',
      message: 'Rider emergency contacts fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listEmergencyContacts(user.userId),
    });
  }

  @Post('emergency-contacts')
  async createEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateRiderEmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_EMERGENCY_CONTACT_CREATED',
      message: 'Rider emergency contact created',
      requestId: getRequestId(req),
      data: await this.riderService.createEmergencyContact(user.userId, body),
    });
  }

  @Patch('emergency-contacts/:contactId')
  async patchEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body() body: UpdateRiderEmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_EMERGENCY_CONTACT_UPDATED',
      message: 'Rider emergency contact updated',
      requestId: getRequestId(req),
      data: await this.riderService.patchEmergencyContact(user.userId, contactId, body),
    });
  }

  @Delete('emergency-contacts/:contactId')
  async deleteEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_EMERGENCY_CONTACT_DELETED',
      message: 'Rider emergency contact deleted',
      requestId: getRequestId(req),
      data: await this.riderService.deleteEmergencyContact(user.userId, contactId),
    });
  }

  @Post('sos')
  async triggerSos(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: TriggerRiderSosDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_SOS_TRIGGERED',
      message: 'SOS triggered',
      requestId: getRequestId(req),
      data: await this.riderService.triggerSos(user.userId, body),
    });
  }

  @Get('sos/history')
  async listSosHistory(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_SOS_HISTORY_FETCHED',
      message: 'Rider SOS history fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listSosHistory(user.userId),
    });
  }

  @Get('wallet')
  async getWallet(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_WALLET_FETCHED',
      message: 'Rider wallet fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getWallet(user.userId),
    });
  }

  @Get('wallet/transactions')
  async listWalletTransactions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitRaw: string | undefined,
    @Query('offset') offsetRaw: string | undefined,
    @Req() req: Request,
  ) {
    const limit = limitRaw ? Number(limitRaw) : 20;
    const offset = offsetRaw ? Number(offsetRaw) : 0;
    return this.apiResponse.success({
      code: 'RIDER_WALLET_TRANSACTIONS_FETCHED',
      message: 'Rider wallet transactions fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listWalletTransactions(user.userId, Number.isFinite(limit) ? limit : 20, Number.isFinite(offset) ? offset : 0),
    });
  }

  @Get('trips/history')
  async listTripHistory(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_HISTORY_FETCHED',
      message: 'Rider trip history fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listTrips(user.userId),
    });
  }

  @Get('trips/active')
  async getActiveTrip(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_ACTIVE_TRIP_FETCHED',
      message: 'Rider active trip fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getActiveTrip(user.userId),
    });
  }

  @Get('trips/:tripId')
  async getTripById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_FETCHED',
      message: 'Trip fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getTripById(user.userId, tripId),
    });
  }

  @Post('trips/request')
  async requestTrip(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RequestRiderTripDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_REQUESTED',
      message: 'Trip request created',
      requestId: getRequestId(req),
      data: await this.riderService.requestTrip(user.userId, body),
    });
  }

  @Post('trips')
  async requestTripCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: RequestRiderTripDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_REQUESTED',
      message: 'Trip request created',
      requestId: getRequestId(req),
      data: await this.riderService.requestTrip(user.userId, body),
    });
  }

  @Patch('trips/:tripId/tracking')
  async updateTripTracking(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: UpdateRiderTripTrackingDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_TRACKING_UPDATED',
      message: 'Rider trip tracking updated',
      requestId: getRequestId(req),
      data: await this.riderService.updateTripTracking(user.userId, tripId, body),
    });
  }

  @Patch('trips/:tripId')
  async updateTripTrackingCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: UpdateRiderTripTrackingDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TRIP_TRACKING_UPDATED',
      message: 'Rider trip tracking updated',
      requestId: getRequestId(req),
      data: await this.riderService.updateTripTracking(user.userId, tripId, body),
    });
  }

  @Get('rentals')
  async listRentals(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_RENTALS_FETCHED',
      message: 'Rider rentals fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listRentals(user.userId),
    });
  }

  @Get('rentals/:rentalId')
  async getRental(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_RENTAL_FETCHED',
      message: 'Rider rental fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getRentalById(user.userId, rentalId),
    });
  }

  @Post('rentals')
  async createRental(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateRiderRentalDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_RENTAL_CREATED',
      message: 'Rider rental created',
      requestId: getRequestId(req),
      data: await this.riderService.createRental(user.userId, body),
    });
  }

  @Patch('rentals/:rentalId')
  async patchRental(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Body() body: PatchRiderRentalDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_RENTAL_UPDATED',
      message: 'Rider rental updated',
      requestId: getRequestId(req),
      data: await this.riderService.patchRental(user.userId, rentalId, body as unknown as Record<string, unknown>),
    });
  }

  @Post('rentals/:rentalId/cancel')
  async cancelRental(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Body() body: CancelRiderServiceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_RENTAL_CANCELLED',
      message: 'Rider rental cancelled',
      requestId: getRequestId(req),
      data: await this.riderService.cancelRental(user.userId, rentalId, body.reason),
    });
  }

  @Get('tours')
  async listTours(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_TOURS_FETCHED',
      message: 'Rider tours fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listTours(user.userId),
    });
  }

  @Get('tours/:tourId')
  async getTour(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourId') tourId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TOUR_FETCHED',
      message: 'Rider tour fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getTourById(user.userId, tourId),
    });
  }

  @Post('tours')
  async createTour(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateRiderTourDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TOUR_CREATED',
      message: 'Rider tour created',
      requestId: getRequestId(req),
      data: await this.riderService.createTour(user.userId, body),
    });
  }

  @Post('tours/:tourId/cancel')
  async cancelTour(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourId') tourId: string,
    @Body() body: CancelRiderServiceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_TOUR_CANCELLED',
      message: 'Rider tour cancelled',
      requestId: getRequestId(req),
      data: await this.riderService.cancelTour(user.userId, tourId, body.reason),
    });
  }

  @Get('ambulances')
  async listAmbulances(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'RIDER_AMBULANCES_FETCHED',
      message: 'Rider ambulances fetched',
      requestId: getRequestId(req),
      data: await this.riderService.listAmbulances(user.userId),
    });
  }

  @Get('ambulances/:ambulanceId')
  async getAmbulance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ambulanceId') ambulanceId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_AMBULANCE_FETCHED',
      message: 'Rider ambulance request fetched',
      requestId: getRequestId(req),
      data: await this.riderService.getAmbulanceById(user.userId, ambulanceId),
    });
  }

  @Post('ambulances')
  async createAmbulance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateRiderAmbulanceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_AMBULANCE_CREATED',
      message: 'Rider ambulance request created',
      requestId: getRequestId(req),
      data: await this.riderService.createAmbulance(user.userId, body),
    });
  }

  @Patch('ambulances/:ambulanceId')
  async patchAmbulance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ambulanceId') ambulanceId: string,
    @Body() body: PatchRiderAmbulanceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_AMBULANCE_UPDATED',
      message: 'Rider ambulance request updated',
      requestId: getRequestId(req),
      data: await this.riderService.patchAmbulance(user.userId, ambulanceId, body as unknown as Record<string, unknown>),
    });
  }

  @Post('ambulances/:ambulanceId/cancel')
  async cancelAmbulance(
    @CurrentUser() user: AuthenticatedUser,
    @Param('ambulanceId') ambulanceId: string,
    @Body() body: CancelRiderServiceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'RIDER_AMBULANCE_CANCELLED',
      message: 'Rider ambulance request cancelled',
      requestId: getRequestId(req),
      data: await this.riderService.cancelAmbulance(user.userId, ambulanceId, body.reason),
    });
  }
}
