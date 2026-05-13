import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { User } from '../entities/user.entity';
import { DriverProfile } from '../entities/driver-profile.entity';
import { RiderProfile } from '../entities/rider-profile.entity';
import { AdminProfile } from '../entities/admin-profile.entity';
import { Role } from '../entities/role.entity';
import { FleetPartnerProfile } from '../entities/fleet-partner-profile.entity';
import { FleetBranch } from '../entities/fleet-branch.entity';
import { Approval } from '../entities/approval.entity';
import { Trip } from '../entities/trip.entity';
import { FleetDispatch } from '../entities/fleet-dispatch.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { FleetPayout } from '../entities/fleet-payout.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { SafetyEvent } from '../entities/safety-event.entity';
import { RiskCase } from '../entities/risk-case.entity';
import { PricingConfig } from '../entities/pricing-config.entity';
import { Promo } from '../entities/promo.entity';
import { ServiceConfig } from '../entities/service-config.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { FeatureFlag } from '../entities/feature-flag.entity';
import { PricingZone } from '../entities/pricing-zone.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';
import { AdminRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { v4 as uuidv4 } from 'uuid';
import { Polygon } from 'geojson';

type AuditMeta = {
  actorId: string;
  ipAddress?: string;
  userAgent?: string | string[];
};

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(DriverProfile) private driverProfileRepo: Repository<DriverProfile>,
    @InjectRepository(RiderProfile) private riderProfileRepo: Repository<RiderProfile>,
    @InjectRepository(AdminProfile) private adminProfileRepo: Repository<AdminProfile>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(FleetPartnerProfile) private fleetProfileRepo: Repository<FleetPartnerProfile>,
    @InjectRepository(FleetBranch) private fleetBranchRepo: Repository<FleetBranch>,
    @InjectRepository(Approval) private approvalRepo: Repository<Approval>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(FleetDispatch) private fleetDispatchRepo: Repository<FleetDispatch>,
    @InjectRepository(EarningsLedger) private earningsLedgerRepo: Repository<EarningsLedger>,
    @InjectRepository(FleetPayout) private fleetPayoutRepo: Repository<FleetPayout>,
    @InjectRepository(WalletAccount) private walletRepo: Repository<WalletAccount>,
    @InjectRepository(SafetyEvent) private safetyRepo: Repository<SafetyEvent>,
    @InjectRepository(RiskCase) private riskRepo: Repository<RiskCase>,
    @InjectRepository(PricingConfig) private pricingRepo: Repository<PricingConfig>,
    @InjectRepository(Promo) private promoRepo: Repository<Promo>,
    @InjectRepository(ServiceConfig) private serviceConfigRepo: Repository<ServiceConfig>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
    @InjectRepository(FeatureFlag) private flagRepo: Repository<FeatureFlag>,
    @InjectRepository(PricingZone) private pricingZoneRepo: Repository<PricingZone>,
    @InjectRepository(RiderServiceRequest) private riderServiceRequestRepo: Repository<RiderServiceRequest>,
    private readonly adminRealtimeGateway: AdminRealtimeGateway,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.adminProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Admin profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    patch: Partial<{ firstName: string; lastName: string; department: string; permissions: string[] }>,
  ) {
    const profile = await this.getProfile(userId);
    Object.assign(profile, patch);
    return this.adminProfileRepo.save(profile);
  }

  async listRiders() {
    const riders = await this.riderProfileRepo.find();
    const riderIds = riders.map(r => r.userId);
    const users = await this.userRepo.find({ where: { id: In(riderIds) } });
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

  async getRider(riderId: string) {
    // riderId is the User.id (userId)
    const profile = await this.riderProfileRepo.findOne({ where: { userId: riderId } });
    if (!profile) {
      throw new NotFoundException('Rider not found');
    }
    const user = await this.userRepo.findOne({ where: { id: riderId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...profile,
      userId: user.id,
      status: user.status ?? 'active',
      roles: user.roles ?? ['rider']
    };
  }

  async createRider(
    actorId: string,
    input: { email: string; phone?: string; fullName?: string; city?: string; country?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const userId = uuidv4();
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

  async patchRider(
    actorId: string,
    userId: string,
    patch: Partial<{ fullName: string; email: string; phone: string; city: string; country: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const profile = await this.riderProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Rider not found');
    }
    const before = { ...profile };
    Object.assign(profile, this.pickDefined(patch, ['fullName', 'email', 'phone', 'city', 'country']));
    await this.riderProfileRepo.save(profile);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.email = patch.email ?? user.email;
      user.phone = patch.phone ?? user.phone;
      user.status = (patch.status as any) ?? user.status;
      await this.userRepo.save(user);
    }
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'rider', userId, before, profile);
    return { ...profile, userId: user?.id, roles: user?.roles ?? ['rider'], status: user?.status ?? 'active' };
  }

  async listDrivers() {
    const drivers = await this.driverProfileRepo.find();
    const userIds = drivers.map(d => d.userId);
    const users = await this.userRepo.find({ where: { id: In(userIds) } });
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

  async getDriver(driverId: string) {
    // driverId is the User.id (userId)
    const profile = await this.driverProfileRepo.findOne({ where: { userId: driverId } });
    if (!profile) {
      throw new NotFoundException('Driver not found');
    }
    const user = await this.userRepo.findOne({ where: { id: driverId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...profile,
      userId: user.id,
      roles: user.roles ?? ['driver'],
      status: user.status ?? 'active',
    };
  }

  async createDriver(
    actorId: string,
    input: { email: string; phone?: string; fullName?: string; city?: string; country?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const userId = uuidv4();
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

  async patchDriver(
    actorId: string,
    userId: string,
    patch: Partial<{ fullName: string; email: string; phone: string; city: string; country: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const profile = await this.driverProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Driver not found');
    }
    const before = { ...profile };
    // Map fullName to firstName/lastName if needed, or just skip if the entity uses firstName/lastName
    Object.assign(profile, this.pickDefined(patch, ['city', 'country', 'status']));
    await this.driverProfileRepo.save(profile);

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      user.email = patch.email ?? user.email;
      user.phone = patch.phone ?? user.phone;
      user.status = (patch.status as any) ?? user.status;
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

  async createUser(actorId: string, input: { email: string; phone?: string; roles: string[] }, meta?: Omit<AuditMeta, 'actorId'>) {
    const user = this.userRepo.create({
      id: uuidv4(),
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

  async patchUser(actorId: string, userId: string, patch: Partial<{ email: string; phone: string; roles: string[]; status: string }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
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

  async createRole(actorId: string, input: { name: string; description?: string; permissions: string[] }, meta?: Omit<AuditMeta, 'actorId'>) {
    const role = this.roleRepo.create({
      ...input,
    });
    await this.roleRepo.save(role);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'role', role.id, undefined, role);
    return role;
  }

  async patchRole(actorId: string, roleId: string, patch: Partial<{ description?: string; permissions: string[] }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const before = { ...role };
    Object.assign(role, this.pickDefined(patch, ['description', 'permissions']));
    await this.roleRepo.save(role);
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'role', roleId, before, role);
    return role;
  }

  async listCompanies() {
    const companies = await this.fleetProfileRepo.find();
    // In a real app we'd join branches, but let's keep it simple
    return companies;
  }

  async getCompany(companyId: string) {
    const company = await this.fleetProfileRepo.findOne({ where: { fleetId: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async createCompany(
    actorId: string,
    input: { companyName: string; contactEmail: string; contactPhone: string; registrationNumber?: string; taxId?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const fleetId = uuidv4();
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

  async patchCompany(
    actorId: string,
    companyId: string,
    patch: Partial<{ companyName: string; contactEmail: string; contactPhone: string; registrationNumber?: string; taxId?: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const company = await this.fleetProfileRepo.findOne({ where: { fleetId: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
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

  async getApproval(approvalId: string) {
    const approval = await this.approvalRepo.findOne({ where: { id: approvalId } });
    if (!approval) {
      throw new NotFoundException('Approval not found');
    }
    return approval;
  }

  async reviewApproval(
    actorId: string,
    approvalId: string,
    input: { decision: 'approved' | 'rejected'; notes?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const approval = await this.approvalRepo.findOne({ where: { id: approvalId } });
    if (!approval) {
      throw new NotFoundException('Approval not found');
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
    this.adminRealtimeGateway.publishToAll('approval.reviewed', {
      approvalId: approval.id,
      status: approval.status,
      reviewedBy: actorId,
      reviewedAt: approval.reviewedAt,
    });
    return approval;
  }

  async getOperationsAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const threshold = this.periodThresholdDate(period);
    
    const [tripsCount, completedTripsCount, activeTripsCount] = await Promise.all([
      this.tripRepo.count({ where: { createdAt: MoreThanOrEqual(threshold) } }),
      this.tripRepo.count({ where: { createdAt: MoreThanOrEqual(threshold), status: 'completed' } }),
      this.tripRepo.count({ where: { createdAt: MoreThanOrEqual(threshold), status: In(['driver_assigned', 'driver_arriving', 'arrived', 'in_progress']) } }),
    ]);

    const [dispatchesCount, pendingDispatchesCount] = await Promise.all([
      this.fleetDispatchRepo.count({ where: { createdAt: MoreThanOrEqual(threshold) } }),
      this.fleetDispatchRepo.count({ where: { createdAt: MoreThanOrEqual(threshold), status: 'pending' } }),
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

  async getFinanceAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
    const threshold = this.periodThresholdDate(period);
    
    const earnings = await this.earningsLedgerRepo.find({ where: { createdAt: MoreThanOrEqual(threshold) } });
    const payouts = await this.fleetPayoutRepo.find({ where: { createdAt: MoreThanOrEqual(threshold) } });
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

  async listRiderServiceRequests(
    query: Partial<{
      serviceType: 'rental' | 'tour' | 'ambulance';
      status: string;
      riderId: string;
    }> = {},
  ) {
    const where: any = {};
    if (query.serviceType) where.serviceType = query.serviceType;
    if (query.status) where.status = query.status;
    if (query.riderId) where.riderId = query.riderId;

    const records = await this.riderServiceRequestRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return records.map((record) => ({
      id: record.id,
      riderId: record.riderId,
      driverId: record.driverId,
      serviceType: record.serviceType,
      status: record.status,
      payload: record.payload,
      createdAt: new Date(record.createdAt).getTime(),
      updatedAt: new Date(record.updatedAt).getTime(),
    }));
  }

  async getRiderServiceRequest(requestId: string) {
    const record = await this.riderServiceRequestRepo.findOne({ where: { id: requestId } });
    if (!record) {
      throw new NotFoundException('Rider service request not found');
    }
    return {
      id: record.id,
      riderId: record.riderId,
      driverId: record.driverId,
      serviceType: record.serviceType,
      status: record.status,
      payload: record.payload,
      createdAt: new Date(record.createdAt).getTime(),
      updatedAt: new Date(record.updatedAt).getTime(),
    };
  }

  async getRiskCase(riskCaseId: string) {
    const riskCase = await this.riskRepo.findOne({ where: { id: riskCaseId } });
    if (!riskCase) {
      throw new NotFoundException('Risk case not found');
    }
    return riskCase;
  }

  async listPricing() {
    return this.pricingRepo.find();
  }

  async getPricing(pricingId: string) {
    const pricing = await this.pricingRepo.findOne({ where: { id: pricingId } });
    if (!pricing) {
      throw new NotFoundException('Pricing config not found');
    }
    return pricing;
  }

  async createPricing(actorId: string, input: { name: string; service: string; pricingRules: Record<string, unknown> }, meta?: Omit<AuditMeta, 'actorId'>) {
    const pricing = this.pricingRepo.create({ ...input, status: 'active' });
    await this.pricingRepo.save(pricing);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'pricing', pricing.id, undefined, pricing);
    return pricing;
  }

  async patchPricing(actorId: string, pricingId: string, patch: Partial<{ name: string; service: string; status: string; pricingRules: Record<string, unknown> }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const pricing = await this.pricingRepo.findOne({ where: { id: pricingId } });
    if (!pricing) {
      throw new NotFoundException('Pricing config not found');
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

  async getPromo(promoId: string) {
    const promo = await this.promoRepo.findOne({ where: { id: promoId } });
    if (!promo) {
      throw new NotFoundException('Promo not found');
    }
    return promo;
  }

  async createPromo(actorId: string, input: { code: string; description: string; discountType: string; discountValue: number }, meta?: Omit<AuditMeta, 'actorId'>) {
    const promo = this.promoRepo.create({ ...input, status: 'draft' });
    await this.promoRepo.save(promo);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'promo', promo.id, undefined, promo);
    return promo;
  }

  async patchPromo(actorId: string, promoId: string, patch: Partial<{ description: string; discountType: string; discountValue: number; status: string }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const promo = await this.promoRepo.findOne({ where: { id: promoId } });
    if (!promo) {
      throw new NotFoundException('Promo not found');
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

  async getService(serviceId: string) {
    const service = await this.serviceConfigRepo.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service config not found');
    }
    return service;
  }

  async createServiceConfig(actorId: string, input: { key: string; name: string; enabled?: boolean; configuration: Record<string, unknown> }, meta?: Omit<AuditMeta, 'actorId'>) {
    const serviceConfig = this.serviceConfigRepo.create({ ...input });
    await this.serviceConfigRepo.save(serviceConfig);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'service_config', serviceConfig.id, undefined, serviceConfig);
    return serviceConfig;
  }

  async patchServiceConfig(actorId: string, serviceId: string, patch: Partial<{ name: string; enabled: boolean; configuration: Record<string, unknown> }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const serviceConfig = await this.serviceConfigRepo.findOne({ where: { id: serviceId } });
    if (!serviceConfig) {
      throw new NotFoundException('Service config not found');
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

  async patchFeatureFlag(
    actorId: string,
    flagKey: string,
    patch: Partial<{ enabled: boolean; description: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing = await this.flagRepo.findOne({ where: { key: flagKey } });
    if (existing) {
      const before = { ...existing };
      Object.assign(existing, this.pickDefined(patch, ['enabled', 'description']));
      await this.flagRepo.save(existing);
      await this.recordAudit({ actorId, ...meta }, 'admin.update', 'feature_flag', existing.id, before, existing);
      this.adminRealtimeGateway.publishToAll('flag.changed', {
        flagKey: existing.key,
        enabled: existing.enabled,
        scope: existing.scope,
        timestamp: Date.now(),
      });
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
    this.adminRealtimeGateway.publishToAll('flag.created', {
      flagKey: created.key,
      enabled: created.enabled,
      scope: created.scope,
      timestamp: Date.now(),
    });
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
      this.riskRepo.count({ where: { status: In(['open', 'monitoring']) } }),
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

  // Pricing Zone management
  async listPricingZones() {
    return this.pricingZoneRepo.find({ order: { name: 'ASC' } });
  }

  async createPricingZone(
    actorId: string,
    input: { name: string; description?: string; boundaries: Polygon; pricingRules: Record<string, unknown>; status?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const zone = this.pricingZoneRepo.create({
      ...input,
      status: input.status ?? 'active',
    });
    await this.pricingZoneRepo.save(zone);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'pricing_zone', zone.id, undefined, zone);
    return zone;
  }

  async patchPricingZone(
    actorId: string,
    zoneId: string,
    patch: Partial<{ name: string; description: string; boundaries: Polygon; pricingRules: Record<string, unknown>; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const zone = await this.pricingZoneRepo.findOne({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    const before = { ...zone };
    Object.assign(zone, this.pickDefined(patch, ['name', 'description', 'boundaries', 'pricingRules', 'status']));
    await this.pricingZoneRepo.save(zone);
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'pricing_zone', zoneId, before, zone);
    return zone;
  }

  async findPricingZoneByLocation(lat: number, lng: number) {
    // Use raw SQL with ST_Contains for geographic point-in-polygon
    const result = await this.pricingZoneRepo
      .createQueryBuilder('zone')
      .where('ST_Contains(zone.boundaries::geometry, ST_SetSRID(ST_Point(:lng, :lat), 4326))', { lat, lng })
      .andWhere('zone.status = :status', { status: 'active' })
      .orderBy('zone.createdAt', 'DESC')
      .getOne();

    return result ?? null;
  }

  private async recordAudit(meta: AuditMeta, action: string, resource: string, resourceId?: string, before?: object, after?: object) {
    const audit = this.auditRepo.create({
      actorId: meta.actorId,
      actorType: 'admin',
      action,
      resource,
      resourceId,
      before: before as any,
      after: after as any,
      ipAddress: meta.ipAddress,
      userAgent: Array.isArray(meta.userAgent) ? meta.userAgent.join(', ') : meta.userAgent,
    });
    await this.auditRepo.save(audit);
    const payload = {
      id: audit.id,
      actorId: audit.actorId,
      action: audit.action,
      resource: audit.resource,
      resourceId: audit.resourceId,
      createdAt: audit.createdAt,
    };
    this.adminRealtimeGateway.publishToAll('audit.log.entry', payload);
    this.adminRealtimeGateway.publishToAll('admin.audit.updated', payload);
  }

  private periodThresholdDate(period: 'day' | 'week' | 'month' | 'quarter' | 'year') {
    const now = new Date();
    if (period === 'day') now.setDate(now.getDate() - 1);
    else if (period === 'week') now.setDate(now.getDate() - 7);
    else if (period === 'month') now.setMonth(now.getMonth() - 1);
    else if (period === 'quarter') now.setMonth(now.getMonth() - 3);
    else if (period === 'year') now.setFullYear(now.getFullYear() - 1);
    return now;
  }

  private pickDefined<T extends Record<string, unknown>, K extends keyof T>(input: Partial<T>, keys: K[]) {
    const output: Partial<T> = {};
    for (const key of keys) {
      if (input[key] !== undefined) {
        output[key] = input[key];
      }
    }
    return output;
  }

  private inferFeatureFlagScope(flagKey: string): 'global' | 'rider' | 'driver' | 'fleet' | 'admin' {
    if (flagKey.startsWith('rider_')) return 'rider';
    if (flagKey.startsWith('driver_')) return 'driver';
    if (flagKey.startsWith('fleet_')) return 'fleet';
    if (flagKey.startsWith('admin_')) return 'admin';
    return 'global';
  }
}
