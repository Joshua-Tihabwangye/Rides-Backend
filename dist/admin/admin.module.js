"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const admin_config_controller_1 = require("./admin-config.controller");
const admin_operations_controller_1 = require("./admin-operations.controller");
const admin_system_controller_1 = require("./admin-system.controller");
const admin_users_controller_1 = require("./admin-users.controller");
const admin_pricing_zone_controller_1 = require("./admin-pricing-zone.controller");
const admin_compat_controller_1 = require("./admin-compat.controller");
const admin_service_1 = require("./admin.service");
const pricing_zone_module_1 = require("../pricing-zone/pricing-zone.module");
const realtime_module_1 = require("../realtime/realtime.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [pricing_zone_module_1.PricingZoneModule, realtime_module_1.RealtimeModule],
        controllers: [
            admin_controller_1.AdminController,
            admin_users_controller_1.AdminUsersController,
            admin_operations_controller_1.AdminOperationsController,
            admin_config_controller_1.AdminConfigController,
            admin_system_controller_1.AdminSystemController,
            admin_pricing_zone_controller_1.AdminPricingZoneController,
            admin_compat_controller_1.AdminCompatController,
        ],
        providers: [admin_service_1.AdminService],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map