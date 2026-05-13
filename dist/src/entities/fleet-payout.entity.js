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
exports.FleetPayout = void 0;
const typeorm_1 = require("typeorm");
let FleetPayout = class FleetPayout {
};
exports.FleetPayout = FleetPayout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetPayout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id' }),
    __metadata("design:type", String)
], FleetPayout.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], FleetPayout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'UGX' }),
    __metadata("design:type", String)
], FleetPayout.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'processing', 'paid'], default: 'pending' }),
    __metadata("design:type", String)
], FleetPayout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FleetPayout.prototype, "createdAt", void 0);
exports.FleetPayout = FleetPayout = __decorate([
    (0, typeorm_1.Entity)('fleet_payouts')
], FleetPayout);
//# sourceMappingURL=fleet-payout.entity.js.map