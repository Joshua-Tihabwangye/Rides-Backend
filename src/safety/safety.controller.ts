import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  EmergencyContactDto,
  SafetyCheckRespondDto,
  SosDto,
  TemporaryStopRequestDto,
  TemporaryStopRespondDto,
} from './dto/safety.dto';
import { SafetyService } from './safety.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('driver')
@Controller('drivers/me')
export class SafetyController {
  constructor(
    private readonly safetyService: SafetyService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('trips/:tripId/safety')
  async getSafetyState(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_STATE_FETCHED',
      message: 'Safety state fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.getTripSafetyState(user.driverId, tripId),
    });
  }

  @Put('trips/:tripId/safety')
  async saveSafetyState(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: Record<string, unknown>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_STATE_UPDATED',
      message: 'Safety state updated',
      requestId: getRequestId(req),
      data: await this.safetyService.saveTripSafetyState(user.driverId, tripId, body),
    });
  }

  @Post('trips/:tripId/temporary-stop/request')
  async temporaryStopRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRequestDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_REQUESTED',
      message: 'Temporary stop requested',
      requestId: getRequestId(req),
      data: await this.safetyService.requestTemporaryStop(user.driverId, tripId, body.note),
    });
  }

  @Post('trips/:tripId/safety/temporary-stop/request')
  async temporaryStopRequestCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRequestDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_REQUESTED',
      message: 'Temporary stop requested',
      requestId: getRequestId(req),
      data: await this.safetyService.requestTemporaryStop(user.driverId, tripId, body.note),
    });
  }

  @Post('trips/:tripId/temporary-stop/respond')
  async temporaryStopRespond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRespondDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESPONDED',
      message: 'Temporary stop response recorded',
      requestId: getRequestId(req),
      data: await this.safetyService.respondTemporaryStop(user.driverId, tripId, body.decision),
    });
  }

  @Post('trips/:tripId/safety/temporary-stop/respond')
  async temporaryStopRespondCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: TemporaryStopRespondDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESPONDED',
      message: 'Temporary stop response recorded',
      requestId: getRequestId(req),
      data: await this.safetyService.respondTemporaryStop(user.driverId, tripId, body.decision),
    });
  }

  @Post('trips/:tripId/temporary-stop/resume')
  async temporaryStopResume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESUMED',
      message: 'Temporary stop resumed',
      requestId: getRequestId(req),
      data: await this.safetyService.resumeTemporaryStop(user.driverId, tripId),
    });
  }

  @Post('trips/:tripId/safety/temporary-stop/resume')
  async temporaryStopResumeCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_TEMP_STOP_RESUMED',
      message: 'Temporary stop resumed',
      requestId: getRequestId(req),
      data: await this.safetyService.resumeTemporaryStop(user.driverId, tripId),
    });
  }

  @Post('trips/:tripId/safety-check/respond')
  async safetyCheckRespond(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: SafetyCheckRespondDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_CHECK_RESPONDED',
      message: 'Safety check response recorded',
      requestId: getRequestId(req),
      data: await this.safetyService.respondSafetyCheck(user.driverId, tripId, body.actor, body.action),
    });
  }

  @Post('trips/:tripId/sos')
  async sos(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: SosDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_SOS_TRIGGERED',
      message: 'SOS triggered',
      requestId: getRequestId(req),
      data: await this.safetyService.triggerSos(user.driverId, tripId, body),
    });
  }

  @Post('trips/:tripId/safety/sos')
  async sosCompat(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: SosDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SAFETY_SOS_TRIGGERED',
      message: 'SOS triggered',
      requestId: getRequestId(req),
      data: await this.safetyService.triggerSos(user.driverId, tripId, body),
    });
  }

  @Get('emergency-contacts')
  async listEmergencyContacts(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACTS_FETCHED',
      message: 'Emergency contacts fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.listEmergencyContacts(user.driverId),
    });
  }

  @Post('emergency-contacts')
  async createEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: EmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_CREATED',
      message: 'Emergency contact created',
      requestId: getRequestId(req),
      data: await this.safetyService.createEmergencyContact(user.driverId, body),
    });
  }

  @Patch('emergency-contacts/:contactId')
  async patchEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body() body: EmergencyContactDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_UPDATED',
      message: 'Emergency contact updated',
      requestId: getRequestId(req),
      data: await this.safetyService.patchEmergencyContact(user.driverId, contactId, body),
    });
  }

  @Delete('emergency-contacts/:contactId')
  async deleteEmergencyContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'EMERGENCY_CONTACT_DELETED',
      message: 'Emergency contact deleted',
      requestId: getRequestId(req),
      data: await this.safetyService.deleteEmergencyContact(user.driverId, contactId),
    });
  }

  @Get('trips/:tripId/share-contacts')
  async listTripShareContacts(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SHARE_CONTACTS_FETCHED',
      message: 'Trip share contacts fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.listTripShareContacts(user.driverId, tripId),
    });
  }

  @Post('trips/:tripId/share-contacts')
  async addTripShareContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: { name: string; phone: string; relationship?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SHARE_CONTACT_CREATED',
      message: 'Trip share contact created',
      requestId: getRequestId(req),
      data: await this.safetyService.addTripShareContact(user.driverId, tripId, body),
    });
  }

  @Delete('trips/:tripId/share-contacts/:contactId')
  async deleteTripShareContact(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Param('contactId') contactId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SHARE_CONTACT_DELETED',
      message: 'Trip share contact deleted',
      requestId: getRequestId(req),
      data: await this.safetyService.deleteTripShareContact(user.driverId, tripId, contactId),
    });
  }

  @Post('trips/:tripId/share-link')
  async createTripShareLink(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SHARE_LINK_CREATED',
      message: 'Trip share link created',
      requestId: getRequestId(req),
      data: await this.safetyService.createTripShareLink(user.driverId, tripId),
    });
  }

  @Get('trips/:tripId/share-status')
  async getTripShareStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'SHARE_STATUS_FETCHED',
      message: 'Trip share status fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.getTripShareStatus(user.driverId, tripId),
    });
  }

  @Get('training/modules')
  async listTrainingModules(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'TRAINING_MODULES_FETCHED',
      message: 'Training modules fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.listTrainingModules(user.driverId),
    });
  }

  @Get('training/modules/:moduleId')
  async getTrainingModule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRAINING_MODULE_FETCHED',
      message: 'Training module fetched',
      requestId: getRequestId(req),
      data: await this.safetyService.getTrainingModule(user.driverId, moduleId),
    });
  }

  @Post('training/modules/:moduleId/attempts')
  async createTrainingAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Body() body: { answers?: Record<string, unknown> },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRAINING_ATTEMPT_CREATED',
      message: 'Training attempt created',
      requestId: getRequestId(req),
      data: await this.safetyService.createTrainingAttempt(user.driverId, moduleId, body),
    });
  }

  @Post('training/modules/:moduleId/complete')
  async completeTrainingModule(
    @CurrentUser() user: AuthenticatedUser,
    @Param('moduleId') moduleId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'TRAINING_MODULE_COMPLETED',
      message: 'Training module completed',
      requestId: getRequestId(req),
      data: await this.safetyService.completeTrainingModule(user.driverId, moduleId),
    });
  }
}
