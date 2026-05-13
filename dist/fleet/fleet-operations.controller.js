"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetOperationsController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const fleet_dto_1 = require("./dto/fleet.dto");
const fleet_service_1 = require("./fleet.service");
let FleetOperationsController = class FleetOperationsController {
    constructor(fleetService, apiResponse) {
        this.fleetService = fleetService;
        this.apiResponse = apiResponse;
    }
    async listDispatches(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCHES_FETCHED',
            message: 'Fleet dispatches fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listDispatches(user.userId),
        });
    }
    async createDispatch(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCH_CREATED',
            message: 'Fleet dispatch created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createDispatch(user.userId, body),
        });
    }
    async listTrips(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRIPS_FETCHED',
            message: 'Fleet trips fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listTrips(user.userId),
        });
    }
    async listAmbulanceDispatches(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_AMBULANCE_DISPATCHES_FETCHED',
            message: 'Fleet ambulance dispatches fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listDispatches(user.userId, 'ambulance'),
        });
    }
    async createAmbulanceDispatch(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_AMBULANCE_DISPATCH_CREATED',
            message: 'Fleet ambulance dispatch created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createDispatch(user.userId, body, 'ambulance'),
        });
    }
    async listRentals(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_RENTALS_FETCHED',
            message: 'Fleet rentals fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listServices(user.userId, 'rental'),
        });
    }
    async createRental(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_RENTAL_CREATED',
            message: 'Fleet rental created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createService(user.userId, 'rental', body),
        });
    }
    async listTours(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_TOURS_FETCHED',
            message: 'Fleet tours fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listServices(user.userId, 'tour'),
        });
    }
    async createTour(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_TOUR_CREATED',
            message: 'Fleet tour created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createService(user.userId, 'tour', body),
        });
    }
    async listSchoolShuttles(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SCHOOL_SHUTTLES_FETCHED',
            message: 'Fleet school shuttles fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listServices(user.userId, 'school_shuttle'),
        });
    }
    async createSchoolShuttle(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SCHOOL_SHUTTLE_CREATED',
            message: 'Fleet school shuttle created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createService(user.userId, 'school_shuttle', body),
        });
    }
    async getEarningsSummary(user, query, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_SUMMARY_FETCHED',
            message: 'Fleet earnings summary fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getEarningsSummary(user.userId, query.period),
        });
    }
    async getStatements(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_STATEMENTS_FETCHED',
            message: 'Fleet earnings statements fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getStatements(user.userId),
        });
    }
    async getStatementById(user, statementId, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_STATEMENT_FETCHED',
            message: 'Fleet earnings statement fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getStatementById(user.userId, statementId),
        });
    }
    async getPayouts(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_PAYOUTS_FETCHED',
            message: 'Fleet earnings payouts fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getPayouts(user.userId),
        });
    }
    async getPayoutById(user, payoutId, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_PAYOUT_FETCHED',
            message: 'Fleet earnings payout fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getPayoutById(user.userId, payoutId),
        });
    }
    async listComplianceIncidents(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_COMPLIANCE_INCIDENTS_FETCHED',
            message: 'Fleet compliance incidents fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listComplianceIncidents(user.userId),
        });
    }
    async createComplianceIncident(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_COMPLIANCE_INCIDENT_CREATED',
            message: 'Fleet compliance incident created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createComplianceIncident(user.userId, body),
        });
    }
    async getComplianceIncidentById(user, incidentId, req) {
        return this.apiResponse.success({
            code: 'FLEET_COMPLIANCE_INCIDENT_FETCHED',
            message: 'Fleet compliance incident fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getComplianceIncidentById(user.userId, incidentId),
        });
    }
    async patchComplianceIncidentById(user, incidentId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_COMPLIANCE_INCIDENT_UPDATED',
            message: 'Fleet compliance incident updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchComplianceIncidentById(user.userId, incidentId, body),
        });
    }
    async listTrainingCourses(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRAINING_COURSES_FETCHED',
            message: 'Fleet training courses fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listTrainingCourses(user.userId),
        });
    }
    async createTrainingCourse(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRAINING_COURSE_CREATED',
            message: 'Fleet training course created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.createTrainingCourse(user.userId, body),
        });
    }
    async getTrainingCourseById(user, courseId, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRAINING_COURSE_FETCHED',
            message: 'Fleet training course fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getTrainingCourseById(user.userId, courseId),
        });
    }
    async patchTrainingCourseById(user, courseId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRAINING_COURSE_UPDATED',
            message: 'Fleet training course updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchTrainingCourseById(user.userId, courseId, body),
        });
    }
    async deleteTrainingCourseById(user, courseId, req) {
        return this.apiResponse.success({
            code: 'FLEET_TRAINING_COURSE_DELETED',
            message: 'Fleet training course deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.deleteTrainingCourseById(user.userId, courseId),
        });
    }
    async getDispatchById(user, dispatchId, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCH_FETCHED',
            message: 'Fleet dispatch fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getDispatchById(user.userId, dispatchId),
        });
    }
    async patchDispatchById(user, dispatchId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCH_UPDATED',
            message: 'Fleet dispatch updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchDispatch(user.userId, dispatchId, body),
        });
    }
    async deleteDispatchById(user, dispatchId, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCH_DELETED',
            message: 'Fleet dispatch deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.deleteDispatch(user.userId, dispatchId),
        });
    }
    async assignDispatch(user, dispatchId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_DISPATCH_ASSIGNED',
            message: 'Fleet dispatch assigned',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.assignDispatch(user.userId, dispatchId, body),
        });
    }
    async getRentalById(user, rentalId, req) {
        return this.apiResponse.success({
            code: 'FLEET_RENTAL_FETCHED',
            message: 'Fleet rental fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getServiceById(user.userId, 'rental', rentalId),
        });
    }
    async patchRentalById(user, rentalId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_RENTAL_UPDATED',
            message: 'Fleet rental updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchServiceById(user.userId, 'rental', rentalId, body),
        });
    }
    async cancelRentalById(user, rentalId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_RENTAL_CANCELLED',
            message: 'Fleet rental cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.cancelServiceById(user.userId, 'rental', rentalId, body.reason),
        });
    }
    async getTourById(user, tourId, req) {
        return this.apiResponse.success({
            code: 'FLEET_TOUR_FETCHED',
            message: 'Fleet tour fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getServiceById(user.userId, 'tour', tourId),
        });
    }
    async patchTourById(user, tourId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_TOUR_UPDATED',
            message: 'Fleet tour updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchServiceById(user.userId, 'tour', tourId, body),
        });
    }
    async cancelTourById(user, tourId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_TOUR_CANCELLED',
            message: 'Fleet tour cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.cancelServiceById(user.userId, 'tour', tourId, body.reason),
        });
    }
    async getSchoolShuttleById(user, serviceId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SCHOOL_SHUTTLE_FETCHED',
            message: 'Fleet school shuttle fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getServiceById(user.userId, 'school_shuttle', serviceId),
        });
    }
    async patchSchoolShuttleById(user, serviceId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SCHOOL_SHUTTLE_UPDATED',
            message: 'Fleet school shuttle updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.patchServiceById(user.userId, 'school_shuttle', serviceId, body),
        });
    }
    async cancelSchoolShuttleById(user, serviceId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SCHOOL_SHUTTLE_CANCELLED',
            message: 'Fleet school shuttle cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.cancelServiceById(user.userId, 'school_shuttle', serviceId, body.reason),
        });
    }
    async schoolListRoutes(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROUTES_FETCHED',
            message: 'Shuttle routes fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListRoutes(user.userId),
        });
    }
    async schoolCreateRoute(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROUTE_CREATED',
            message: 'Shuttle route created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreateRoute(user.userId, body),
        });
    }
    async schoolGetRoute(user, routeId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROUTE_FETCHED',
            message: 'Shuttle route fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolGetRoute(user.userId, routeId),
        });
    }
    async schoolPatchRoute(user, routeId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROUTE_UPDATED',
            message: 'Shuttle route updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolPatchRoute(user.userId, routeId, body),
        });
    }
    async schoolDeleteRoute(user, routeId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROUTE_DELETED',
            message: 'Shuttle route deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolDeleteRoute(user.userId, routeId),
        });
    }
    async schoolListStudents(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_STUDENTS_FETCHED',
            message: 'Shuttle students fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListStudents(user.userId),
        });
    }
    async schoolCreateStudent(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_STUDENT_CREATED',
            message: 'Shuttle student created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreateStudent(user.userId, body),
        });
    }
    async schoolGetStudent(user, studentId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_STUDENT_FETCHED',
            message: 'Shuttle student fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolGetStudent(user.userId, studentId),
        });
    }
    async schoolPatchStudent(user, studentId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_STUDENT_UPDATED',
            message: 'Shuttle student updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolPatchStudent(user.userId, studentId, body),
        });
    }
    async schoolDeleteStudent(user, studentId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_STUDENT_DELETED',
            message: 'Shuttle student deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolDeleteStudent(user.userId, studentId),
        });
    }
    async schoolListAttendance(user, studentId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANCE_FETCHED',
            message: 'Shuttle attendance fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListAttendance(user.userId, studentId),
        });
    }
    async schoolUpsertAttendance(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANCE_UPSERTED',
            message: 'Shuttle attendance upserted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolUpsertAttendance(user.userId, body),
        });
    }
    async schoolListTrips(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIPS_FETCHED',
            message: 'Shuttle trips fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListTrips(user.userId),
        });
    }
    async schoolCreateTrip(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_CREATED',
            message: 'Shuttle trip created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreateTrip(user.userId, body),
        });
    }
    async schoolGetTrip(user, tripId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_FETCHED',
            message: 'Shuttle trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolGetTrip(user.userId, tripId),
        });
    }
    async schoolPatchTrip(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_UPDATED',
            message: 'Shuttle trip updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolPatchTrip(user.userId, tripId, body),
        });
    }
    async schoolCancelTrip(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_CANCELLED',
            message: 'Shuttle trip cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCancelTrip(user.userId, tripId, body.reason),
        });
    }
    async schoolTripLive(user, tripId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_LIVE_FETCHED',
            message: 'Shuttle trip live tracking fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolTripLive(user.userId, tripId),
        });
    }
    async schoolListAttendants(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANTS_FETCHED',
            message: 'Shuttle attendants fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListAttendants(user.userId),
        });
    }
    async schoolCreateAttendant(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANT_CREATED',
            message: 'Shuttle attendant created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreateAttendant(user.userId, body),
        });
    }
    async schoolGetAttendant(user, attendantId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANT_FETCHED',
            message: 'Shuttle attendant fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolGetAttendant(user.userId, attendantId),
        });
    }
    async schoolPatchAttendant(user, attendantId, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANT_UPDATED',
            message: 'Shuttle attendant updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolPatchAttendant(user.userId, attendantId, body),
        });
    }
    async schoolDeleteAttendant(user, attendantId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ATTENDANT_DELETED',
            message: 'Shuttle attendant deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolDeleteAttendant(user.userId, attendantId),
        });
    }
    async schoolListPayments(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_PAYMENTS_FETCHED',
            message: 'Shuttle payments fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListPayments(user.userId),
        });
    }
    async schoolCreatePayment(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_PAYMENT_CREATED',
            message: 'Shuttle payment created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreatePayment(user.userId, body),
        });
    }
    async schoolListFeedback(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_FEEDBACK_FETCHED',
            message: 'Shuttle feedback fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolListFeedback(user.userId),
        });
    }
    async schoolCreateFeedback(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_FEEDBACK_CREATED',
            message: 'Shuttle feedback created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolCreateFeedback(user.userId, body),
        });
    }
    async schoolRoster(user, routeId, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_ROSTER_FETCHED',
            message: 'Shuttle roster fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolRoster(user.userId, routeId),
        });
    }
    async schoolTripCalendar(user, date, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_TRIP_CALENDAR_FETCHED',
            message: 'Shuttle trip calendar fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolTripCalendar(user.userId, date),
        });
    }
    async schoolPerformanceReport(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_PERFORMANCE_FETCHED',
            message: 'Shuttle performance report fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolPerformanceReport(user.userId),
        });
    }
    async schoolBulkReminders(user, body, req) {
        return this.apiResponse.success({
            code: 'FLEET_SHUTTLE_REMINDERS_SENT',
            message: 'Shuttle bulk reminders sent',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.schoolBulkReminders(user.userId, body),
        });
    }
    async listRiderServiceRequests(user, serviceType, status, req) {
        return this.apiResponse.success({
            code: 'FLEET_RIDER_SERVICES_FETCHED',
            message: 'Rider service requests fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.listRiderServiceRequests(user.userId, { serviceType, status }),
        });
    }
};
exports.FleetOperationsController = FleetOperationsController;
__decorate([
    (0, common_1.Get)('dispatches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listDispatches", null);
__decorate([
    (0, common_1.Post)('dispatches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetDispatchDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createDispatch", null);
__decorate([
    (0, common_1.Get)('trips'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listTrips", null);
__decorate([
    (0, common_1.Get)('ambulance/dispatches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listAmbulanceDispatches", null);
__decorate([
    (0, common_1.Post)('ambulance/dispatches'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetDispatchDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createAmbulanceDispatch", null);
__decorate([
    (0, common_1.Get)('rentals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listRentals", null);
__decorate([
    (0, common_1.Post)('rentals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetServiceDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createRental", null);
__decorate([
    (0, common_1.Get)('tours'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listTours", null);
__decorate([
    (0, common_1.Post)('tours'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetServiceDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createTour", null);
__decorate([
    (0, common_1.Get)('school-shuttles'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listSchoolShuttles", null);
__decorate([
    (0, common_1.Post)('school-shuttles'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetServiceDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createSchoolShuttle", null);
__decorate([
    (0, common_1.Get)('earnings/summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.FleetEarningsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getEarningsSummary", null);
__decorate([
    (0, common_1.Get)('earnings/statements'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getStatements", null);
__decorate([
    (0, common_1.Get)('earnings/statements/:statementId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('statementId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getStatementById", null);
__decorate([
    (0, common_1.Get)('earnings/payouts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getPayouts", null);
__decorate([
    (0, common_1.Get)('earnings/payouts/:payoutId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('payoutId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getPayoutById", null);
__decorate([
    (0, common_1.Get)('compliance/incidents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listComplianceIncidents", null);
__decorate([
    (0, common_1.Post)('compliance/incidents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetComplianceIncidentDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createComplianceIncident", null);
__decorate([
    (0, common_1.Get)('compliance/incidents/:incidentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getComplianceIncidentById", null);
__decorate([
    (0, common_1.Patch)('compliance/incidents/:incidentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('incidentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchComplianceIncidentById", null);
__decorate([
    (0, common_1.Get)('compliance/training-courses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listTrainingCourses", null);
__decorate([
    (0, common_1.Post)('compliance/training-courses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fleet_dto_1.CreateFleetTrainingCourseDto, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "createTrainingCourse", null);
__decorate([
    (0, common_1.Get)('compliance/training-courses/:courseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getTrainingCourseById", null);
__decorate([
    (0, common_1.Patch)('compliance/training-courses/:courseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchTrainingCourseById", null);
__decorate([
    (0, common_1.Delete)('compliance/training-courses/:courseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "deleteTrainingCourseById", null);
__decorate([
    (0, common_1.Get)('dispatches/:dispatchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dispatchId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getDispatchById", null);
__decorate([
    (0, common_1.Patch)('dispatches/:dispatchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dispatchId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchDispatchById", null);
__decorate([
    (0, common_1.Delete)('dispatches/:dispatchId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dispatchId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "deleteDispatchById", null);
__decorate([
    (0, common_1.Post)('dispatches/:dispatchId/assign'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('dispatchId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "assignDispatch", null);
__decorate([
    (0, common_1.Get)('rentals/:rentalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getRentalById", null);
__decorate([
    (0, common_1.Patch)('rentals/:rentalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchRentalById", null);
__decorate([
    (0, common_1.Post)('rentals/:rentalId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "cancelRentalById", null);
__decorate([
    (0, common_1.Get)('tours/:tourId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tourId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getTourById", null);
__decorate([
    (0, common_1.Patch)('tours/:tourId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tourId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchTourById", null);
__decorate([
    (0, common_1.Post)('tours/:tourId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tourId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "cancelTourById", null);
__decorate([
    (0, common_1.Get)('school-shuttles/:serviceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getSchoolShuttleById", null);
__decorate([
    (0, common_1.Patch)('school-shuttles/:serviceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "patchSchoolShuttleById", null);
__decorate([
    (0, common_1.Post)('school-shuttles/:serviceId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "cancelSchoolShuttleById", null);
__decorate([
    (0, common_1.Get)('school-shuttles/routes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListRoutes", null);
__decorate([
    (0, common_1.Post)('school-shuttles/routes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreateRoute", null);
__decorate([
    (0, common_1.Get)('school-shuttles/routes/:routeId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolGetRoute", null);
__decorate([
    (0, common_1.Patch)('school-shuttles/routes/:routeId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolPatchRoute", null);
__decorate([
    (0, common_1.Delete)('school-shuttles/routes/:routeId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolDeleteRoute", null);
__decorate([
    (0, common_1.Get)('school-shuttles/students'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListStudents", null);
__decorate([
    (0, common_1.Post)('school-shuttles/students'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreateStudent", null);
__decorate([
    (0, common_1.Get)('school-shuttles/students/:studentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolGetStudent", null);
__decorate([
    (0, common_1.Patch)('school-shuttles/students/:studentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolPatchStudent", null);
__decorate([
    (0, common_1.Delete)('school-shuttles/students/:studentId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolDeleteStudent", null);
__decorate([
    (0, common_1.Get)('school-shuttles/attendance'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListAttendance", null);
__decorate([
    (0, common_1.Post)('school-shuttles/attendance'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolUpsertAttendance", null);
__decorate([
    (0, common_1.Get)('school-shuttles/trips'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListTrips", null);
__decorate([
    (0, common_1.Post)('school-shuttles/trips'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreateTrip", null);
__decorate([
    (0, common_1.Get)('school-shuttles/trips/:tripId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolGetTrip", null);
__decorate([
    (0, common_1.Patch)('school-shuttles/trips/:tripId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolPatchTrip", null);
__decorate([
    (0, common_1.Post)('school-shuttles/trips/:tripId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCancelTrip", null);
__decorate([
    (0, common_1.Get)('school-shuttles/trips/:tripId/live'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolTripLive", null);
__decorate([
    (0, common_1.Get)('school-shuttles/attendants'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListAttendants", null);
__decorate([
    (0, common_1.Post)('school-shuttles/attendants'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreateAttendant", null);
__decorate([
    (0, common_1.Get)('school-shuttles/attendants/:attendantId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('attendantId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolGetAttendant", null);
__decorate([
    (0, common_1.Patch)('school-shuttles/attendants/:attendantId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('attendantId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolPatchAttendant", null);
__decorate([
    (0, common_1.Delete)('school-shuttles/attendants/:attendantId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('attendantId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolDeleteAttendant", null);
__decorate([
    (0, common_1.Get)('school-shuttles/payments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListPayments", null);
__decorate([
    (0, common_1.Post)('school-shuttles/payments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreatePayment", null);
__decorate([
    (0, common_1.Get)('school-shuttles/feedback'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolListFeedback", null);
__decorate([
    (0, common_1.Post)('school-shuttles/feedback'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolCreateFeedback", null);
__decorate([
    (0, common_1.Get)('school-shuttles/roster'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('routeId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolRoster", null);
__decorate([
    (0, common_1.Get)('school-shuttles/trip-calendar'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolTripCalendar", null);
__decorate([
    (0, common_1.Get)('school-shuttles/performance-report'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolPerformanceReport", null);
__decorate([
    (0, common_1.Post)('school-shuttles/bulk-reminders'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "schoolBulkReminders", null);
__decorate([
    (0, common_1.Get)('rider-services'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('serviceType')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "listRiderServiceRequests", null);
exports.FleetOperationsController = FleetOperationsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('fleet_owner', 'fleet_manager', 'fleet_dispatcher', 'fleet_finance'),
    (0, common_1.Controller)('fleet'),
    __metadata("design:paramtypes", [fleet_service_1.FleetService,
        api_response_service_1.ApiResponseService])
], FleetOperationsController);
//# sourceMappingURL=fleet-operations.controller.js.map