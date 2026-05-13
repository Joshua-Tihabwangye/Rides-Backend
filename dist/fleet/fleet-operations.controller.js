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
    async getPayouts(user, req) {
        return this.apiResponse.success({
            code: 'FLEET_EARNINGS_PAYOUTS_FETCHED',
            message: 'Fleet earnings payouts fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.fleetService.getPayouts(user.userId),
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
    (0, common_1.Get)('earnings/payouts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FleetOperationsController.prototype, "getPayouts", null);
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