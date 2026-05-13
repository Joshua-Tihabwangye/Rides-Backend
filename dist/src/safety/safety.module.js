"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const safety_controller_1 = require("./safety.controller");
const safety_service_1 = require("./safety.service");
const safety_event_entity_1 = require("../entities/safety-event.entity");
const emergency_contact_entity_1 = require("../entities/emergency-contact.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
let SafetyModule = class SafetyModule {
};
exports.SafetyModule = SafetyModule;
exports.SafetyModule = SafetyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([safety_event_entity_1.SafetyEvent, emergency_contact_entity_1.EmergencyContact, driver_profile_entity_1.DriverProfile]),
        ],
        controllers: [safety_controller_1.SafetyController],
        providers: [safety_service_1.SafetyService],
        exports: [safety_service_1.SafetyService],
    })
], SafetyModule);
//# sourceMappingURL=safety.module.js.map