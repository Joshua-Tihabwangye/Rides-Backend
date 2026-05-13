"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const documents_module_1 = require("../documents/documents.module");
const realtime_module_1 = require("../realtime/realtime.module");
const trips_controller_1 = require("./trips.controller");
const trips_service_1 = require("./trips.service");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
let TripsModule = class TripsModule {
};
exports.TripsModule = TripsModule;
exports.TripsModule = TripsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([trip_entity_1.Trip, job_offer_entity_1.JobOffer, earnings_ledger_entity_1.EarningsLedger, wallet_account_entity_1.WalletAccount]),
            documents_module_1.DocumentsModule,
            realtime_module_1.RealtimeModule
        ],
        controllers: [trips_controller_1.TripsController],
        providers: [trips_service_1.TripsService],
        exports: [trips_service_1.TripsService],
    })
], TripsModule);
//# sourceMappingURL=trips.module.js.map