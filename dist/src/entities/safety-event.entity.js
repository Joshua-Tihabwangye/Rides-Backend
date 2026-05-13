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
exports.SafetyEvent = void 0;
const typeorm_1 = require("typeorm");
let SafetyEvent = class SafetyEvent {
};
exports.SafetyEvent = SafetyEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SafetyEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id' }),
    __metadata("design:type", String)
], SafetyEvent.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trip_id' }),
    __metadata("design:type", String)
], SafetyEvent.prototype, "tripId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['temporary_stop', 'safety_check', 'sos'] }),
    __metadata("design:type", String)
], SafetyEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], SafetyEvent.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SafetyEvent.prototype, "createdAt", void 0);
exports.SafetyEvent = SafetyEvent = __decorate([
    (0, typeorm_1.Entity)('safety_events')
], SafetyEvent);
//# sourceMappingURL=safety-event.entity.js.map