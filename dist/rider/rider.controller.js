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
exports.RiderController = void 0;
const common_1 = require("@nestjs/common");
const api_response_service_1 = require("../common/api/api-response.service");
const current_user_decorator_1 = require("../common/auth/current-user.decorator");
const jwt_auth_guard_1 = require("../common/auth/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const request_id_1 = require("../common/utils/request-id");
const rider_dto_1 = require("./dto/rider.dto");
const rider_service_1 = require("./rider.service");
let RiderController = class RiderController {
    constructor(riderService, apiResponse) {
        this.riderService = riderService;
        this.apiResponse = apiResponse;
    }
    async getMe(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_FETCHED',
            message: 'Rider profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getProfile(user.userId),
        });
    }
    async getProfile(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_FETCHED',
            message: 'Rider profile fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getProfile(user.userId),
        });
    }
    async patchMe(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROFILE_UPDATED',
            message: 'Rider profile updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.updateProfile(user.userId, body),
        });
    }
    async getPreferences(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PREFERENCES_FETCHED',
            message: 'Rider preferences fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getPreferences(user.userId),
        });
    }
    async patchPreferences(user, body, req) {
        const patchPayload = (body.patch ?? {});
        return this.apiResponse.success({
            code: 'RIDER_PREFERENCES_UPDATED',
            message: 'Rider preferences updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.patchPreferences(user.userId, patchPayload),
        });
    }
    async listEmergencyContacts(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_EMERGENCY_CONTACTS_FETCHED',
            message: 'Rider emergency contacts fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listEmergencyContacts(user.userId),
        });
    }
    async createEmergencyContact(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_EMERGENCY_CONTACT_CREATED',
            message: 'Rider emergency contact created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createEmergencyContact(user.userId, body),
        });
    }
    async patchEmergencyContact(user, contactId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_EMERGENCY_CONTACT_UPDATED',
            message: 'Rider emergency contact updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.patchEmergencyContact(user.userId, contactId, body),
        });
    }
    async deleteEmergencyContact(user, contactId, req) {
        return this.apiResponse.success({
            code: 'RIDER_EMERGENCY_CONTACT_DELETED',
            message: 'Rider emergency contact deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.deleteEmergencyContact(user.userId, contactId),
        });
    }
    async triggerSos(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_SOS_TRIGGERED',
            message: 'SOS triggered',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.triggerSos(user.userId, body),
        });
    }
    async listSosHistory(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_SOS_HISTORY_FETCHED',
            message: 'Rider SOS history fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listSosHistory(user.userId),
        });
    }
    async getWallet(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_WALLET_FETCHED',
            message: 'Rider wallet fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getWallet(user.userId),
        });
    }
    async listWalletTransactions(user, limitRaw, offsetRaw, req) {
        const limit = limitRaw ? Number(limitRaw) : 20;
        const offset = offsetRaw ? Number(offsetRaw) : 0;
        return this.apiResponse.success({
            code: 'RIDER_WALLET_TRANSACTIONS_FETCHED',
            message: 'Rider wallet transactions fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listWalletTransactions(user.userId, Number.isFinite(limit) ? limit : 20, Number.isFinite(offset) ? offset : 0),
        });
    }
    async listPaymentMethods(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PAYMENT_METHODS_FETCHED',
            message: 'Rider payment methods fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listPaymentMethods(user.userId),
        });
    }
    async createPaymentIntent(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_PAYMENT_INTENT_CREATED',
            message: 'Payment intent created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createPaymentIntent(user.userId, body),
        });
    }
    async verifyPaymentIntent(user, intentId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_PAYMENT_INTENT_VERIFIED',
            message: 'Payment intent verified',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.verifyPaymentIntent(user.userId, intentId, body),
        });
    }
    async listEligiblePromos(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROMOS_FETCHED',
            message: 'Eligible promos fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listEligiblePromos(user.userId),
        });
    }
    async applyPromo(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_PROMO_APPLIED',
            message: 'Promo applied',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.applyPromo(user.userId, body),
        });
    }
    async listCommutes(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_COMMUTES_FETCHED',
            message: 'Saved commutes fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listCommutes(user.userId),
        });
    }
    async createCommute(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_COMMUTE_CREATED',
            message: 'Commute created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createCommute(user.userId, body),
        });
    }
    async patchCommute(user, commuteId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_COMMUTE_UPDATED',
            message: 'Commute updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.patchCommute(user.userId, commuteId, body),
        });
    }
    async deleteCommute(user, commuteId, req) {
        return this.apiResponse.success({
            code: 'RIDER_COMMUTE_DELETED',
            message: 'Commute deleted',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.deleteCommute(user.userId, commuteId),
        });
    }
    async createWalletTransfer(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_WALLET_TRANSFER_CREATED',
            message: 'Wallet transfer created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createWalletTransfer(user.userId, body),
        });
    }
    async listWalletTransfers(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_WALLET_TRANSFERS_FETCHED',
            message: 'Wallet transfers fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listWalletTransfers(user.userId),
        });
    }
    async listTripHistory(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_HISTORY_FETCHED',
            message: 'Rider trip history fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listTrips(user.userId),
        });
    }
    async getActiveTrip(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_ACTIVE_TRIP_FETCHED',
            message: 'Rider active trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getActiveTrip(user.userId),
        });
    }
    async getTripById(user, tripId, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_FETCHED',
            message: 'Trip fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getTripById(user.userId, tripId),
        });
    }
    async requestTrip(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_REQUESTED',
            message: 'Trip request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.requestTrip(user.userId, body),
        });
    }
    async requestTripCompat(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_REQUESTED',
            message: 'Trip request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.requestTrip(user.userId, body),
        });
    }
    async updateTripTracking(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_TRACKING_UPDATED',
            message: 'Rider trip tracking updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.updateTripTracking(user.userId, tripId, body),
        });
    }
    async updateTripTrackingCompat(user, tripId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TRIP_TRACKING_UPDATED',
            message: 'Rider trip tracking updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.updateTripTracking(user.userId, tripId, body),
        });
    }
    async listRentals(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_RENTALS_FETCHED',
            message: 'Rider rentals fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listRentals(user.userId),
        });
    }
    async getRental(user, rentalId, req) {
        return this.apiResponse.success({
            code: 'RIDER_RENTAL_FETCHED',
            message: 'Rider rental fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getRentalById(user.userId, rentalId),
        });
    }
    async createRental(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_RENTAL_CREATED',
            message: 'Rider rental created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createRental(user.userId, body),
        });
    }
    async patchRental(user, rentalId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_RENTAL_UPDATED',
            message: 'Rider rental updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.patchRental(user.userId, rentalId, body),
        });
    }
    async cancelRental(user, rentalId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_RENTAL_CANCELLED',
            message: 'Rider rental cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.cancelRental(user.userId, rentalId, body.reason),
        });
    }
    async listTours(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_TOURS_FETCHED',
            message: 'Rider tours fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listTours(user.userId),
        });
    }
    async getTour(user, tourId, req) {
        return this.apiResponse.success({
            code: 'RIDER_TOUR_FETCHED',
            message: 'Rider tour fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getTourById(user.userId, tourId),
        });
    }
    async createTour(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TOUR_CREATED',
            message: 'Rider tour created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createTour(user.userId, body),
        });
    }
    async cancelTour(user, tourId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_TOUR_CANCELLED',
            message: 'Rider tour cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.cancelTour(user.userId, tourId, body.reason),
        });
    }
    async listAmbulances(user, req) {
        return this.apiResponse.success({
            code: 'RIDER_AMBULANCES_FETCHED',
            message: 'Rider ambulances fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.listAmbulances(user.userId),
        });
    }
    async getAmbulance(user, ambulanceId, req) {
        return this.apiResponse.success({
            code: 'RIDER_AMBULANCE_FETCHED',
            message: 'Rider ambulance request fetched',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.getAmbulanceById(user.userId, ambulanceId),
        });
    }
    async createAmbulance(user, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_AMBULANCE_CREATED',
            message: 'Rider ambulance request created',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.createAmbulance(user.userId, body),
        });
    }
    async patchAmbulance(user, ambulanceId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_AMBULANCE_UPDATED',
            message: 'Rider ambulance request updated',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.patchAmbulance(user.userId, ambulanceId, body),
        });
    }
    async cancelAmbulance(user, ambulanceId, body, req) {
        return this.apiResponse.success({
            code: 'RIDER_AMBULANCE_CANCELLED',
            message: 'Rider ambulance request cancelled',
            requestId: (0, request_id_1.getRequestId)(req),
            data: await this.riderService.cancelAmbulance(user.userId, ambulanceId, body.reason),
        });
    }
};
exports.RiderController = RiderController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.UpdateRiderProfileDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchMe", null);
__decorate([
    (0, common_1.Get)('preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.PatchRiderPreferencesDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchPreferences", null);
__decorate([
    (0, common_1.Get)('emergency-contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listEmergencyContacts", null);
__decorate([
    (0, common_1.Post)('emergency-contacts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.CreateRiderEmergencyContactDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createEmergencyContact", null);
__decorate([
    (0, common_1.Patch)('emergency-contacts/:contactId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('contactId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.UpdateRiderEmergencyContactDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchEmergencyContact", null);
__decorate([
    (0, common_1.Delete)('emergency-contacts/:contactId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('contactId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "deleteEmergencyContact", null);
__decorate([
    (0, common_1.Post)('sos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.TriggerRiderSosDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "triggerSos", null);
__decorate([
    (0, common_1.Get)('sos/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listSosHistory", null);
__decorate([
    (0, common_1.Get)('wallet'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Get)('wallet/transactions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listWalletTransactions", null);
__decorate([
    (0, common_1.Get)('payment-methods'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listPaymentMethods", null);
__decorate([
    (0, common_1.Post)('payment-intents'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('payment-intents/:intentId/verify'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('intentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "verifyPaymentIntent", null);
__decorate([
    (0, common_1.Get)('promos/eligible'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listEligiblePromos", null);
__decorate([
    (0, common_1.Post)('promos/apply'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "applyPromo", null);
__decorate([
    (0, common_1.Get)('commutes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listCommutes", null);
__decorate([
    (0, common_1.Post)('commutes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createCommute", null);
__decorate([
    (0, common_1.Patch)('commutes/:commuteId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commuteId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchCommute", null);
__decorate([
    (0, common_1.Delete)('commutes/:commuteId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commuteId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "deleteCommute", null);
__decorate([
    (0, common_1.Post)('wallet/transfers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createWalletTransfer", null);
__decorate([
    (0, common_1.Get)('wallet/transfers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listWalletTransfers", null);
__decorate([
    (0, common_1.Get)('trips/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listTripHistory", null);
__decorate([
    (0, common_1.Get)('trips/active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getActiveTrip", null);
__decorate([
    (0, common_1.Get)('trips/:tripId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getTripById", null);
__decorate([
    (0, common_1.Post)('trips/request'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.RequestRiderTripDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "requestTrip", null);
__decorate([
    (0, common_1.Post)('trips'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.RequestRiderTripDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "requestTripCompat", null);
__decorate([
    (0, common_1.Patch)('trips/:tripId/tracking'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.UpdateRiderTripTrackingDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "updateTripTracking", null);
__decorate([
    (0, common_1.Patch)('trips/:tripId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tripId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.UpdateRiderTripTrackingDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "updateTripTrackingCompat", null);
__decorate([
    (0, common_1.Get)('rentals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listRentals", null);
__decorate([
    (0, common_1.Get)('rentals/:rentalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getRental", null);
__decorate([
    (0, common_1.Post)('rentals'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.CreateRiderRentalDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createRental", null);
__decorate([
    (0, common_1.Patch)('rentals/:rentalId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.PatchRiderRentalDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchRental", null);
__decorate([
    (0, common_1.Post)('rentals/:rentalId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('rentalId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.CancelRiderServiceDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "cancelRental", null);
__decorate([
    (0, common_1.Get)('tours'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listTours", null);
__decorate([
    (0, common_1.Get)('tours/:tourId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tourId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getTour", null);
__decorate([
    (0, common_1.Post)('tours'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.CreateRiderTourDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createTour", null);
__decorate([
    (0, common_1.Post)('tours/:tourId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tourId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.CancelRiderServiceDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "cancelTour", null);
__decorate([
    (0, common_1.Get)('ambulances'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "listAmbulances", null);
__decorate([
    (0, common_1.Get)('ambulances/:ambulanceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('ambulanceId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "getAmbulance", null);
__decorate([
    (0, common_1.Post)('ambulances'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rider_dto_1.CreateRiderAmbulanceDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "createAmbulance", null);
__decorate([
    (0, common_1.Patch)('ambulances/:ambulanceId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('ambulanceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.PatchRiderAmbulanceDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "patchAmbulance", null);
__decorate([
    (0, common_1.Post)('ambulances/:ambulanceId/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('ambulanceId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, rider_dto_1.CancelRiderServiceDto, Object]),
    __metadata("design:returntype", Promise)
], RiderController.prototype, "cancelAmbulance", null);
exports.RiderController = RiderController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('rider'),
    (0, common_1.Controller)('riders/me'),
    __metadata("design:paramtypes", [rider_service_1.RiderService,
        api_response_service_1.ApiResponseService])
], RiderController);
//# sourceMappingURL=rider.controller.js.map