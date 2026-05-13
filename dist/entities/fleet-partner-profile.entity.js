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
exports.FleetPartnerProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const fleet_branch_entity_1 = require("./fleet-branch.entity");
let FleetPartnerProfile = class FleetPartnerProfile {
};
exports.FleetPartnerProfile = FleetPartnerProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], FleetPartnerProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id', unique: true, nullable: true }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "registrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'approved', 'suspended'], default: 'pending' }),
    __metadata("design:type", String)
], FleetPartnerProfile.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], FleetPartnerProfile.prototype, "verticals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => fleet_branch_entity_1.FleetBranch, branch => branch.fleetPartner),
    __metadata("design:type", Array)
], FleetPartnerProfile.prototype, "branches", void 0);
exports.FleetPartnerProfile = FleetPartnerProfile = __decorate([
    (0, typeorm_1.Entity)('fleet_partner_profiles')
], FleetPartnerProfile);
//# sourceMappingURL=fleet-partner-profile.entity.js.map