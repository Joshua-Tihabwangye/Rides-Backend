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
exports.EmergencyContactDto = exports.SosDto = exports.SafetyCheckRespondDto = exports.TemporaryStopRespondDto = exports.TemporaryStopRequestDto = void 0;
const class_validator_1 = require("class-validator");
class TemporaryStopRequestDto {
}
exports.TemporaryStopRequestDto = TemporaryStopRequestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemporaryStopRequestDto.prototype, "note", void 0);
class TemporaryStopRespondDto {
}
exports.TemporaryStopRespondDto = TemporaryStopRespondDto;
__decorate([
    (0, class_validator_1.IsIn)(['confirm', 'decline']),
    __metadata("design:type", String)
], TemporaryStopRespondDto.prototype, "decision", void 0);
class SafetyCheckRespondDto {
}
exports.SafetyCheckRespondDto = SafetyCheckRespondDto;
__decorate([
    (0, class_validator_1.IsIn)(['driver', 'passenger']),
    __metadata("design:type", String)
], SafetyCheckRespondDto.prototype, "actor", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['okay', 'sos']),
    __metadata("design:type", String)
], SafetyCheckRespondDto.prototype, "action", void 0);
class SosDto {
}
exports.SosDto = SosDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SosDto.prototype, "contactsNotified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SosDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SosDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SosDto.prototype, "helpMessage", void 0);
class EmergencyContactDto {
}
exports.EmergencyContactDto = EmergencyContactDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationship", void 0);
//# sourceMappingURL=safety.dto.js.map