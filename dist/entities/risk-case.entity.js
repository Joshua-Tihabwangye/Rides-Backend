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
exports.RiskCase = void 0;
const typeorm_1 = require("typeorm");
let RiskCase = class RiskCase {
};
exports.RiskCase = RiskCase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RiskCase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RiskCase.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' }),
    __metadata("design:type", String)
], RiskCase.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['open', 'monitoring', 'resolved'], default: 'open' }),
    __metadata("design:type", String)
], RiskCase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject_type', type: 'enum', enum: ['rider', 'driver', 'fleet', 'trip'] }),
    __metadata("design:type", String)
], RiskCase.prototype, "subjectType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subject_id' }),
    __metadata("design:type", String)
], RiskCase.prototype, "subjectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RiskCase.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RiskCase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RiskCase.prototype, "updatedAt", void 0);
exports.RiskCase = RiskCase = __decorate([
    (0, typeorm_1.Entity)('risk_cases')
], RiskCase);
//# sourceMappingURL=risk-case.entity.js.map