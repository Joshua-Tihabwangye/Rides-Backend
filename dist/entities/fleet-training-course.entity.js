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
exports.FleetTrainingCourse = void 0;
const typeorm_1 = require("typeorm");
let FleetTrainingCourse = class FleetTrainingCourse {
};
exports.FleetTrainingCourse = FleetTrainingCourse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetTrainingCourse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id' }),
    __metadata("design:type", String)
], FleetTrainingCourse.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetTrainingCourse.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['draft', 'published', 'archived'], default: 'draft' }),
    __metadata("design:type", String)
], FleetTrainingCourse.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_to', nullable: true }),
    __metadata("design:type", String)
], FleetTrainingCourse.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FleetTrainingCourse.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FleetTrainingCourse.prototype, "updatedAt", void 0);
exports.FleetTrainingCourse = FleetTrainingCourse = __decorate([
    (0, typeorm_1.Entity)('fleet_training_courses')
], FleetTrainingCourse);
//# sourceMappingURL=fleet-training-course.entity.js.map