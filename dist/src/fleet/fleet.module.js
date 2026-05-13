"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fleet_controller_1 = require("./fleet.controller");
const fleet_drivers_controller_1 = require("./fleet-drivers.controller");
const fleet_operations_controller_1 = require("./fleet-operations.controller");
const fleet_service_1 = require("./fleet.service");
const vehicles_module_1 = require("../vehicles/vehicles.module");
const fleet_partner_profile_entity_1 = require("../entities/fleet-partner-profile.entity");
const fleet_branch_entity_1 = require("../entities/fleet-branch.entity");
const fleet_driver_entity_1 = require("../entities/fleet-driver.entity");
const fleet_dispatch_entity_1 = require("../entities/fleet-dispatch.entity");
const fleet_service_record_entity_1 = require("../entities/fleet-service-record.entity");
const fleet_payout_entity_1 = require("../entities/fleet-payout.entity");
const fleet_compliance_incident_entity_1 = require("../entities/fleet-compliance-incident.entity");
const fleet_training_course_entity_1 = require("../entities/fleet-training-course.entity");
const user_entity_1 = require("../entities/user.entity");
const driver_profile_entity_1 = require("../entities/driver-profile.entity");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
let FleetModule = class FleetModule {
};
exports.FleetModule = FleetModule;
exports.FleetModule = FleetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                fleet_partner_profile_entity_1.FleetPartnerProfile,
                fleet_branch_entity_1.FleetBranch,
                fleet_driver_entity_1.FleetDriver,
                fleet_dispatch_entity_1.FleetDispatch,
                fleet_service_record_entity_1.FleetServiceRecord,
                fleet_payout_entity_1.FleetPayout,
                fleet_compliance_incident_entity_1.FleetComplianceIncident,
                fleet_training_course_entity_1.FleetTrainingCourse,
                user_entity_1.User,
                driver_profile_entity_1.DriverProfile,
                trip_entity_1.Trip,
                job_offer_entity_1.JobOffer,
                earnings_ledger_entity_1.EarningsLedger,
                vehicle_entity_1.Vehicle
            ]),
            vehicles_module_1.VehiclesModule
        ],
        controllers: [fleet_controller_1.FleetController, fleet_drivers_controller_1.FleetDriversController, fleet_operations_controller_1.FleetOperationsController],
        providers: [fleet_service_1.FleetService],
        exports: [fleet_service_1.FleetService],
    })
], FleetModule);
//# sourceMappingURL=fleet.module.js.map