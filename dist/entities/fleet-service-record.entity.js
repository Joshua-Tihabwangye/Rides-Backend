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
exports.FleetServiceRecord = void 0;
const typeorm_1 = require("typeorm");
let FleetServiceRecord = class FleetServiceRecord {
};
exports.FleetServiceRecord = FleetServiceRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id' }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['rental', 'tour', 'school_shuttle'] }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_name' }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_id', nullable: true }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], FleetServiceRecord.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FleetServiceRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FleetServiceRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FleetServiceRecord.prototype, "updatedAt", void 0);
exports.FleetServiceRecord = FleetServiceRecord = __decorate([
    (0, typeorm_1.Entity)('fleet_services')
], FleetServiceRecord);
//# sourceMappingURL=fleet-service-record.entity.js.map