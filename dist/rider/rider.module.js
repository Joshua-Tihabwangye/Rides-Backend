"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderModule = void 0;
const common_1 = require("@nestjs/common");
const presence_location_module_1 = require("../presence-location/presence-location.module");
const realtime_module_1 = require("../realtime/realtime.module");
const rider_controller_1 = require("./rider.controller");
const rider_service_1 = require("./rider.service");
let RiderModule = class RiderModule {
};
exports.RiderModule = RiderModule;
exports.RiderModule = RiderModule = __decorate([
    (0, common_1.Module)({
        imports: [presence_location_module_1.PresenceLocationModule, realtime_module_1.RealtimeModule],
        controllers: [rider_controller_1.RiderController],
        providers: [rider_service_1.RiderService],
        exports: [rider_service_1.RiderService],
    })
], RiderModule);
//# sourceMappingURL=rider.module.js.map