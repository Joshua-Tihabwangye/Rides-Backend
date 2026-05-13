"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverProfileModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const driver_profile_controller_1 = require("./driver-profile.controller");
const driver_profile_service_1 = require("./driver-profile.service");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const user_entity_1 = require("../entities/user.entity");
let DriverProfileModule = class DriverProfileModule {
};
exports.DriverProfileModule = DriverProfileModule;
exports.DriverProfileModule = DriverProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([driver_profile_entity_1.DriverProfile, user_entity_1.User])],
        controllers: [driver_profile_controller_1.DriverProfileController],
        providers: [driver_profile_service_1.DriverProfileService],
        exports: [driver_profile_service_1.DriverProfileService],
    })
], DriverProfileModule);
//# sourceMappingURL=driver-profile.module.js.map