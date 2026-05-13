import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiResponseService } from '../common/api/api-response.service';
import { CurrentUser, type AuthenticatedUser } from '../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { getRequestId } from '../common/utils/request-id';
import {
  CreateFleetComplianceIncidentDto,
  CreateFleetDispatchDto,
  CreateFleetServiceDto,
  CreateFleetTrainingCourseDto,
  FleetEarningsQueryDto,
} from './dto/fleet.dto';
import { FleetService } from './fleet.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance')
@Controller('fleet')
export class FleetOperationsController {
  constructor(
    private readonly fleetService: FleetService,
    private readonly apiResponse: ApiResponseService,
  ) {}

  @Get('dispatches')
  async listDispatches(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCHES_FETCHED',
      message: 'Fleet dispatches fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listDispatches(user.userId),
    });
  }

  @Post('dispatches')
  async createDispatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateFleetDispatchDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCH_CREATED',
      message: 'Fleet dispatch created',
      requestId: getRequestId(req),
      data: await this.fleetService.createDispatch(user.userId, body),
    });
  }

  @Get('trips')
  async listTrips(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_TRIPS_FETCHED',
      message: 'Fleet trips fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listTrips(user.userId),
    });
  }

  @Get('ambulance/dispatches')
  async listAmbulanceDispatches(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_AMBULANCE_DISPATCHES_FETCHED',
      message: 'Fleet ambulance dispatches fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listDispatches(user.userId, 'ambulance'),
    });
  }

  @Post('ambulance/dispatches')
  async createAmbulanceDispatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateFleetDispatchDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_AMBULANCE_DISPATCH_CREATED',
      message: 'Fleet ambulance dispatch created',
      requestId: getRequestId(req),
      data: await this.fleetService.createDispatch(user.userId, body, 'ambulance'),
    });
  }

  @Get('rentals')
  async listRentals(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_RENTALS_FETCHED',
      message: 'Fleet rentals fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listServices(user.userId, 'rental'),
    });
  }

  @Post('rentals')
  async createRental(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateFleetServiceDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_RENTAL_CREATED',
      message: 'Fleet rental created',
      requestId: getRequestId(req),
      data: await this.fleetService.createService(user.userId, 'rental', body),
    });
  }

  @Get('tours')
  async listTours(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_TOURS_FETCHED',
      message: 'Fleet tours fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listServices(user.userId, 'tour'),
    });
  }

  @Post('tours')
  async createTour(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateFleetServiceDto, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_TOUR_CREATED',
      message: 'Fleet tour created',
      requestId: getRequestId(req),
      data: await this.fleetService.createService(user.userId, 'tour', body),
    });
  }

  @Get('school-shuttles')
  async listSchoolShuttles(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SCHOOL_SHUTTLES_FETCHED',
      message: 'Fleet school shuttles fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listServices(user.userId, 'school_shuttle'),
    });
  }

  @Post('school-shuttles')
  async createSchoolShuttle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateFleetServiceDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SCHOOL_SHUTTLE_CREATED',
      message: 'Fleet school shuttle created',
      requestId: getRequestId(req),
      data: await this.fleetService.createService(user.userId, 'school_shuttle', body),
    });
  }

  @Get('earnings/summary')
  async getEarningsSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FleetEarningsQueryDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_EARNINGS_SUMMARY_FETCHED',
      message: 'Fleet earnings summary fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getEarningsSummary(user.userId, query.period),
    });
  }

  @Get('earnings/statements')
  async getStatements(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_EARNINGS_STATEMENTS_FETCHED',
      message: 'Fleet earnings statements fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getStatements(user.userId),
    });
  }

  @Get('earnings/payouts')
  async getPayouts(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_EARNINGS_PAYOUTS_FETCHED',
      message: 'Fleet earnings payouts fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getPayouts(user.userId),
    });
  }

  @Get('compliance/incidents')
  async listComplianceIncidents(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_COMPLIANCE_INCIDENTS_FETCHED',
      message: 'Fleet compliance incidents fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listComplianceIncidents(user.userId),
    });
  }

  @Post('compliance/incidents')
  async createComplianceIncident(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateFleetComplianceIncidentDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_COMPLIANCE_INCIDENT_CREATED',
      message: 'Fleet compliance incident created',
      requestId: getRequestId(req),
      data: await this.fleetService.createComplianceIncident(user.userId, body),
    });
  }

  @Get('compliance/training-courses')
  async listTrainingCourses(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_TRAINING_COURSES_FETCHED',
      message: 'Fleet training courses fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listTrainingCourses(user.userId),
    });
  }

  @Post('compliance/training-courses')
  async createTrainingCourse(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateFleetTrainingCourseDto,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TRAINING_COURSE_CREATED',
      message: 'Fleet training course created',
      requestId: getRequestId(req),
      data: await this.fleetService.createTrainingCourse(user.userId, body),
    });
  }

  @Get('rider-services')
  async listRiderServiceRequests(
    @CurrentUser() user: AuthenticatedUser,
    @Query('serviceType') serviceType: 'rental' | 'tour' | 'ambulance' | undefined,
    @Query('status') status: string | undefined,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_RIDER_SERVICES_FETCHED',
      message: 'Rider service requests fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.listRiderServiceRequests(user.userId, { serviceType, status }),
    });
  }
}
