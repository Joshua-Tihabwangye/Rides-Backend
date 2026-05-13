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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
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
const uuid_1 = require("uuid");
let AdminService = class AdminService {
    constructor(userRepo, driverProfileRepo, riderProfileRepo, adminProfileRepo, roleRepo, fleetProfileRepo, fleetBranchRepo, approvalRepo, tripRepo, fleetDispatchRepo, earningsLedgerRepo, fleetPayoutRepo, walletRepo, safetyRepo, riskRepo, pricingRepo, promoRepo, serviceConfigRepo, auditRepo, flagRepo) {
        this.userRepo = userRepo;
        this.driverProfileRepo = driverProfileRepo;
        this.riderProfileRepo = riderProfileRepo;
        this.adminProfileRepo = adminProfileRepo;
        this.roleRepo = roleRepo;
        this.fleetProfileRepo = fleetProfileRepo;
        this.fleetBranchRepo = fleetBranchRepo;
        this.approvalRepo = approvalRepo;
        this.tripRepo = tripRepo;
        this.fleetDispatchRepo = fleetDispatchRepo;
        this.earningsLedgerRepo = earningsLedgerRepo;
        this.fleetPayoutRepo = fleetPayoutRepo;
        this.walletRepo = walletRepo;
        this.safetyRepo = safetyRepo;
        this.riskRepo = riskRepo;
        this.pricingRepo = pricingRepo;
        this.promoRepo = promoRepo;
        this.serviceConfigRepo = serviceConfigRepo;
        this.auditRepo = auditRepo;
        this.flagRepo = flagRepo;
    }
    async getProfile(userId) {
        const profile = await this.adminProfileRepo.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Admin profile not found');
        }
        return profile;
    }
    async updateProfile(userId, patch) {
        const profile = await this.getProfile(userId);
        Object.assign(profile, patch);
        return this.adminProfileRepo.save(profile);
    }
    async listRiders() {
        const riders = await this.riderProfileRepo.find();
        const riderIds = riders.map(r => r.userId);
        const users = await this.userRepo.find({ where: { id: (0, typeorm_2.In)(riderIds) } });
        const userMap = new Map(users.map(u => [u.id, u]));
        return riders.map(profile => {
            const user = userMap.get(profile.userId);
            return {
                ...profile,
                userId: user?.id,
                status: user?.status ?? 'active',
                roles: user?.roles ?? ['rider']
            };
        });
    }
    async createRider(actorId, input, meta) {
        const userId = (0, uuid_1.v4)();
        const user = this.userRepo.create({
            id: userId,
            email: input.email,
            password: 'password123',
            phone: input.phone,
            roles: ['rider'],
            status: 'active',
        });
        await this.userRepo.save(user);
        const profile = this.riderProfileRepo.create({
            userId,
            fullName: input.fullName ?? input.email.split('@')[0],
            email: input.email,
            phone: input.phone ?? '',
            city: input.city ?? 'Kampala',
            country: input.country ?? 'Uganda',
        });
        await this.riderProfileRepo.save(profile);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'rider', userId, undefined, profile);
        return { ...profile, userId, roles: user.roles, status: user.status };
    }
    async patchRider(actorId, userId, patch, meta) {
        const profile = await this.riderProfileRepo.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Rider not found');
        }
        const before = { ...profile };
        Object.assign(profile, this.pickDefined(patch, ['fullName', 'email', 'phone', 'city', 'country']));
        await this.riderProfileRepo.save(profile);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (user) {
            user.email = patch.email ?? user.email;
            user.phone = patch.phone ?? user.phone;
            user.status = patch.status ?? user.status;
            await this.userRepo.save(user);
        }
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'rider', userId, before, profile);
        return { ...profile, userId: user?.id, roles: user?.roles ?? ['rider'], status: user?.status ?? 'active' };
    }
    async listDrivers() {
        const drivers = await this.driverProfileRepo.find();
        const userIds = drivers.map(d => d.userId);
        const users = await this.userRepo.find({ where: { id: (0, typeorm_2.In)(userIds) } });
        const userMap = new Map(users.map(u => [u.id, u]));
        return drivers.map(profile => {
            const user = userMap.get(profile.userId);
            return {
                ...profile,
                userId: user?.id,
                roles: user?.roles ?? ['driver'],
                status: user?.status ?? 'active',
            };
        });
    }
    async createDriver(actorId, input, meta) {
        const userId = (0, uuid_1.v4)();
        const user = this.userRepo.create({
            id: userId,
            email: input.email,
            password: 'password123',
            phone: input.phone,
            roles: ['driver'],
            status: 'active',
        });
        await this.userRepo.save(user);
        const profile = this.driverProfileRepo.create({
            userId,
            firstName: input.fullName?.split(' ')[0] ?? input.email.split('@')[0],
            lastName: input.fullName?.split(' ').slice(1).join(' ') ?? '',
            city: input.city ?? 'Kampala',
            country: input.country ?? 'Uganda',
            status: 'offline',
        });
        await this.driverProfileRepo.save(profile);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'driver', userId, undefined, profile);
        return { ...profile, userId, roles: user.roles, status: user.status };
    }
    async patchDriver(actorId, userId, patch, meta) {
        const profile = await this.driverProfileRepo.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const before = { ...profile };
        Object.assign(profile, this.pickDefined(patch, ['city', 'country', 'status']));
        await this.driverProfileRepo.save(profile);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (user) {
            user.email = patch.email ?? user.email;
            user.phone = patch.phone ?? user.phone;
            user.status = patch.status ?? user.status;
            await this.userRepo.save(user);
        }
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'driver', userId, before, profile);
        return { ...profile, userId: user?.id, roles: user?.roles ?? ['driver'], status: user?.status ?? 'active' };
    }
    async listUsers() {
        const users = await this.userRepo.find();
        return users.map(user => ({
            ...user,
            profileType: user.roles.includes('rider') ? 'rider' : user.roles.includes('driver') ? 'driver' : user.roles.some(r => r.startsWith('fleet')) ? 'fleet' : 'user'
        }));
    }
    async createUser(actorId, input, meta) {
        const user = this.userRepo.create({
            id: (0, uuid_1.v4)(),
            email: input.email,
            password: 'password123',
            phone: input.phone,
            roles: input.roles,
            status: 'active',
        });
        await this.userRepo.save(user);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'user', user.id, undefined, user);
        return user;
    }
    async patchUser(actorId, userId, patch, meta) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const before = { ...user };
        Object.assign(user, this.pickDefined(patch, ['email', 'phone', 'roles', 'status']));
        await this.userRepo.save(user);
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'user', userId, before, user);
        return user;
    }
    async listRoles() {
        return this.roleRepo.find();
    }
    async createRole(actorId, input, meta) {
        const role = this.roleRepo.create({
            ...input,
        });
        await this.roleRepo.save(role);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'role', role.id, undefined, role);
        return role;
    }
    async patchRole(actorId, roleId, patch, meta) {
        const role = await this.roleRepo.findOne({ where: { id: roleId } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const before = { ...role };
        Object.assign(role, this.pickDefined(patch, ['description', 'permissions']));
        await this.roleRepo.save(role);
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'role', roleId, before, role);
        return role;
    }
    async listCompanies() {
        const companies = await this.fleetProfileRepo.find();
        return companies;
    }
    async createCompany(actorId, input, meta) {
        const fleetId = (0, uuid_1.v4)();
        const company = this.fleetProfileRepo.create({
            fleetId,
            companyName: input.companyName,
            contactEmail: input.contactEmail,
            contactPhone: input.contactPhone,
            registrationNumber: input.registrationNumber,
            taxId: input.taxId,
            status: 'pending',
        });
        await this.fleetProfileRepo.save(company);
        const user = this.userRepo.create({
            id: fleetId,
            email: input.contactEmail,
            password: 'password123',
            phone: input.contactPhone,
            roles: ['fleet_owner'],
            status: 'active',
            fleetId,
        });
        await this.userRepo.save(user);
        const approval = this.approvalRepo.create({
            entityType: 'company',
            entityId: fleetId,
            status: 'pending',
            requestedBy: fleetId,
        });
        await this.approvalRepo.save(approval);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'company', fleetId, undefined, company);
        return { ...company, approvalId: approval.id };
    }
    async patchCompany(actorId, companyId, patch, meta) {
        const company = await this.fleetProfileRepo.findOne({ where: { fleetId: companyId } });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const before = { ...company };
        Object.assign(company, this.pickDefined(patch, ['companyName', 'contactEmail', 'contactPhone', 'registrationNumber', 'taxId', 'status']));
        await this.fleetProfileRepo.save(company);
        const user = await this.userRepo.findOne({ where: { fleetId: companyId } });
        if (user) {
            user.email = patch.contactEmail ?? user.email;
            user.phone = patch.contactPhone ?? user.phone;
            await this.userRepo.save(user);
        }
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'company', companyId, before, company);
        return company;
    }
    async listApprovals() {
        return this.approvalRepo.find({ order: { createdAt: 'DESC' } });
    }
    async reviewApproval(actorId, approvalId, input, meta) {
        const approval = await this.approvalRepo.findOne({ where: { id: approvalId } });
        if (!approval) {
            throw new common_1.NotFoundException('Approval not found');
        }
        const before = { ...approval };
        approval.status = input.decision;
        approval.notes = input.notes ?? approval.notes;
        approval.reviewedBy = actorId;
        approval.reviewedAt = Date.now();
        await this.approvalRepo.save(approval);
        if (approval.entityType === 'company') {
            const company = await this.fleetProfileRepo.findOne({ where: { fleetId: approval.entityId } });
            if (company) {
                company.status = input.decision === 'approved' ? 'approved' : 'suspended';
                await this.fleetProfileRepo.save(company);
            }
        }
        await this.recordAudit({ actorId, ...meta }, 'admin.review', 'approval', approvalId, before, approval);
        return approval;
    }
    async getOperationsAnalytics(period = 'week') {
        const threshold = this.periodThresholdDate(period);
        const [tripsCount, completedTripsCount, activeTripsCount] = await Promise.all([
            this.tripRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold) } }),
            this.tripRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold), status: 'completed' } }),
            this.tripRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold), status: (0, typeorm_2.In)(['driver_assigned', 'driver_arriving', 'arrived', 'in_progress']) } }),
        ]);
        const [dispatchesCount, pendingDispatchesCount] = await Promise.all([
            this.fleetDispatchRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold) } }),
            this.fleetDispatchRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold), status: 'pending' } }),
        ]);
        const [totalDrivers, onlineDrivers] = await Promise.all([
            this.driverProfileRepo.count(),
            this.driverProfileRepo.count({ where: { status: 'online' } }),
        ]);
        return {
            period,
            trips: {
                total: tripsCount,
                completed: completedTripsCount,
                active: activeTripsCount,
            },
            dispatches: {
                total: dispatchesCount,
                pending: pendingDispatchesCount,
            },
            drivers: {
                total: totalDrivers,
                online: onlineDrivers,
            },
        };
    }
    async getFinanceAnalytics(period = 'month') {
        const threshold = this.periodThresholdDate(period);
        const earnings = await this.earningsLedgerRepo.find({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold) } });
        const payouts = await this.fleetPayoutRepo.find({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(threshold) } });
        const wallets = await this.walletRepo.find();
        return {
            period,
            grossEarnings: earnings.reduce((sum, item) => sum + Number(item.amount), 0),
            earningsCount: earnings.length,
            payoutsPending: payouts.filter((item) => item.status !== 'paid').reduce((sum, item) => sum + Number(item.amount), 0),
            walletExposure: wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0),
            currency: 'UGX',
        };
    }
    async listSafetyIncidents() {
        return this.safetyRepo.find({ order: { createdAt: 'DESC' } });
    }
    async listRiskCases() {
        return this.riskRepo.find({ order: { createdAt: 'DESC' } });
    }
    async listPricing() {
        return this.pricingRepo.find();
    }
    async createPricing(actorId, input, meta) {
        const pricing = this.pricingRepo.create({ ...input, status: 'active' });
        await this.pricingRepo.save(pricing);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'pricing', pricing.id, undefined, pricing);
        return pricing;
    }
    async patchPricing(actorId, pricingId, patch, meta) {
        const pricing = await this.pricingRepo.findOne({ where: { id: pricingId } });
        if (!pricing) {
            throw new common_1.NotFoundException('Pricing config not found');
        }
        const before = { ...pricing };
        Object.assign(pricing, this.pickDefined(patch, ['name', 'service', 'status', 'pricingRules']));
        await this.pricingRepo.save(pricing);
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'pricing', pricingId, before, pricing);
        return pricing;
    }
    async listPromos() {
        return this.promoRepo.find();
    }
    async createPromo(actorId, input, meta) {
        const promo = this.promoRepo.create({ ...input, status: 'draft' });
        await this.promoRepo.save(promo);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'promo', promo.id, undefined, promo);
        return promo;
    }
    async patchPromo(actorId, promoId, patch, meta) {
        const promo = await this.promoRepo.findOne({ where: { id: promoId } });
        if (!promo) {
            throw new common_1.NotFoundException('Promo not found');
        }
        const before = { ...promo };
        Object.assign(promo, this.pickDefined(patch, ['description', 'discountType', 'discountValue', 'status']));
        await this.promoRepo.save(promo);
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'promo', promoId, before, promo);
        return promo;
    }
    async listServices() {
        return this.serviceConfigRepo.find();
    }
    async createServiceConfig(actorId, input, meta) {
        const serviceConfig = this.serviceConfigRepo.create({ ...input });
        await this.serviceConfigRepo.save(serviceConfig);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'service_config', serviceConfig.id, undefined, serviceConfig);
        return serviceConfig;
    }
    async patchServiceConfig(actorId, serviceId, patch, meta) {
        const serviceConfig = await this.serviceConfigRepo.findOne({ where: { id: serviceId } });
        if (!serviceConfig) {
            throw new common_1.NotFoundException('Service config not found');
        }
        const before = { ...serviceConfig };
        Object.assign(serviceConfig, this.pickDefined(patch, ['name', 'enabled', 'configuration']));
        await this.serviceConfigRepo.save(serviceConfig);
        await this.recordAudit({ actorId, ...meta }, 'admin.update', 'service_config', serviceId, before, serviceConfig);
        return serviceConfig;
    }
    async getAuditLog() {
        return this.auditRepo.find({ order: { createdAt: 'DESC' } });
    }
    async getFlags() {
        return this.flagRepo.find();
    }
    async patchFeatureFlag(actorId, flagKey, patch, meta) {
        const existing = await this.flagRepo.findOne({ where: { key: flagKey } });
        if (existing) {
            const before = { ...existing };
            Object.assign(existing, this.pickDefined(patch, ['enabled', 'description']));
            await this.flagRepo.save(existing);
            await this.recordAudit({ actorId, ...meta }, 'admin.update', 'feature_flag', existing.id, before, existing);
            return existing;
        }
        const scope = this.inferFeatureFlagScope(flagKey);
        const created = this.flagRepo.create({
            key: flagKey,
            enabled: patch.enabled ?? false,
            scope,
            description: patch.description,
        });
        await this.flagRepo.save(created);
        await this.recordAudit({ actorId, ...meta }, 'admin.create', 'feature_flag', created.id, undefined, created);
        return created;
    }
    async getHealth() {
        const [usersCount, tripsCount, companiesCount, pendingApprovalsCount] = await Promise.all([
            this.userRepo.count(),
            this.tripRepo.count(),
            this.fleetProfileRepo.count(),
            this.approvalRepo.count({ where: { status: 'pending' } }),
        ]);
        return {
            status: 'ok',
            service: 'evzone-driver-backend',
            timestamp: new Date().toISOString(),
            modules: {
                users: usersCount,
                trips: tripsCount,
                fleetCompanies: companiesCount,
                pendingApprovals: pendingApprovalsCount,
            },
        };
    }
    async getOverview() {
        const [usersCount, ridersCount, driversCount, companiesCount, tripsCount, pendingApprovalsCount, riskCasesCount, safetyIncidentsCount] = await Promise.all([
            this.userRepo.count(),
            this.riderProfileRepo.count(),
            this.driverProfileRepo.count(),
            this.fleetProfileRepo.count(),
            this.tripRepo.count(),
            this.approvalRepo.count({ where: { status: 'pending' } }),
            this.riskRepo.count({ where: { status: (0, typeorm_2.In)(['open', 'monitoring']) } }),
            this.safetyRepo.count(),
        ]);
        return {
            totals: {
                users: usersCount,
                riders: ridersCount,
                drivers: driversCount,
                companies: companiesCount,
                trips: tripsCount,
            },
            queues: {
                approvals: pendingApprovalsCount,
                riskCases: riskCasesCount,
                safetyIncidents: safetyIncidentsCount,
            },
        };
    }
    async recordAudit(meta, action, resource, resourceId, before, after) {
        const audit = this.auditRepo.create({
            actorId: meta.actorId,
            actorType: 'admin',
            action,
            resource,
            resourceId,
            before: before,
            after: after,
            ipAddress: meta.ipAddress,
            userAgent: Array.isArray(meta.userAgent) ? meta.userAgent.join(', ') : meta.userAgent,
        });
        await this.auditRepo.save(audit);
    }
    periodThresholdDate(period) {
        const now = new Date();
        if (period === 'day')
            now.setDate(now.getDate() - 1);
        else if (period === 'week')
            now.setDate(now.getDate() - 7);
        else if (period === 'month')
            now.setMonth(now.getMonth() - 1);
        else if (period === 'quarter')
            now.setMonth(now.getMonth() - 3);
        else if (period === 'year')
            now.setFullYear(now.getFullYear() - 1);
        return now;
    }
    pickDefined(input, keys) {
        const output = {};
        for (const key of keys) {
            if (input[key] !== undefined) {
                output[key] = input[key];
            }
        }
        return output;
    }
    inferFeatureFlagScope(flagKey) {
        if (flagKey.startsWith('rider_'))
            return 'rider';
        if (flagKey.startsWith('driver_'))
            return 'driver';
        if (flagKey.startsWith('fleet_'))
            return 'fleet';
        if (flagKey.startsWith('admin_'))
            return 'admin';
        return 'global';
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(rider_profile_entity_1.RiderProfile)),
    __param(3, (0, typeorm_1.InjectRepository)(admin_profile_entity_1.AdminProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(5, (0, typeorm_1.InjectRepository)(fleet_partner_profile_entity_1.FleetPartnerProfile)),
    __param(6, (0, typeorm_1.InjectRepository)(fleet_branch_entity_1.FleetBranch)),
    __param(7, (0, typeorm_1.InjectRepository)(approval_entity_1.Approval)),
    __param(8, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(9, (0, typeorm_1.InjectRepository)(fleet_dispatch_entity_1.FleetDispatch)),
    __param(10, (0, typeorm_1.InjectRepository)(earnings_ledger_entity_1.EarningsLedger)),
    __param(11, (0, typeorm_1.InjectRepository)(fleet_payout_entity_1.FleetPayout)),
    __param(12, (0, typeorm_1.InjectRepository)(wallet_account_entity_1.WalletAccount)),
    __param(13, (0, typeorm_1.InjectRepository)(safety_event_entity_1.SafetyEvent)),
    __param(14, (0, typeorm_1.InjectRepository)(risk_case_entity_1.RiskCase)),
    __param(15, (0, typeorm_1.InjectRepository)(pricing_config_entity_1.PricingConfig)),
    __param(16, (0, typeorm_1.InjectRepository)(promo_entity_1.Promo)),
    __param(17, (0, typeorm_1.InjectRepository)(service_config_entity_1.ServiceConfig)),
    __param(18, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __param(19, (0, typeorm_1.InjectRepository)(feature_flag_entity_1.FeatureFlag)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map