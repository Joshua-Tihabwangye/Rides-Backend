"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceLocationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_module_1 = require("../database/database.module");
const driver_profile_module_1 = require("../driver-profile/driver-profile.module");
const geo_controller_1 = require("./geo.controller");
const presence_location_controller_1 = require("./presence-location.controller");
const presence_location_service_1 = require("./presence-location.service");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const pricing_zone_module_1 = require("../pricing-zone/pricing-zone.module");
let PresenceLocationModule = class PresenceLocationModule {
};
exports.PresenceLocationModule = PresenceLocationModule;
exports.PresenceLocationModule = PresenceLocationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([driver_profile_entity_1.DriverProfile]),
            driver_profile_module_1.DriverProfileModule,
            database_module_1.DatabaseModule,
            pricing_zone_module_1.PricingZoneModule,
        ],
        controllers: [presence_location_controller_1.PresenceLocationController, geo_controller_1.GeoController],
        providers: [presence_location_service_1.PresenceLocationService],
        exports: [presence_location_service_1.PresenceLocationService],
    })
], PresenceLocationModule);
//# sourceMappingURL=presence-location.module.js.map