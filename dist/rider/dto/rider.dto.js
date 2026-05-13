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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelRiderServiceDto = exports.PatchRiderAmbulanceDto = exports.CreateRiderAmbulanceDto = exports.CreateRiderTourDto = exports.PatchRiderRentalDto = exports.CreateRiderRentalDto = exports.TriggerRiderSosDto = exports.UpdateRiderEmergencyContactDto = exports.CreateRiderEmergencyContactDto = exports.PatchRiderPreferencesDto = exports.UpdateRiderTripTrackingDto = exports.RequestRiderTripDto = exports.UpdateRiderProfileDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateRiderProfileDto {
}
exports.UpdateRiderProfileDto = UpdateRiderProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderProfileDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderProfileDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderProfileDto.prototype, "preferredCurrency", void 0);
class RequestRiderTripDto {
}
exports.RequestRiderTripDto = RequestRiderTripDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "pickupLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RequestRiderTripDto.prototype, "pickupLat", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RequestRiderTripDto.prototype, "pickupLng", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "dropoffAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "dropoffLabel", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RequestRiderTripDto.prototype, "dropoffLat", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RequestRiderTripDto.prototype, "dropoffLng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RequestRiderTripDto.prototype, "radiusMeters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestRiderTripDto.prototype, "routeSummary", void 0);
class UpdateRiderTripTrackingDto {
}
exports.UpdateRiderTripTrackingDto = UpdateRiderTripTrackingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderTripTrackingDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateRiderTripTrackingDto.prototype, "etaMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderTripTrackingDto.prototype, "routeSummary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderTripTrackingDto.prototype, "distance", void 0);
class PatchRiderPreferencesDto {
}
exports.PatchRiderPreferencesDto = PatchRiderPreferencesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PatchRiderPreferencesDto.prototype, "patch", void 0);
class CreateRiderEmergencyContactDto {
}
exports.CreateRiderEmergencyContactDto = CreateRiderEmergencyContactDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderEmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderEmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderEmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRiderEmergencyContactDto.prototype, "isPrimary", void 0);
class UpdateRiderEmergencyContactDto {
}
exports.UpdateRiderEmergencyContactDto = UpdateRiderEmergencyContactDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderEmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderEmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRiderEmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRiderEmergencyContactDto.prototype, "isPrimary", void 0);
class TriggerRiderSosDto {
}
exports.TriggerRiderSosDto = TriggerRiderSosDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerRiderSosDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TriggerRiderSosDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['sos', 'emergency']),
    __metadata("design:type", String)
], TriggerRiderSosDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriggerRiderSosDto.prototype, "tripId", void 0);
class CreateRiderRentalDto {
}
exports.CreateRiderRentalDto = CreateRiderRentalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderRentalDto.prototype, "vehicleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderRentalDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderRentalDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateRiderRentalDto.prototype, "pickupLocation", void 0);
class PatchRiderRentalDto {
}
exports.PatchRiderRentalDto = PatchRiderRentalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchRiderRentalDto.prototype, "vehicleName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchRiderRentalDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchRiderRentalDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['upcoming', 'active', 'completed', 'cancelled']),
    __metadata("design:type", String)
], PatchRiderRentalDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PatchRiderRentalDto.prototype, "totalAmount", void 0);
class CreateRiderTourDto {
}
exports.CreateRiderTourDto = CreateRiderTourDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderTourDto.prototype, "tourId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderTourDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRiderTourDto.prototype, "participantsCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderTourDto.prototype, "specialRequests", void 0);
class CreateRiderAmbulanceDto {
}
exports.CreateRiderAmbulanceDto = CreateRiderAmbulanceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderAmbulanceDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRiderAmbulanceDto.prototype, "pickupLat", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRiderAmbulanceDto.prototype, "pickupLng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderAmbulanceDto.prototype, "dropoffAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRiderAmbulanceDto.prototype, "hospitalName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['normal', 'urgent', 'emergency']),
    __metadata("design:type", String)
], CreateRiderAmbulanceDto.prototype, "priority", void 0);
class PatchRiderAmbulanceDto {
}
exports.PatchRiderAmbulanceDto = PatchRiderAmbulanceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchRiderAmbulanceDto.prototype, "dropoffAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatchRiderAmbulanceDto.prototype, "hospitalName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['normal', 'urgent', 'emergency']),
    __metadata("design:type", String)
], PatchRiderAmbulanceDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['requested', 'dispatched', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled']),
    __metadata("design:type", String)
], PatchRiderAmbulanceDto.prototype, "status", void 0);
class CancelRiderServiceDto {
}
exports.CancelRiderServiceDto = CancelRiderServiceDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelRiderServiceDto.prototype, "reason", void 0);
//# sourceMappingURL=rider.dto.js.map