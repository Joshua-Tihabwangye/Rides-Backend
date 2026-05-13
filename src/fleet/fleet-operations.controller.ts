import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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

  @Get('earnings/statements/:statementId')
  async getStatementById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('statementId') statementId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_EARNINGS_STATEMENT_FETCHED',
      message: 'Fleet earnings statement fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getStatementById(user.userId, statementId),
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

  @Get('earnings/payouts/:payoutId')
  async getPayoutById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('payoutId') payoutId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_EARNINGS_PAYOUT_FETCHED',
      message: 'Fleet earnings payout fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getPayoutById(user.userId, payoutId),
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

  @Get('compliance/incidents/:incidentId')
  async getComplianceIncidentById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_COMPLIANCE_INCIDENT_FETCHED',
      message: 'Fleet compliance incident fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getComplianceIncidentById(user.userId, incidentId),
    });
  }

  @Patch('compliance/incidents/:incidentId')
  async patchComplianceIncidentById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('incidentId') incidentId: string,
    @Body() body: Partial<{ category: string; severity: string; status: string; description: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_COMPLIANCE_INCIDENT_UPDATED',
      message: 'Fleet compliance incident updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchComplianceIncidentById(user.userId, incidentId, body),
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

  @Get('compliance/training-courses/:courseId')
  async getTrainingCourseById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TRAINING_COURSE_FETCHED',
      message: 'Fleet training course fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getTrainingCourseById(user.userId, courseId),
    });
  }

  @Patch('compliance/training-courses/:courseId')
  async patchTrainingCourseById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Body() body: Partial<{ title: string; status: string; assignedTo?: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TRAINING_COURSE_UPDATED',
      message: 'Fleet training course updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchTrainingCourseById(user.userId, courseId, body),
    });
  }

  @Delete('compliance/training-courses/:courseId')
  async deleteTrainingCourseById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('courseId') courseId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TRAINING_COURSE_DELETED',
      message: 'Fleet training course deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.deleteTrainingCourseById(user.userId, courseId),
    });
  }

  @Get('dispatches/:dispatchId')
  async getDispatchById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('dispatchId') dispatchId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCH_FETCHED',
      message: 'Fleet dispatch fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getDispatchById(user.userId, dispatchId),
    });
  }

  @Patch('dispatches/:dispatchId')
  async patchDispatchById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('dispatchId') dispatchId: string,
    @Body() body: Partial<{ pickup: string; dropoff: string; notes: string; status: string; driverId: string; vehicleId: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCH_UPDATED',
      message: 'Fleet dispatch updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchDispatch(user.userId, dispatchId, body),
    });
  }

  @Delete('dispatches/:dispatchId')
  async deleteDispatchById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('dispatchId') dispatchId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCH_DELETED',
      message: 'Fleet dispatch deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.deleteDispatch(user.userId, dispatchId),
    });
  }

  @Post('dispatches/:dispatchId/assign')
  async assignDispatch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('dispatchId') dispatchId: string,
    @Body() body: { driverId?: string; vehicleId?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_DISPATCH_ASSIGNED',
      message: 'Fleet dispatch assigned',
      requestId: getRequestId(req),
      data: await this.fleetService.assignDispatch(user.userId, dispatchId, body),
    });
  }

  @Get('rentals/:rentalId')
  async getRentalById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_RENTAL_FETCHED',
      message: 'Fleet rental fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getServiceById(user.userId, 'rental', rentalId),
    });
  }

  @Patch('rentals/:rentalId')
  async patchRentalById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Body() body: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_RENTAL_UPDATED',
      message: 'Fleet rental updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchServiceById(user.userId, 'rental', rentalId, body),
    });
  }

  @Post('rentals/:rentalId/cancel')
  async cancelRentalById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rentalId') rentalId: string,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_RENTAL_CANCELLED',
      message: 'Fleet rental cancelled',
      requestId: getRequestId(req),
      data: await this.fleetService.cancelServiceById(user.userId, 'rental', rentalId, body.reason),
    });
  }

  @Get('tours/:tourId')
  async getTourById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourId') tourId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TOUR_FETCHED',
      message: 'Fleet tour fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getServiceById(user.userId, 'tour', tourId),
    });
  }

  @Patch('tours/:tourId')
  async patchTourById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourId') tourId: string,
    @Body() body: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TOUR_UPDATED',
      message: 'Fleet tour updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchServiceById(user.userId, 'tour', tourId, body),
    });
  }

  @Post('tours/:tourId/cancel')
  async cancelTourById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tourId') tourId: string,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_TOUR_CANCELLED',
      message: 'Fleet tour cancelled',
      requestId: getRequestId(req),
      data: await this.fleetService.cancelServiceById(user.userId, 'tour', tourId, body.reason),
    });
  }

  @Get('school-shuttles/:serviceId')
  async getSchoolShuttleById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId') serviceId: string,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SCHOOL_SHUTTLE_FETCHED',
      message: 'Fleet school shuttle fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.getServiceById(user.userId, 'school_shuttle', serviceId),
    });
  }

  @Patch('school-shuttles/:serviceId')
  async patchSchoolShuttleById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId') serviceId: string,
    @Body() body: Partial<{ customerName: string; assetId: string; scheduledAt: number; notes: string; status: string }>,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SCHOOL_SHUTTLE_UPDATED',
      message: 'Fleet school shuttle updated',
      requestId: getRequestId(req),
      data: await this.fleetService.patchServiceById(user.userId, 'school_shuttle', serviceId, body),
    });
  }

  @Post('school-shuttles/:serviceId/cancel')
  async cancelSchoolShuttleById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId') serviceId: string,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SCHOOL_SHUTTLE_CANCELLED',
      message: 'Fleet school shuttle cancelled',
      requestId: getRequestId(req),
      data: await this.fleetService.cancelServiceById(user.userId, 'school_shuttle', serviceId, body.reason),
    });
  }

  @Get('school-shuttles/routes')
  async schoolListRoutes(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROUTES_FETCHED',
      message: 'Shuttle routes fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListRoutes(user.userId),
    });
  }

  @Post('school-shuttles/routes')
  async schoolCreateRoute(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROUTE_CREATED',
      message: 'Shuttle route created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreateRoute(user.userId, body),
    });
  }

  @Get('school-shuttles/routes/:routeId')
  async schoolGetRoute(@CurrentUser() user: AuthenticatedUser, @Param('routeId') routeId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROUTE_FETCHED',
      message: 'Shuttle route fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolGetRoute(user.userId, routeId),
    });
  }

  @Patch('school-shuttles/routes/:routeId')
  async schoolPatchRoute(@CurrentUser() user: AuthenticatedUser, @Param('routeId') routeId: string, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROUTE_UPDATED',
      message: 'Shuttle route updated',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolPatchRoute(user.userId, routeId, body),
    });
  }

  @Delete('school-shuttles/routes/:routeId')
  async schoolDeleteRoute(@CurrentUser() user: AuthenticatedUser, @Param('routeId') routeId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROUTE_DELETED',
      message: 'Shuttle route deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolDeleteRoute(user.userId, routeId),
    });
  }

  @Get('school-shuttles/students')
  async schoolListStudents(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_STUDENTS_FETCHED',
      message: 'Shuttle students fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListStudents(user.userId),
    });
  }

  @Post('school-shuttles/students')
  async schoolCreateStudent(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_STUDENT_CREATED',
      message: 'Shuttle student created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreateStudent(user.userId, body),
    });
  }

  @Get('school-shuttles/students/:studentId')
  async schoolGetStudent(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_STUDENT_FETCHED',
      message: 'Shuttle student fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolGetStudent(user.userId, studentId),
    });
  }

  @Patch('school-shuttles/students/:studentId')
  async schoolPatchStudent(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_STUDENT_UPDATED',
      message: 'Shuttle student updated',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolPatchStudent(user.userId, studentId, body),
    });
  }

  @Delete('school-shuttles/students/:studentId')
  async schoolDeleteStudent(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_STUDENT_DELETED',
      message: 'Shuttle student deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolDeleteStudent(user.userId, studentId),
    });
  }

  @Get('school-shuttles/attendance')
  async schoolListAttendance(
    @CurrentUser() user: AuthenticatedUser,
    @Query('studentId') studentId: string | undefined,
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANCE_FETCHED',
      message: 'Shuttle attendance fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListAttendance(user.userId, studentId),
    });
  }

  @Post('school-shuttles/attendance')
  async schoolUpsertAttendance(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANCE_UPSERTED',
      message: 'Shuttle attendance upserted',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolUpsertAttendance(user.userId, body),
    });
  }

  @Get('school-shuttles/trips')
  async schoolListTrips(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIPS_FETCHED',
      message: 'Shuttle trips fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListTrips(user.userId),
    });
  }

  @Post('school-shuttles/trips')
  async schoolCreateTrip(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_CREATED',
      message: 'Shuttle trip created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreateTrip(user.userId, body),
    });
  }

  @Get('school-shuttles/trips/:tripId')
  async schoolGetTrip(@CurrentUser() user: AuthenticatedUser, @Param('tripId') tripId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_FETCHED',
      message: 'Shuttle trip fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolGetTrip(user.userId, tripId),
    });
  }

  @Patch('school-shuttles/trips/:tripId')
  async schoolPatchTrip(@CurrentUser() user: AuthenticatedUser, @Param('tripId') tripId: string, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_UPDATED',
      message: 'Shuttle trip updated',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolPatchTrip(user.userId, tripId, body),
    });
  }

  @Post('school-shuttles/trips/:tripId/cancel')
  async schoolCancelTrip(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
    @Body() body: { reason?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_CANCELLED',
      message: 'Shuttle trip cancelled',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCancelTrip(user.userId, tripId, body.reason),
    });
  }

  @Get('school-shuttles/trips/:tripId/live')
  async schoolTripLive(@CurrentUser() user: AuthenticatedUser, @Param('tripId') tripId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_LIVE_FETCHED',
      message: 'Shuttle trip live tracking fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolTripLive(user.userId, tripId),
    });
  }

  @Get('school-shuttles/attendants')
  async schoolListAttendants(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANTS_FETCHED',
      message: 'Shuttle attendants fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListAttendants(user.userId),
    });
  }

  @Post('school-shuttles/attendants')
  async schoolCreateAttendant(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANT_CREATED',
      message: 'Shuttle attendant created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreateAttendant(user.userId, body),
    });
  }

  @Get('school-shuttles/attendants/:attendantId')
  async schoolGetAttendant(@CurrentUser() user: AuthenticatedUser, @Param('attendantId') attendantId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANT_FETCHED',
      message: 'Shuttle attendant fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolGetAttendant(user.userId, attendantId),
    });
  }

  @Patch('school-shuttles/attendants/:attendantId')
  async schoolPatchAttendant(@CurrentUser() user: AuthenticatedUser, @Param('attendantId') attendantId: string, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANT_UPDATED',
      message: 'Shuttle attendant updated',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolPatchAttendant(user.userId, attendantId, body),
    });
  }

  @Delete('school-shuttles/attendants/:attendantId')
  async schoolDeleteAttendant(@CurrentUser() user: AuthenticatedUser, @Param('attendantId') attendantId: string, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ATTENDANT_DELETED',
      message: 'Shuttle attendant deleted',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolDeleteAttendant(user.userId, attendantId),
    });
  }

  @Get('school-shuttles/payments')
  async schoolListPayments(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_PAYMENTS_FETCHED',
      message: 'Shuttle payments fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListPayments(user.userId),
    });
  }

  @Post('school-shuttles/payments')
  async schoolCreatePayment(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_PAYMENT_CREATED',
      message: 'Shuttle payment created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreatePayment(user.userId, body),
    });
  }

  @Get('school-shuttles/feedback')
  async schoolListFeedback(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_FEEDBACK_FETCHED',
      message: 'Shuttle feedback fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolListFeedback(user.userId),
    });
  }

  @Post('school-shuttles/feedback')
  async schoolCreateFeedback(@CurrentUser() user: AuthenticatedUser, @Body() body: Record<string, unknown>, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_FEEDBACK_CREATED',
      message: 'Shuttle feedback created',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolCreateFeedback(user.userId, body),
    });
  }

  @Get('school-shuttles/roster')
  async schoolRoster(@CurrentUser() user: AuthenticatedUser, @Query('routeId') routeId: string | undefined, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_ROSTER_FETCHED',
      message: 'Shuttle roster fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolRoster(user.userId, routeId),
    });
  }

  @Get('school-shuttles/trip-calendar')
  async schoolTripCalendar(@CurrentUser() user: AuthenticatedUser, @Query('date') date: string | undefined, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_TRIP_CALENDAR_FETCHED',
      message: 'Shuttle trip calendar fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolTripCalendar(user.userId, date),
    });
  }

  @Get('school-shuttles/performance-report')
  async schoolPerformanceReport(@CurrentUser() user: AuthenticatedUser, @Req() req: Request) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_PERFORMANCE_FETCHED',
      message: 'Shuttle performance report fetched',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolPerformanceReport(user.userId),
    });
  }

  @Post('school-shuttles/bulk-reminders')
  async schoolBulkReminders(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { message: string; target?: string },
    @Req() req: Request,
  ) {
    return this.apiResponse.success({
      code: 'FLEET_SHUTTLE_REMINDERS_SENT',
      message: 'Shuttle bulk reminders sent',
      requestId: getRequestId(req),
      data: await this.fleetService.schoolBulkReminders(user.userId, body),
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
