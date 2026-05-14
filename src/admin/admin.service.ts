import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { v4 as uuidv4 } from 'uuid';

export type AuditMeta = {
  actorId: string;
  ipAddress?: string;
  userAgent?: string | string[];
};

@Injectable()
export class AdminService {
  private readonly agentStore = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      role: string;
      status: 'active' | 'inactive';
      region?: string;
      metadata?: Record<string, unknown>;
      createdAt: number;
      updatedAt: number;
    }
  >();

  private readonly taxConfigStore = new Map<
    string,
    {
      regionId: string;
      currency: string;
      vatPercent: number;
      serviceTaxPercent: number;
      surchargePercent: number;
      notes?: string;
      updatedAt: number;
    }
  >([
    [
      'UG',
      {
        regionId: 'UG',
        currency: 'UGX',
        vatPercent: 18,
        serviceTaxPercent: 0,
        surchargePercent: 0,
        updatedAt: Date.now(),
      },
    ],
  ]);

  private readonly invoiceTemplateStore = new Map<
    string,
    {
      id: string;
      regionId: string;
      templateName: string;
      prefix: string;
      nextNumber: number;
      footer?: string;
      updatedAt: number;
    }
  >([
    [
      'default-ug',
      {
        id: 'default-ug',
        regionId: 'UG',
        templateName: 'Standard Uganda Invoice',
        prefix: 'EVZ-UG',
        nextNumber: 1001,
        footer: 'Thank you for riding with EVzone.',
        updatedAt: Date.now(),
      },
    ],
  ]);

  private readonly trainingModuleStore = new Map<
    string,
    {
      id: string;
      title: string;
      category: string;
      status: 'draft' | 'published' | 'archived';
      version: number;
      content?: string;
      updatedAt: number;
      createdAt: number;
    }
  >();

  private readonly policyStore = new Map<
    string,
    {
      id: string;
      key: string;
      title: string;
      scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin';
      status: 'draft' | 'active' | 'archived';
      content: string;
      version: number;
      updatedAt: number;
      createdAt: number;
    }
  >();

  private readonly verticalPolicyStore = new Map<
    string,
    {
      verticalId: string;
      name: string;
      status: 'active' | 'inactive';
      rules: Record<string, unknown>;
      updatedAt: number;
    }
  >([
    [
      'ride',
      {
        verticalId: 'ride',
        name: 'Ride Hailing',
        status: 'active',
        rules: {
          cancellationWindowMinutes: 5,
          driverWaitMinutes: 7,
        },
        updatedAt: Date.now(),
      },
    ],
  ]);

  constructor(
    private readonly prisma: PrismaService,
    private readonly adminRealtimeGateway: AdminRealtimeGateway,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.adminProfile.findFirst({ where: { userId } });
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
    return this.prisma.adminProfile.update({ where: { id: profile.id }, data: patch });
  }

  async listRiders() {
    const riders = await this.prisma.riderProfile.findMany();
    const riderIds = riders.map((r) => r.userId);
    const users = await this.prisma.user.findMany({ where: { id: { in: riderIds } } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return riders.map((profile) => {
      const user = userMap.get(profile.userId);
      return {
        ...profile,
        userId: user?.id,
        status: user?.status ?? 'active',
        roles: user?.roles ?? ['rider'],
      };
    });
  }

  async getRider(riderId: string) {
    const profile = await this.prisma.riderProfile.findFirst({ where: { userId: riderId } });
    if (!profile) {
      throw new NotFoundException('Rider not found');
    }
    const user = await this.prisma.user.findFirst({ where: { id: riderId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...profile,
      userId: user.id,
      status: user.status ?? 'active',
      roles: user.roles ?? ['rider'],
    };
  }

  async createRider(
    actorId: string,
    input: { email: string; phone?: string; fullName?: string; city?: string; country?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const userId = uuidv4();
    await this.prisma.user.create({
      data: {
        id: userId,
        email: input.email,
        password: 'password123',
        phone: input.phone,
        roles: ['rider'],
        status: 'active',
      },
    });

    const profile = await this.prisma.riderProfile.create({
      data: {
        userId,
        fullName: input.fullName ?? input.email.split('@')[0],
        email: input.email,
        phone: input.phone ?? '',
        city: input.city ?? 'Kampala',
        country: input.country ?? 'Uganda',
      },
    });

    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'rider', userId, undefined, profile!);
    return { ...profile, userId, roles: ['rider'], status: 'active' };
  }

  async patchRider(
    actorId: string,
    userId: string,
    patch: Partial<{ fullName: string; email: string; phone: string; city: string; country: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const profile = await this.prisma.riderProfile.findFirst({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Rider not found');
    }
    const before = { ...profile };
    await this.prisma.riderProfile.update({
      where: { id: profile.id },
      data: this.pickDefined(patch, ['fullName', 'email', 'phone', 'city', 'country']) as any,
    });

    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: patch.email ?? user.email,
          phone: patch.phone ?? user.phone,
          status: (patch.status as any) ?? user.status,
        },
      });
    }
    const updatedProfile = await this.prisma.riderProfile.findFirst({ where: { userId } });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'rider', userId, before, updatedProfile!);
    return { ...updatedProfile!, userId: user?.id, roles: user?.roles ?? ['rider'], status: user?.status ?? 'active' };
  }

  async listDrivers() {
    const drivers = await this.prisma.driverProfile.findMany();
    const userIds = drivers.map((d) => d.userId);
    const users = await this.prisma.user.findMany({ where: { id: { in: userIds } } });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return drivers.map((profile) => {
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
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId: driverId } });
    if (!profile) {
      throw new NotFoundException('Driver not found');
    }
    const user = await this.prisma.user.findFirst({ where: { id: driverId } });
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
    await this.prisma.user.create({
      data: {
        id: userId,
        email: input.email,
        password: 'password123',
        phone: input.phone,
        roles: ['driver'],
        status: 'active',
      },
    });

    const profile = await this.prisma.driverProfile.create({
      data: {
        userId,
        firstName: input.fullName?.split(' ')[0] ?? input.email.split('@')[0],
        lastName: input.fullName?.split(' ').slice(1).join(' ') ?? '',
        city: input.city ?? 'Kampala',
        country: input.country ?? 'Uganda',
        status: 'offline',
      },
    });

    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'driver', userId, undefined, profile);
    return { ...profile, userId, roles: ['driver'], status: 'active' };
  }

  async patchDriver(
    actorId: string,
    userId: string,
    patch: Partial<{ fullName: string; email: string; phone: string; city: string; country: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const profile = await this.prisma.driverProfile.findFirst({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Driver not found');
    }
    const before = { ...profile };
    await this.prisma.driverProfile.update({
      where: { id: profile.id },
      data: this.pickDefined(patch, ['city', 'country', 'status']) as any,
    });

    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: patch.email ?? user.email,
          phone: patch.phone ?? user.phone,
          status: (patch.status as any) ?? user.status,
        },
      });
    }
    const updatedProfile = await this.prisma.driverProfile.findFirst({ where: { userId } });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'driver', userId, before, updatedProfile!);
    return { ...updatedProfile!, userId: user?.id, roles: user?.roles ?? ['driver'], status: user?.status ?? 'active' };
  }

  async listUsers() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => ({
      ...user,
      profileType: user.roles.includes('rider')
        ? 'rider'
        : user.roles.includes('driver')
          ? 'driver'
          : user.roles.some((r) => r.startsWith('fleet'))
            ? 'fleet'
            : 'user',
    }));
  }

  async createUser(actorId: string, input: { email: string; phone?: string; roles: string[] }, meta?: Omit<AuditMeta, 'actorId'>) {
    const user = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email: input.email,
        password: 'password123',
        phone: input.phone,
        roles: input.roles,
        status: 'active',
      },
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'user', user.id, undefined, user);
    return user;
  }

  async patchUser(actorId: string, userId: string, patch: Partial<{ email: string; phone: string; roles: string[]; status: string }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const before = { ...user };
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: this.pickDefined(patch, ['email', 'phone', 'roles', 'status']) as any,
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'user', userId, before, updated);
    return updated;
  }

  async listRoles() {
    return this.prisma.role.findMany();
  }

  async getRole(roleId: string) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async createRole(actorId: string, input: { name: string; description?: string; permissions: string[] }, meta?: Omit<AuditMeta, 'actorId'>) {
    const role = await this.prisma.role.create({ data: input });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'role', role.id, undefined, role);
    return role;
  }

  async patchRole(actorId: string, roleId: string, patch: Partial<{ description?: string; permissions: string[] }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const role = await this.prisma.role.findFirst({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    const before = { ...role };
    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: this.pickDefined(patch, ['description', 'permissions']),
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'role', roleId, before, updated);
    return updated;
  }

  async listCompanies() {
    return this.prisma.fleetPartnerProfile.findMany();
  }

  async getCompany(companyId: string) {
    const company = await this.prisma.fleetPartnerProfile.findFirst({ where: { fleetId: companyId } });
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
    const company = await this.prisma.fleetPartnerProfile.create({
      data: {
        fleetId,
        companyName: input.companyName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        registrationNumber: input.registrationNumber,
        taxId: input.taxId,
        status: 'pending' as any,
      } as any,
    });

    await this.prisma.user.create({
      data: {
        id: fleetId,
        email: input.contactEmail,
        password: 'password123',
        phone: input.contactPhone,
        roles: ['fleet_owner'],
        status: 'active',
        fleetId,
      },
    });

    const approval = await this.prisma.approval.create({
      data: {
        entityType: 'company',
        entityId: fleetId,
        status: 'pending',
        requestedBy: fleetId,
      },
    });

    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'company', fleetId, undefined, company);
    return { ...company, approvalId: approval.id };
  }

  async patchCompany(
    actorId: string,
    companyId: string,
    patch: Partial<{ companyName: string; contactEmail: string; contactPhone: string; registrationNumber?: string; taxId?: string; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const company = await this.prisma.fleetPartnerProfile.findFirst({ where: { fleetId: companyId } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const before = { ...company };
    const updated = await this.prisma.fleetPartnerProfile.update({
      where: { id: company.id },
      data: this.pickDefined(patch, ['companyName', 'contactEmail', 'contactPhone', 'registrationNumber', 'taxId', 'status']) as any,
    });

    const user = await this.prisma.user.findFirst({ where: { fleetId: companyId } });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: patch.contactEmail ?? user.email,
          phone: patch.contactPhone ?? user.phone,
        },
      });
    }
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'company', companyId, before, updated);
    return updated;
  }

  async listApprovals() {
    return this.prisma.approval.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getApproval(approvalId: string) {
    const approval = await this.prisma.approval.findFirst({ where: { id: approvalId } });
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
    const approval = await this.prisma.approval.findFirst({ where: { id: approvalId } });
    if (!approval) {
      throw new NotFoundException('Approval not found');
    }
    const before = { ...approval };
    const updated = await this.prisma.approval.update({
      where: { id: approvalId },
      data: {
        status: input.decision,
        notes: input.notes ?? approval.notes,
        reviewedBy: actorId,
        reviewedAt: Date.now(),
      },
    });

    if (approval.entityType === 'company') {
      const company = await this.prisma.fleetPartnerProfile.findFirst({ where: { fleetId: approval.entityId } });
      if (company) {
        await this.prisma.fleetPartnerProfile.update({
          where: { id: company.id },
          data: { status: input.decision === 'approved' ? 'approved' : 'suspended' },
        });
      }
    }

    await this.recordAudit({ actorId, ...meta }, 'admin.review', 'approval', approvalId, before, updated);
    this.adminRealtimeGateway.publishToAll('approval.reviewed', {
      approvalId: updated.id,
      status: updated.status,
      reviewedBy: actorId,
      reviewedAt: updated.reviewedAt,
    });
    return updated;
  }

  async getOperationsAnalytics(period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'week') {
    const threshold = this.periodThresholdDate(period);

    const [tripsCount, completedTripsCount, activeTripsCount] = await Promise.all([
      this.prisma.trip.count({ where: { createdAt: { gte: threshold } } }),
      this.prisma.trip.count({ where: { createdAt: { gte: threshold }, status: 'completed' } }),
      this.prisma.trip.count({
        where: {
          createdAt: { gte: threshold },
          status: { in: ['driver_assigned', 'driver_arriving', 'arrived', 'in_progress'] },
        },
      }),
    ]);

    const [dispatchesCount, pendingDispatchesCount] = await Promise.all([
      this.prisma.fleetDispatch.count({ where: { createdAt: { gte: threshold } } }),
      this.prisma.fleetDispatch.count({ where: { createdAt: { gte: threshold }, status: 'pending' } }),
    ]);

    const [totalDrivers, onlineDrivers] = await Promise.all([
      this.prisma.driverProfile.count(),
      this.prisma.driverProfile.count({ where: { status: 'online' } }),
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

    const earnings = await this.prisma.earningsLedger.findMany({ where: { createdAt: { gte: threshold } } });
    const payouts = await this.prisma.fleetPayout.findMany({ where: { createdAt: { gte: threshold } } });
    const wallets = await this.prisma.walletAccount.findMany();

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
    return this.prisma.safetyEvent.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async listRiskCases() {
    return this.prisma.riskCase.findMany({ orderBy: { createdAt: 'desc' } });
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

    const records = await this.prisma.riderServiceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
    const record = await this.prisma.riderServiceRequest.findFirst({ where: { id: requestId } });
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
    const riskCase = await this.prisma.riskCase.findFirst({ where: { id: riskCaseId } });
    if (!riskCase) {
      throw new NotFoundException('Risk case not found');
    }
    return riskCase;
  }

  async listPricing() {
    return this.prisma.pricingConfig.findMany();
  }

  async getPricing(pricingId: string) {
    const pricing = await this.prisma.pricingConfig.findFirst({ where: { id: pricingId } });
    if (!pricing) {
      throw new NotFoundException('Pricing config not found');
    }
    return pricing;
  }

  async createPricing(actorId: string, input: { name: string; service: string; pricingRules: Record<string, unknown> }, meta?: Omit<AuditMeta, 'actorId'>) {
    const pricing = await this.prisma.pricingConfig.create({ data: { ...input, status: 'active', pricingRules: input.pricingRules as any } as any });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'pricing', pricing.id, undefined, pricing);
    return pricing;
  }

  async patchPricing(actorId: string, pricingId: string, patch: Partial<{ name: string; service: string; status: string; pricingRules: Record<string, unknown> }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const pricing = await this.prisma.pricingConfig.findFirst({ where: { id: pricingId } });
    if (!pricing) {
      throw new NotFoundException('Pricing config not found');
    }
    const before = { ...pricing };
    const updated = await this.prisma.pricingConfig.update({
      where: { id: pricingId },
      data: this.pickDefined(patch, ['name', 'service', 'status', 'pricingRules']) as any,
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'pricing', pricingId, before, updated);
    return updated;
  }

  async listPromos() {
    return this.prisma.promo.findMany();
  }

  async getPromo(promoId: string) {
    const promo = await this.prisma.promo.findFirst({ where: { id: promoId } });
    if (!promo) {
      throw new NotFoundException('Promo not found');
    }
    return promo;
  }

  async createPromo(actorId: string, input: { code: string; description: string; discountType: string; discountValue: number }, meta?: Omit<AuditMeta, 'actorId'>) {
    const promo = await this.prisma.promo.create({ data: { ...input, status: 'draft' as any, discountType: input.discountType as any } as any });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'promo', promo.id, undefined, promo);
    return promo;
  }

  async patchPromo(actorId: string, promoId: string, patch: Partial<{ description: string; discountType: string; discountValue: number; status: string }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const promo = await this.prisma.promo.findFirst({ where: { id: promoId } });
    if (!promo) {
      throw new NotFoundException('Promo not found');
    }
    const before = { ...promo };
    const updated = await this.prisma.promo.update({
      where: { id: promoId },
      data: this.pickDefined(patch, ['description', 'discountType', 'discountValue', 'status']) as any,
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'promo', promoId, before, updated);
    return updated;
  }

  async listServices() {
    return this.prisma.serviceConfig.findMany();
  }

  async getService(serviceId: string) {
    const service = await this.prisma.serviceConfig.findFirst({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service config not found');
    }
    return service;
  }

  async createServiceConfig(actorId: string, input: { key: string; name: string; enabled?: boolean; configuration: Record<string, unknown> }, meta?: Omit<AuditMeta, 'actorId'>) {
    const serviceConfig = await this.prisma.serviceConfig.create({ data: { ...input, configuration: input.configuration as any } as any });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'service_config', serviceConfig.id, undefined, serviceConfig);
    return serviceConfig;
  }

  async patchServiceConfig(actorId: string, serviceId: string, patch: Partial<{ name: string; enabled: boolean; configuration: Record<string, unknown> }>, meta?: Omit<AuditMeta, 'actorId'>) {
    const serviceConfig = await this.prisma.serviceConfig.findFirst({ where: { id: serviceId } });
    if (!serviceConfig) {
      throw new NotFoundException('Service config not found');
    }
    const before = { ...serviceConfig };
    const updated = await this.prisma.serviceConfig.update({
      where: { id: serviceId },
      data: this.pickDefined(patch, ['name', 'enabled', 'configuration']) as any,
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'service_config', serviceId, before, updated);
    return updated;
  }

  async getAuditLog() {
    return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getFlags() {
    return this.prisma.featureFlag.findMany();
  }

  async patchFeatureFlag(
    actorId: string,
    flagKey: string,
    patch: Partial<{ enabled: boolean; description: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing = await this.prisma.featureFlag.findFirst({ where: { key: flagKey } });
    if (existing) {
      const before = { ...existing };
      const updated = await this.prisma.featureFlag.update({
        where: { id: existing.id },
        data: this.pickDefined(patch, ['enabled', 'description']),
      });
      await this.recordAudit({ actorId, ...meta }, 'admin.update', 'feature_flag', existing.id, before, updated);
      this.adminRealtimeGateway.publishToAll('flag.changed', {
        flagKey: updated.key,
        enabled: updated.enabled,
        scope: updated.scope,
        timestamp: Date.now(),
      });
      return updated;
    }

    const scope = this.inferFeatureFlagScope(flagKey);
    const created = await this.prisma.featureFlag.create({
      data: {
        key: flagKey,
        enabled: patch.enabled ?? false,
        scope,
        description: patch.description,
      },
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'feature_flag', created.id, undefined, created);
    this.adminRealtimeGateway.publishToAll('flag.created', {
      flagKey: created.key,
      enabled: created.enabled,
      scope: created.scope,
      timestamp: Date.now(),
    });
    return created;
  }

  async listAgents() {
    return Array.from(this.agentStore.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async getAgent(agentId: string) {
    const agent = this.agentStore.get(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }

  async createAgent(
    actorId: string,
    input: { name: string; email: string; role: string; region?: string; status?: 'active' | 'inactive'; metadata?: Record<string, unknown> },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const now = Date.now();
    const agent = {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status ?? 'active',
      region: input.region,
      metadata: input.metadata,
      createdAt: now,
      updatedAt: now,
    };
    this.agentStore.set(agent.id, agent);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'agent', agent.id, undefined, agent);
    return agent;
  }

  async patchAgent(
    actorId: string,
    agentId: string,
    patch: Partial<{ name: string; email: string; role: string; region: string; status: 'active' | 'inactive'; metadata: Record<string, unknown> }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing = await this.getAgent(agentId);
    const before = { ...existing };
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['name', 'email', 'role', 'region', 'status', 'metadata']),
      updatedAt: Date.now(),
    };
    this.agentStore.set(agentId, updated);
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'agent', agentId, before, updated);
    return updated;
  }

  async deleteAgent(actorId: string, agentId: string, meta?: Omit<AuditMeta, 'actorId'>) {
    const existing = await this.getAgent(agentId);
    this.agentStore.delete(agentId);
    await this.recordAudit({ actorId, ...meta }, 'admin.delete', 'agent', agentId, existing, { deleted: true });
    return { deleted: true };
  }

  async searchAdmin(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return {
        query,
        totals: { users: 0, riders: 0, drivers: 0, companies: 0, trips: 0 },
        results: { users: [], riders: [], drivers: [], companies: [], trips: [] },
      };
    }

    const [users, riders, drivers, companies, trips] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.riderProfile.findMany(),
      this.prisma.driverProfile.findMany(),
      this.prisma.fleetPartnerProfile.findMany(),
      this.prisma.trip.findMany(),
    ]);

    const matches = (value?: string | null) => (value ?? '').toLowerCase().includes(normalized);

    const userResults = users.filter((item) => matches(item.email) || matches(item.phone) || item.roles.some((role) => matches(role)));
    const riderResults = riders.filter((item) => matches(item.fullName) || matches(item.email) || matches(item.phone) || matches(item.userId));
    const driverResults = drivers.filter((item) => matches(item.fullName) || matches(item.email) || matches(item.phone) || matches(item.userId));
    const companyResults = companies.filter((item) => matches(item.companyName) || matches(item.contactEmail) || matches(item.fleetId));
    const tripResults = trips.filter((item) => matches(item.id) || matches(item.riderId) || matches(item.driverId ?? '') || matches(item.status));

    return {
      query,
      totals: {
        users: userResults.length,
        riders: riderResults.length,
        drivers: driverResults.length,
        companies: companyResults.length,
        trips: tripResults.length,
      },
      results: {
        users: userResults.slice(0, 20),
        riders: riderResults.slice(0, 20),
        drivers: driverResults.slice(0, 20),
        companies: companyResults.slice(0, 20),
        trips: tripResults.slice(0, 20),
      },
    };
  }

  async getTaxConfig() {
    return Array.from(this.taxConfigStore.values()).sort((a, b) => a.regionId.localeCompare(b.regionId));
  }

  async patchTaxConfig(
    actorId: string,
    regionId: string,
    patch: Partial<{ currency: string; vatPercent: number; serviceTaxPercent: number; surchargePercent: number; notes: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing =
      this.taxConfigStore.get(regionId) ??
      ({
        regionId,
        currency: 'UGX',
        vatPercent: 18,
        serviceTaxPercent: 0,
        surchargePercent: 0,
        updatedAt: Date.now(),
      } as const);
    const before = this.taxConfigStore.get(regionId);
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['currency', 'vatPercent', 'serviceTaxPercent', 'surchargePercent', 'notes']),
      updatedAt: Date.now(),
    };
    this.taxConfigStore.set(regionId, updated);
    await this.recordAudit({ actorId, ...meta }, before ? 'admin.update' : 'admin.create', 'tax_config', regionId, before, updated);
    return updated;
  }

  async getInvoiceTemplates() {
    return Array.from(this.invoiceTemplateStore.values()).sort((a, b) => a.templateName.localeCompare(b.templateName));
  }

  async patchInvoiceTemplate(
    actorId: string,
    templateId: string,
    patch: Partial<{ regionId: string; templateName: string; prefix: string; nextNumber: number; footer: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing =
      this.invoiceTemplateStore.get(templateId) ??
      ({
        id: templateId,
        regionId: 'UG',
        templateName: 'Standard Invoice',
        prefix: 'EVZ',
        nextNumber: 1000,
        updatedAt: Date.now(),
      } as const);
    const before = this.invoiceTemplateStore.get(templateId);
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['regionId', 'templateName', 'prefix', 'nextNumber', 'footer']),
      updatedAt: Date.now(),
    };
    this.invoiceTemplateStore.set(templateId, updated);
    await this.recordAudit({ actorId, ...meta }, before ? 'admin.update' : 'admin.create', 'invoice_template', templateId, before, updated);
    return updated;
  }

  async listTrainingModules() {
    return Array.from(this.trainingModuleStore.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async createTrainingModule(
    actorId: string,
    input: { title: string; category: string; status?: 'draft' | 'published' | 'archived'; content?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const now = Date.now();
    const module = {
      id: uuidv4(),
      title: input.title,
      category: input.category,
      status: input.status ?? 'draft',
      content: input.content,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.trainingModuleStore.set(module.id, module);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'training_module', module.id, undefined, module);
    return module;
  }

  async patchTrainingModule(
    actorId: string,
    moduleId: string,
    patch: Partial<{ title: string; category: string; status: 'draft' | 'published' | 'archived'; content: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing = this.trainingModuleStore.get(moduleId);
    if (!existing) {
      throw new NotFoundException('Training module not found');
    }
    const before = { ...existing };
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['title', 'category', 'status', 'content']),
      version: existing.version + 1,
      updatedAt: Date.now(),
    };
    this.trainingModuleStore.set(moduleId, updated);
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'training_module', moduleId, before, updated);
    return updated;
  }

  async deleteTrainingModule(actorId: string, moduleId: string, meta?: Omit<AuditMeta, 'actorId'>) {
    const existing = this.trainingModuleStore.get(moduleId);
    if (!existing) {
      throw new NotFoundException('Training module not found');
    }
    this.trainingModuleStore.delete(moduleId);
    await this.recordAudit({ actorId, ...meta }, 'admin.delete', 'training_module', moduleId, existing, { deleted: true });
    return { deleted: true };
  }

  async listPolicies() {
    return Array.from(this.policyStore.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async createPolicy(
    actorId: string,
    input: { key: string; title: string; scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin'; status?: 'draft' | 'active' | 'archived'; content: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const now = Date.now();
    const policy = {
      id: uuidv4(),
      key: input.key,
      title: input.title,
      scope: input.scope,
      status: input.status ?? 'draft',
      content: input.content,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.policyStore.set(policy.id, policy);
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'policy', policy.id, undefined, policy);
    return policy;
  }

  async patchPolicy(
    actorId: string,
    policyId: string,
    patch: Partial<{ key: string; title: string; scope: 'global' | 'rider' | 'driver' | 'fleet' | 'admin'; status: 'draft' | 'active' | 'archived'; content: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing = this.policyStore.get(policyId);
    if (!existing) {
      throw new NotFoundException('Policy not found');
    }
    const before = { ...existing };
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['key', 'title', 'scope', 'status', 'content']),
      version: existing.version + 1,
      updatedAt: Date.now(),
    };
    this.policyStore.set(policyId, updated);
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'policy', policyId, before, updated);
    return updated;
  }

  async listVerticalPolicies() {
    return Array.from(this.verticalPolicyStore.values()).sort((a, b) => a.verticalId.localeCompare(b.verticalId));
  }

  async patchVerticalPolicy(
    actorId: string,
    verticalId: string,
    patch: Partial<{ name: string; status: 'active' | 'inactive'; rules: Record<string, unknown> }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const existing =
      this.verticalPolicyStore.get(verticalId) ??
      ({
        verticalId,
        name: verticalId.toUpperCase(),
        status: 'active',
        rules: {},
        updatedAt: Date.now(),
      } as const);
    const before = this.verticalPolicyStore.get(verticalId);
    const updated = {
      ...existing,
      ...this.pickDefined(patch, ['name', 'status', 'rules']),
      updatedAt: Date.now(),
    };
    this.verticalPolicyStore.set(verticalId, updated);
    await this.recordAudit({ actorId, ...meta }, before ? 'admin.update' : 'admin.create', 'vertical_policy', verticalId, before, updated);
    return updated;
  }

  async getHealth() {
    const [usersCount, tripsCount, companiesCount, pendingApprovalsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.trip.count(),
      this.prisma.fleetPartnerProfile.count(),
      this.prisma.approval.count({ where: { status: 'pending' } }),
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
      this.prisma.user.count(),
      this.prisma.riderProfile.count(),
      this.prisma.driverProfile.count(),
      this.prisma.fleetPartnerProfile.count(),
      this.prisma.trip.count(),
      this.prisma.approval.count({ where: { status: 'pending' } }),
      this.prisma.riskCase.count({ where: { status: { in: ['open', 'monitoring'] } } }),
      this.prisma.safetyEvent.count(),
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

  async listPricingZones() {
    return this.prisma.pricingZone.findMany({ orderBy: { name: 'asc' } });
  }

  async createPricingZone(
    actorId: string,
    input: { name: string; description?: string; boundaries: any; pricingRules: Record<string, unknown>; status?: string },
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const id = uuidv4();
    await this.prisma.$queryRawUnsafe(
      `INSERT INTO pricing_zones (id, name, description, boundaries, "pricingRules", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, ST_GeomFromGeoJSON($4)::geometry(Polygon, 4326), $5, $6, NOW(), NOW())`,
      id,
      input.name,
      input.description || null,
      JSON.stringify(input.boundaries),
      input.pricingRules as any,
      input.status ?? 'active',
    );
    const zone = await this.prisma.pricingZone.findFirst({ where: { id } });
    await this.recordAudit({ actorId, ...meta }, 'admin.create', 'pricing_zone', id, undefined, zone!);
    return zone;
  }

  async patchPricingZone(
    actorId: string,
    zoneId: string,
    patch: Partial<{ name: string; description: string; boundaries: any; pricingRules: Record<string, unknown>; status: string }>,
    meta?: Omit<AuditMeta, 'actorId'>,
  ) {
    const zone = await this.prisma.pricingZone.findFirst({ where: { id: zoneId } });
    if (!zone) {
      throw new NotFoundException('Pricing zone not found');
    }
    const before = { ...zone };
    const updated = await this.prisma.pricingZone.update({
      where: { id: zoneId },
      data: this.pickDefined(patch, ['name', 'description', 'boundaries', 'pricingRules', 'status']) as any,
    });
    await this.recordAudit({ actorId, ...meta }, 'admin.update', 'pricing_zone', zoneId, before, updated);
    return updated;
  }

  async findPricingZoneByLocation(lat: number, lng: number) {
    const result = await this.prisma.$queryRawUnsafe<Array<any>>(
      `SELECT * FROM pricing_zones
       WHERE ST_Contains(boundaries::geometry, ST_SetSRID(ST_Point($1, $2), 4326))
       AND status = 'active'
       ORDER BY "createdAt" DESC
       LIMIT 1`,
      lng,
      lat,
    );
    return result[0] ?? null;
  }

  private async recordAudit(meta: AuditMeta, action: string, resource: string, resourceId?: string, before?: object, after?: object) {
    const audit = await this.prisma.auditLog.create({
      data: {
        actorId: meta.actorId,
        actorType: 'admin',
        action,
        resource,
        resourceId,
        before: before as any,
        after: after as any,
        ipAddress: meta.ipAddress,
        userAgent: Array.isArray(meta.userAgent) ? meta.userAgent.join(', ') : meta.userAgent,
      },
    });
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
