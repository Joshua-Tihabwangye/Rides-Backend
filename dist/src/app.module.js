"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const throttler_1 = require("@nestjs/throttler");
const admin_module_1 = require("./admin/admin.module");
const database_module_1 = require("./database/database.module");
const redis_module_1 = require("./redis/redis.module");
const common_module_1 = require("./common/common.module");
const auth_module_1 = require("./auth/auth.module");
const storage_module_1 = require("./storage/storage.module");
const driver_profile_module_1 = require("./driver-profile/driver-profile.module");
const onboarding_module_1 = require("./onboarding/onboarding.module");
const presence_location_module_1 = require("./presence-location/presence-location.module");
const documents_module_1 = require("./documents/documents.module");
const fleet_module_1 = require("./fleet/fleet.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const jobs_dispatch_module_1 = require("./jobs-dispatch/jobs-dispatch.module");
const rider_module_1 = require("./rider/rider.module");
const trips_module_1 = require("./trips/trips.module");
const delivery_module_1 = require("./delivery/delivery.module");
const safety_module_1 = require("./safety/safety.module");
const earnings_cashout_module_1 = require("./earnings-cashout/earnings-cashout.module");
const notifications_module_1 = require("./notifications/notifications.module");
const realtime_module_1 = require("./realtime/realtime.module");
const users_module_1 = require("./users/users.module");
const workspace_module_1 = require("./workspace/workspace.module");
const compatibility_module_1 = require("./compatibility/compatibility.module");
const compat_module_1 = require("./compat/compat.module");
const app_controller_1 = require("./app.controller");
const jwt_strategy_1 = require("./auth/jwt.strategy");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            database_module_1.DatabaseModule,
            redis_module_1.RedisModule,
            common_module_1.CommonModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            driver_profile_module_1.DriverProfileModule,
            rider_module_1.RiderModule,
            fleet_module_1.FleetModule,
            admin_module_1.AdminModule,
            onboarding_module_1.OnboardingModule,
            presence_location_module_1.PresenceLocationModule,
            documents_module_1.DocumentsModule,
            vehicles_module_1.VehiclesModule,
            jobs_dispatch_module_1.JobsDispatchModule,
            trips_module_1.TripsModule,
            delivery_module_1.DeliveryModule,
            safety_module_1.SafetyModule,
            earnings_cashout_module_1.EarningsCashoutModule,
            notifications_module_1.NotificationsModule,
            realtime_module_1.RealtimeModule,
            workspace_module_1.WorkspaceModule,
            compatibility_module_1.CompatibilityContractModule,
            compat_module_1.CompatibilityModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [jwt_strategy_1.JwtStrategy],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map