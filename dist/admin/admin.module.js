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
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_config_controller_1 = require("./admin-config.controller");
const admin_operations_controller_1 = require("./admin-operations.controller");
const admin_system_controller_1 = require("./admin-system.controller");
const admin_users_controller_1 = require("./admin-users.controller");
const admin_pricing_zone_controller_1 = require("./admin-pricing-zone.controller");
const admin_compat_controller_1 = require("./admin-compat.controller");
const admin_service_1 = require("./admin.service");
const user_entity_1 = require("../entities/user.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const rider_profile_entity_1 = require("../entities/rider-profile.entity");
const admin_profile_entity_1 = require("../entities/admin-profile.entity");
const role_entity_1 = require("../entities/role.entity");
const fleet_partner_profile_entity_1 = require("../entities/fleet-partner-profile.entity");
const fleet_branch_entity_1 = require("../entities/fleet-branch.entity");
const approval_entity_1 = require("../entities/approval.entity");
const trip_entity_1 = require("../entities/trip.entity");
const fleet_dispatch_entity_1 = require("../entities/fleet-dispatch.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const fleet_payout_entity_1 = require("../entities/fleet-payout.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
const safety_event_entity_1 = require("../entities/safety-event.entity");
const risk_case_entity_1 = require("../entities/risk-case.entity");
const pricing_config_entity_1 = require("../entities/pricing-config.entity");
const promo_entity_1 = require("../entities/promo.entity");
const service_config_entity_1 = require("../entities/service-config.entity");
const audit_log_entity_1 = require("../entities/audit-log.entity");
const feature_flag_entity_1 = require("../entities/feature-flag.entity");
const pricing_zone_entity_1 = require("../entities/pricing-zone.entity");
const rider_service_request_entity_1 = require("../entities/rider-service-request.entity");
const pricing_zone_module_1 = require("../pricing-zone/pricing-zone.module");
const realtime_module_1 = require("../realtime/realtime.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                driver_profile_entity_1.DriverProfile,
                rider_profile_entity_1.RiderProfile,
                admin_profile_entity_1.AdminProfile,
                role_entity_1.Role,
                fleet_partner_profile_entity_1.FleetPartnerProfile,
                fleet_branch_entity_1.FleetBranch,
                approval_entity_1.Approval,
                trip_entity_1.Trip,
                fleet_dispatch_entity_1.FleetDispatch,
                earnings_ledger_entity_1.EarningsLedger,
                fleet_payout_entity_1.FleetPayout,
                wallet_account_entity_1.WalletAccount,
                safety_event_entity_1.SafetyEvent,
                risk_case_entity_1.RiskCase,
                pricing_config_entity_1.PricingConfig,
                promo_entity_1.Promo,
                service_config_entity_1.ServiceConfig,
                audit_log_entity_1.AuditLog,
                feature_flag_entity_1.FeatureFlag,
                pricing_zone_entity_1.PricingZone,
                rider_service_request_entity_1.RiderServiceRequest,
            ]),
            pricing_zone_module_1.PricingZoneModule,
            realtime_module_1.RealtimeModule,
        ],
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