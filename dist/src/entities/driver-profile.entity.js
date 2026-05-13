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
exports.DriverProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let DriverProfile = class DriverProfile {
};
exports.DriverProfile = DriverProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], DriverProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', unique: true, nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id', nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_id', nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], DriverProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], DriverProfile.prototype, "driverLicenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['ride_only', 'delivery_only', 'dual_mode', 'rental', 'tour', 'ambulance', 'school'], default: 'dual_mode' }),
    __metadata("design:type", String)
], DriverProfile.prototype, "serviceMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], DriverProfile.prototype, "preferences", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], DriverProfile.prototype, "checkpoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'offline' }),
    __metadata("design:type", String)
], DriverProfile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'onboarding_status', default: 'incomplete' }),
    __metadata("design:type", String)
], DriverProfile.prototype, "onboardingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true }),
    __metadata("design:type", Object)
], DriverProfile.prototype, "currentLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DriverProfile.prototype, "lastLocationAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], DriverProfile.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], DriverProfile.prototype, "totalTrips", void 0);
exports.DriverProfile = DriverProfile = __decorate([
    (0, typeorm_1.Entity)('driver_profiles')
], DriverProfile);
//# sourceMappingURL=driver-profile.entity.js.map