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
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
let Vehicle = class Vehicle {
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id' }),
    __metadata("design:type", String)
], Vehicle.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_partner_id', nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "fleetPartnerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id', nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "licensePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['sedan', 'suv', 'hatchback', 'van', 'motorcycle', 'bus', 'ambulance'], default: 'sedan' }),
    __metadata("design:type", String)
], Vehicle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['active', 'inactive', 'maintenance', 'retired'], default: 'active' }),
    __metadata("design:type", String)
], Vehicle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], Vehicle.prototype, "accessories", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], Vehicle.prototype, "documents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "socPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "estimatedRangeKm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "currentLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isEv", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map