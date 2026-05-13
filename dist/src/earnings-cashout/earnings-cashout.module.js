"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningsCashoutModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const earnings_cashout_controller_1 = require("./earnings-cashout.controller");
const earnings_cashout_service_1 = require("./earnings-cashout.service");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
const cashout_request_entity_1 = require("../entities/cashout-request.entity");
let EarningsCashoutModule = class EarningsCashoutModule {
};
exports.EarningsCashoutModule = EarningsCashoutModule;
exports.EarningsCashoutModule = EarningsCashoutModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([earnings_ledger_entity_1.EarningsLedger, wallet_account_entity_1.WalletAccount, cashout_request_entity_1.CashoutRequest]),
        ],
        controllers: [earnings_cashout_controller_1.EarningsCashoutController],
        providers: [earnings_cashout_service_1.EarningsCashoutService],
        exports: [earnings_cashout_service_1.EarningsCashoutService],
    })
], EarningsCashoutModule);
//# sourceMappingURL=earnings-cashout.module.js.map