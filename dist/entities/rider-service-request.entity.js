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
exports.RiderServiceRequest = void 0;
const typeorm_1 = require("typeorm");
let RiderServiceRequest = class RiderServiceRequest {
};
exports.RiderServiceRequest = RiderServiceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiderServiceRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rider_id' }),
    __metadata("design:type", String)
], RiderServiceRequest.prototype, "riderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], RiderServiceRequest.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['rental', 'tour', 'ambulance'] }),
    __metadata("design:type", String)
], RiderServiceRequest.prototype, "serviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], RiderServiceRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], RiderServiceRequest.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RiderServiceRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RiderServiceRequest.prototype, "updatedAt", void 0);
exports.RiderServiceRequest = RiderServiceRequest = __decorate([
    (0, typeorm_1.Entity)('rider_service_requests')
], RiderServiceRequest);
//# sourceMappingURL=rider-service-request.entity.js.map