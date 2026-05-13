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
exports.FleetDriver = void 0;
const typeorm_1 = require("typeorm");
let FleetDriver = class FleetDriver {
};
exports.FleetDriver = FleetDriver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetDriver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id' }),
    __metadata("design:type", String)
], FleetDriver.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], FleetDriver.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id' }),
    __metadata("design:type", String)
], FleetDriver.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'branch_id', nullable: true }),
    __metadata("design:type", String)
], FleetDriver.prototype, "branchId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetDriver.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetDriver.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetDriver.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetDriver.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetDriver.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['invited', 'active', 'suspended'], default: 'invited' }),
    __metadata("design:type", String)
], FleetDriver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', default: '' }),
    __metadata("design:type", Array)
], FleetDriver.prototype, "serviceModes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FleetDriver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FleetDriver.prototype, "updatedAt", void 0);
exports.FleetDriver = FleetDriver = __decorate([
    (0, typeorm_1.Entity)('fleet_drivers')
], FleetDriver);
//# sourceMappingURL=fleet-driver.entity.js.map