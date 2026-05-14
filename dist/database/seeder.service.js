"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SeederService = SeederService_1 = class SeederService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SeederService_1.name);
    }
    async onModuleInit() {
        await this.seedRoles();
    }
    async seedRoles() {
        const defaultRoles = [
            { name: 'rider', description: 'App user who requests rides/deliveries', permissions: [] },
            { name: 'driver', description: 'Driver who accepts and completes trips', permissions: [] },
            { name: 'fleet_owner', description: 'Fleet company owner', permissions: ['fleet.manage'] },
            { name: 'fleet_manager', description: 'Fleet manager', permissions: ['fleet.manage'] },
            { name: 'fleet_dispatcher', description: 'Fleet dispatcher', permissions: ['fleet.dispatch'] },
            { name: 'fleet_finance', description: 'Fleet finance officer', permissions: ['fleet.earnings'] },
            { name: 'admin', description: 'Platform administrator', permissions: ['admin.read', 'admin.write'] },
            { name: 'super_admin', description: 'Super administrator', permissions: ['admin.*'] },
        ];
        for (const roleData of defaultRoles) {
            const exists = await this.prisma.role.findUnique({ where: { name: roleData.name } });
            if (!exists) {
                await this.prisma.role.create({ data: roleData });
                this.logger.log(`Seeded role: ${roleData.name}`);
            }
        }
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = SeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeederService);
//# sourceMappingURL=seeder.service.js.map