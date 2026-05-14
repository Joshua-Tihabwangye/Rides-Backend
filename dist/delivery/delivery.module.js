"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryModule = void 0;
const common_1 = require("@nestjs/common");
const documents_module_1 = require("../documents/documents.module");
const presence_location_module_1 = require("../presence-location/presence-location.module");
const realtime_module_1 = require("../realtime/realtime.module");
const delivery_controller_1 = require("./delivery.controller");
const rider_delivery_controller_1 = require("./rider-delivery.controller");
const delivery_service_1 = require("./delivery.service");
let DeliveryModule = class DeliveryModule {
};
exports.DeliveryModule = DeliveryModule;
exports.DeliveryModule = DeliveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            documents_module_1.DocumentsModule,
            presence_location_module_1.PresenceLocationModule,
            realtime_module_1.RealtimeModule,
        ],
        controllers: [delivery_controller_1.DeliveryController, rider_delivery_controller_1.RiderDeliveryController],
        providers: [delivery_service_1.DeliveryService],
        exports: [delivery_service_1.DeliveryService],
    })
], DeliveryModule);
//# sourceMappingURL=delivery.module.js.map