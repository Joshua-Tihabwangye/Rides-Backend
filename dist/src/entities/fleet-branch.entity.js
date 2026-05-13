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
exports.FleetBranch = void 0;
const typeorm_1 = require("typeorm");
const fleet_partner_profile_entity_1 = require("./fleet-partner-profile.entity");
let FleetBranch = class FleetBranch {
};
exports.FleetBranch = FleetBranch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FleetBranch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_partner_id' }),
    __metadata("design:type", String)
], FleetBranch.prototype, "fleetPartnerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fleet_id', nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "fleetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => fleet_partner_profile_entity_1.FleetPartnerProfile, fp => fp.branches),
    (0, typeorm_1.JoinColumn)({ name: 'fleet_partner_id' }),
    __metadata("design:type", fleet_partner_profile_entity_1.FleetPartnerProfile)
], FleetBranch.prototype, "fleetPartner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FleetBranch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FleetBranch.prototype, "managerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: {} }),
    __metadata("design:type", Object)
], FleetBranch.prototype, "operatingHours", void 0);
exports.FleetBranch = FleetBranch = __decorate([
    (0, typeorm_1.Entity)('fleet_branches')
], FleetBranch);
//# sourceMappingURL=fleet-branch.entity.js.map