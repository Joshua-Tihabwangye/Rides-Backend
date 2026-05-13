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
exports.CancelRiderDeliveryDto = exports.PatchRiderDeliveryDto = exports.VerifyDeliveryQrDto = exports.CreateDeliveryOrderDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateDeliveryOrderDto {
}
exports.CreateDeliveryOrderDto = CreateDeliveryOrderDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryOrderDto.prototype, "pickupAddress", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryOrderDto.prototype, "dropoffAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryOrderDto.prototype, "pickupLat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryOrderDto.prototype, "pickupLng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryOrderDto.prototype, "dropoffLat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeliveryOrderDto.prototype, "dropoffLng", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryOrderDto.prototype, "itemDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryOrderDto.prototype, "routeSummary", void 0);
class VerifyDeliveryQrDto {
}
exports.VerifyDeliveryQrDto = VerifyDeliveryQrDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyDeliveryQrDto.prototype, "qrValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyDeliveryQrDto.prototype, "scanType", void 0);
class PatchRiderDeliveryDto {
}
exports.PatchRiderDeliveryDto = PatchRiderDeliveryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['requested', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed']),
    __metadata("design:type", String)
], PatchRiderDeliveryDto.prototype, "status", void 0);
class CancelRiderDeliveryDto {
}
exports.CancelRiderDeliveryDto = CancelRiderDeliveryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelRiderDeliveryDto.prototype, "reason", void 0);
//# sourceMappingURL=delivery.dto.js.map