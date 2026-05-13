import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PresenceLocationService } from '../presence-location/presence-location.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RiderRealtimeGateway } from '../realtime/scoped-realtime.gateway';
import { randomUUID } from 'crypto';
import type { RequestRiderTripDto, UpdateRiderTripTrackingDto } from './dto/rider.dto';
import { RiderProfile } from '../entities/rider-profile.entity';
import { Trip } from '../entities/trip.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { WalletAccount } from '../entities/wallet-account.entity';
import { EarningsLedger } from '../entities/earnings-ledger.entity';
import { RiderServiceRequest } from '../entities/rider-service-request.entity';

@Injectable()
export class RiderService {
  private readonly commuteStore = new Map<string, Array<Record<string, unknown>>>();
  private readonly paymentIntentStore = new Map<string, Array<Record<string, unknown>>>();

  constructor(
    @InjectRepository(RiderProfile) private riderProfileRepo: Repository<RiderProfile>,
    @InjectRepository(Trip) private tripRepo: Repository<Trip>,
    @InjectRepository(JobOffer) private jobOfferRepo: Repository<JobOffer>,
    @InjectRepository(Notification) private notificationRepo: Repository<Notification>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(WalletAccount) private walletRepo: Repository<WalletAccount>,
    @InjectRepository(EarningsLedger) private earningsLedgerRepo: Repository<EarningsLedger>,
    @InjectRepository(RiderServiceRequest) private riderServiceRequestRepo: Repository<RiderServiceRequest>,
    @Optional() private readonly presenceLocationService?: PresenceLocationService,
    @Optional() private readonly realtimeGateway?: RealtimeGateway,
    @Optional() private readonly riderRealtimeGateway?: RiderRealtimeGateway,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.riderProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Rider profile not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    patch: Partial<{ fullName: string; phone: string; city: string; country: string; preferredCurrency: string }>,
  ) {
    const profile = await this.getProfile(userId);
    profile.fullName = patch.fullName ?? profile.fullName;
    profile.phone = patch.phone ?? profile.phone;
    if (patch.fullName) {
      const [first, ...rest] = patch.fullName.split(' ');
      profile.firstName = first;
      profile.lastName = rest.join(' ');
    }
    if (patch.city) profile.city = patch.city;
    if (patch.country) profile.country = patch.country;
    if (patch.preferredCurrency) profile.preferredCurrency = patch.preferredCurrency;
    
    await this.riderProfileRepo.save(profile);
    return profile;
  }

  async getPreferences(userId: string) {
    const profile = await this.getProfile(userId);
    return this.normalizeRiderPreferences(profile.preferences);
  }

  async patchPreferences(userId: string, patch: Record<string, unknown>) {
    const profile = await this.getProfile(userId);
    const current = this.normalizeRiderPreferences(profile.preferences);
    const next = this.deepMerge(current, patch);
    profile.preferences = {
      ...profile.preferences,
      ...next,
    };
    await this.riderProfileRepo.save(profile);
    return this.normalizeRiderPreferences(profile.preferences);
  }

  async listEmergencyContacts(userId: string) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    return prefs.emergencyContacts;
  }

  async createEmergencyContact(
    userId: string,
    input: { name: string; phone: string; relationship: string; isPrimary?: boolean },
  ) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    const nextContacts = prefs.emergencyContacts.map((contact) => ({
      ...contact,
      isPrimary: input.isPrimary ? false : contact.isPrimary,
    }));
    const created = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      relationship: input.relationship,
      isPrimary: input.isPrimary ?? nextContacts.length === 0,
    };
    nextContacts.unshift(created);
    profile.preferences = {
      ...profile.preferences,
      ...prefs,
      emergencyContacts: nextContacts,
    };
    await this.riderProfileRepo.save(profile);
    return created;
  }

  async patchEmergencyContact(
    userId: string,
    contactId: string,
    patch: Partial<{ name: string; phone: string; relationship: string; isPrimary: boolean }>,
  ) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    const target = prefs.emergencyContacts.find((contact) => contact.id === contactId);
    if (!target) {
      throw new NotFoundException('Emergency contact not found');
    }

    const nextContacts = prefs.emergencyContacts.map((contact) => {
      if (contact.id !== contactId) {
        return {
          ...contact,
          isPrimary: patch.isPrimary ? false : contact.isPrimary,
        };
      }
      return {
        ...contact,
        ...patch,
      };
    });

    profile.preferences = {
      ...profile.preferences,
      ...prefs,
      emergencyContacts: nextContacts,
    };
    await this.riderProfileRepo.save(profile);
    return nextContacts.find((contact) => contact.id === contactId)!;
  }

  async deleteEmergencyContact(userId: string, contactId: string) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    const existing = prefs.emergencyContacts.find((contact) => contact.id === contactId);
    if (!existing) {
      throw new NotFoundException('Emergency contact not found');
    }

    const remaining = prefs.emergencyContacts.filter((contact) => contact.id !== contactId);
    if (existing.isPrimary && remaining.length > 0) {
      remaining[0].isPrimary = true;
    }

    profile.preferences = {
      ...profile.preferences,
      ...prefs,
      emergencyContacts: remaining,
    };
    await this.riderProfileRepo.save(profile);
    return { deleted: true };
  }

  async triggerSos(
    userId: string,
    input: { message?: string; location?: { lat?: number; lng?: number }; type?: 'sos' | 'emergency'; tripId?: string },
  ) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    const event = {
      id: randomUUID(),
      tripId: input.tripId,
      type: input.type ?? 'sos',
      location:
        input.location?.lat != null && input.location?.lng != null
          ? { lat: Number(input.location.lat), lng: Number(input.location.lng) }
          : undefined,
      message: input.message,
      status: 'active' as const,
      createdAt: Date.now(),
    };

    const sosHistory = [event, ...prefs.sosHistory].slice(0, 100);
    profile.preferences = {
      ...profile.preferences,
      ...prefs,
      sosHistory,
    };
    await this.riderProfileRepo.save(profile);
    return event;
  }

  async listSosHistory(userId: string) {
    const profile = await this.getProfile(userId);
    const prefs = this.normalizeRiderPreferences(profile.preferences);
    return prefs.sosHistory;
  }

  async getWallet(userId: string) {
    let wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        userId,
        balance: 0,
        currency: 'UGX',
        settings: {},
      });
      await this.walletRepo.save(wallet);
    }

    return {
      balance: Number(wallet.balance),
      currency: wallet.currency || 'UGX',
      pendingAmount: 0,
      lastUpdatedAt: new Date(wallet.updatedAt).getTime(),
    };
  }

  async listWalletTransactions(userId: string, limit = 20, offset = 0) {
    const events = await this.earningsLedgerRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: Math.max(1, Math.min(100, limit)),
      skip: Math.max(0, offset),
    });

    return events.map((event) => ({
      id: event.id,
      type: this.mapWalletTransactionType(event.type),
      amount: Number(event.amount),
      currency: 'UGX',
      status: 'completed' as const,
      description: event.metadata?.description || event.type,
      createdAt: new Date(event.createdAt).getTime(),
      relatedTripId: event.tripId || event.deliveryOrderId || undefined,
    }));
  }

  async listPaymentMethods(userId: string) {
    await this.getProfile(userId);
    return [
      { id: 'wallet', type: 'wallet', label: 'EVzone Wallet', enabled: true, isDefault: true },
      { id: 'mobile_money', type: 'mobile_money', label: 'Mobile Money', enabled: true, isDefault: false },
      { id: 'card', type: 'card', label: 'Bank Card', enabled: true, isDefault: false },
    ];
  }

  async createPaymentIntent(
    userId: string,
    input: { amount: number; currency?: string; serviceType?: string; referenceId?: string; methodId?: string },
  ) {
    const intent = {
      id: randomUUID(),
      userId,
      amount: Number(input.amount || 0),
      currency: input.currency || 'UGX',
      methodId: input.methodId || 'wallet',
      serviceType: input.serviceType || 'ride',
      referenceId: input.referenceId,
      status: 'pending',
      createdAt: Date.now(),
    };

    const intents = this.paymentIntentStore.get(userId) ?? [];
    intents.unshift(intent);
    this.paymentIntentStore.set(userId, intents.slice(0, 200));
    return intent;
  }

  async verifyPaymentIntent(userId: string, intentId: string, input: { verificationCode?: string }) {
    void input;
    const intents = this.paymentIntentStore.get(userId) ?? [];
    const target = intents.find((intent) => intent.id === intentId);
    if (!target) {
      throw new NotFoundException('Payment intent not found');
    }
    target.status = 'verified';
    target.verifiedAt = Date.now();
    return target;
  }

  async listEligiblePromos(userId: string) {
    await this.getProfile(userId);
    return [
      { code: 'RIDE10', description: '10% off rides', discountType: 'percent', discountValue: 10 },
      { code: 'WELCOME5', description: 'Flat 5,000 UGX off', discountType: 'flat', discountValue: 5000 },
    ];
  }

  async applyPromo(userId: string, input: { code: string; orderAmount?: number }) {
    await this.getProfile(userId);
    const upperCode = String(input.code || '').trim().toUpperCase();
    if (!upperCode) {
      throw new NotFoundException('Promo code is required');
    }
    const orderAmount = Number(input.orderAmount || 0);
    const discount = upperCode === 'RIDE10' ? Math.round(orderAmount * 0.1) : 5000;
    return {
      code: upperCode,
      applied: true,
      discountAmount: discount,
      currency: 'UGX',
      finalAmount: Math.max(0, orderAmount - discount),
    };
  }

  async listCommutes(userId: string) {
    await this.getProfile(userId);
    return this.commuteStore.get(userId) ?? [];
  }

  async createCommute(
    userId: string,
    input: { name?: string; pickupAddress: string; dropoffAddress: string; schedule?: Record<string, unknown> },
  ) {
    const commute = {
      id: randomUUID(),
      name: input.name || 'Saved commute',
      pickupAddress: input.pickupAddress,
      dropoffAddress: input.dropoffAddress,
      schedule: input.schedule || {},
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const commutes = this.commuteStore.get(userId) ?? [];
    commutes.unshift(commute);
    this.commuteStore.set(userId, commutes.slice(0, 200));
    return commute;
  }

  async patchCommute(userId: string, commuteId: string, patch: Record<string, unknown>) {
    const commutes = this.commuteStore.get(userId) ?? [];
    const target = commutes.find((commute) => commute.id === commuteId);
    if (!target) {
      throw new NotFoundException('Commute not found');
    }
    Object.assign(target, patch, { updatedAt: Date.now() });
    return target;
  }

  async deleteCommute(userId: string, commuteId: string) {
    const commutes = this.commuteStore.get(userId) ?? [];
    const filtered = commutes.filter((commute) => commute.id !== commuteId);
    if (filtered.length === commutes.length) {
      throw new NotFoundException('Commute not found');
    }
    this.commuteStore.set(userId, filtered);
    return { deleted: true };
  }

  async createWalletTransfer(
    userId: string,
    input: { amount: number; destination: string; method?: string; note?: string },
  ) {
    const wallet = await this.getWallet(userId);
    const transfer = {
      id: randomUUID(),
      amount: Number(input.amount || 0),
      currency: wallet.currency,
      destination: input.destination,
      method: input.method || 'wallet_transfer',
      note: input.note,
      status: 'completed',
      createdAt: Date.now(),
    };

    const intents = this.paymentIntentStore.get(userId) ?? [];
    intents.unshift({
      id: transfer.id,
      userId,
      amount: transfer.amount,
      currency: transfer.currency,
      methodId: transfer.method,
      serviceType: 'wallet_transfer',
      status: transfer.status,
      createdAt: transfer.createdAt,
      destination: transfer.destination,
      note: transfer.note,
    });
    this.paymentIntentStore.set(userId, intents.slice(0, 200));
    return transfer;
  }

  async listWalletTransfers(userId: string) {
    const intents = this.paymentIntentStore.get(userId) ?? [];
    return intents.filter((intent) => intent.serviceType === 'wallet_transfer');
  }

  async listRentals(userId: string) {
    const records = await this.riderServiceRequestRepo.find({
      where: { riderId: userId, serviceType: 'rental' },
      order: { createdAt: 'DESC' },
    });
    return records.map((record) => this.mapRentalRecord(record));
  }

  async getRentalById(userId: string, rentalId: string) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: rentalId, riderId: userId, serviceType: 'rental' },
    });
    if (!record) throw new NotFoundException('Rental booking not found');
    return this.mapRentalRecord(record);
  }

  async createRental(
    userId: string,
    input: { vehicleId: string; startDate: string; endDate: string; pickupLocation?: { lat: number; lng: number; address: string } },
  ) {
    const record = this.riderServiceRequestRepo.create({
      riderId: userId,
      serviceType: 'rental',
      status: 'upcoming',
      payload: {
        vehicleId: input.vehicleId,
        vehicleName: `Vehicle ${input.vehicleId}`,
        startDate: input.startDate,
        endDate: input.endDate,
        pickupLocation: input.pickupLocation,
        totalAmount: 0,
        currency: 'UGX',
      },
    });
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapRentalRecord(saved);
    this.publishRiderServiceEvent(userId, 'rental.updated', mapped);
    return mapped;
  }

  async patchRental(userId: string, rentalId: string, patch: Partial<Record<string, unknown>>) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: rentalId, riderId: userId, serviceType: 'rental' },
    });
    if (!record) throw new NotFoundException('Rental booking not found');

    record.status = typeof patch.status === 'string' ? patch.status : record.status;
    record.payload = { ...(record.payload || {}), ...patch };
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapRentalRecord(saved);
    this.publishRiderServiceEvent(userId, 'rental.updated', mapped);
    return mapped;
  }

  async cancelRental(userId: string, rentalId: string, reason?: string) {
    return this.patchRental(userId, rentalId, { status: 'cancelled', cancellationReason: reason });
  }

  async listTours(userId: string) {
    const records = await this.riderServiceRequestRepo.find({
      where: { riderId: userId, serviceType: 'tour' },
      order: { createdAt: 'DESC' },
    });
    return records.map((record) => this.mapTourRecord(record));
  }

  async getTourById(userId: string, tourId: string) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: tourId, riderId: userId, serviceType: 'tour' },
    });
    if (!record) throw new NotFoundException('Tour booking not found');
    return this.mapTourRecord(record);
  }

  async createTour(
    userId: string,
    input: { tourId: string; scheduledDate: string; participantsCount: number; specialRequests?: string },
  ) {
    const record = this.riderServiceRequestRepo.create({
      riderId: userId,
      serviceType: 'tour',
      status: 'booked',
      payload: {
        tourId: input.tourId,
        tourName: `Tour ${input.tourId}`,
        scheduledDate: input.scheduledDate,
        participantsCount: input.participantsCount,
        specialRequests: input.specialRequests,
        totalPrice: 0,
        currency: 'UGX',
      },
    });
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapTourRecord(saved);
    this.publishRiderServiceEvent(userId, 'tour.updated', mapped);
    return mapped;
  }

  async cancelTour(userId: string, tourId: string, reason?: string) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: tourId, riderId: userId, serviceType: 'tour' },
    });
    if (!record) throw new NotFoundException('Tour booking not found');
    record.status = 'cancelled';
    record.payload = { ...(record.payload || {}), cancellationReason: reason };
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapTourRecord(saved);
    this.publishRiderServiceEvent(userId, 'tour.updated', mapped);
    return mapped;
  }

  async listAmbulances(userId: string) {
    const records = await this.riderServiceRequestRepo.find({
      where: { riderId: userId, serviceType: 'ambulance' },
      order: { createdAt: 'DESC' },
    });
    return records.map((record) => this.mapAmbulanceRecord(record));
  }

  async getAmbulanceById(userId: string, ambulanceId: string) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: ambulanceId, riderId: userId, serviceType: 'ambulance' },
    });
    if (!record) throw new NotFoundException('Ambulance request not found');
    return this.mapAmbulanceRecord(record);
  }

  async createAmbulance(
    userId: string,
    input: {
      pickupAddress: string;
      pickupLat: number;
      pickupLng: number;
      dropoffAddress?: string;
      hospitalName?: string;
      priority?: 'normal' | 'urgent' | 'emergency';
    },
  ) {
    const record = this.riderServiceRequestRepo.create({
      riderId: userId,
      serviceType: 'ambulance',
      status: 'requested',
      payload: {
        pickupAddress: input.pickupAddress,
        pickupLat: input.pickupLat,
        pickupLng: input.pickupLng,
        dropoffAddress: input.dropoffAddress,
        hospitalName: input.hospitalName,
        priority: input.priority ?? 'normal',
      },
    });
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapAmbulanceRecord(saved);
    this.publishRiderServiceEvent(userId, 'ambulance.updated', mapped);
    return mapped;
  }

  async patchAmbulance(userId: string, ambulanceId: string, patch: Partial<Record<string, unknown>>) {
    const record = await this.riderServiceRequestRepo.findOne({
      where: { id: ambulanceId, riderId: userId, serviceType: 'ambulance' },
    });
    if (!record) throw new NotFoundException('Ambulance request not found');
    record.status = typeof patch.status === 'string' ? patch.status : record.status;
    record.payload = { ...(record.payload || {}), ...patch };
    const saved = await this.riderServiceRequestRepo.save(record);
    const mapped = this.mapAmbulanceRecord(saved);
    this.publishRiderServiceEvent(userId, 'ambulance.updated', mapped);
    return mapped;
  }

  async cancelAmbulance(userId: string, ambulanceId: string, reason?: string) {
    return this.patchAmbulance(userId, ambulanceId, { status: 'cancelled', cancellationReason: reason });
  }

  async listTrips(userId: string) {
    return this.tripRepo.find({
      where: { riderId: userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getActiveTrip(userId: string) {
    const activeTrip = await this.tripRepo.findOne({
      where: [
        { riderId: userId, status: 'requested' },
        { riderId: userId, status: 'driver_assigned' },
        { riderId: userId, status: 'driver_arriving' },
        { riderId: userId, status: 'arrived' },
        { riderId: userId, status: 'in_progress' },
      ],
    });
    return activeTrip ?? null;
  }

  async getTripById(userId: string, tripId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId, riderId: userId },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async requestTrip(userId: string, input: RequestRiderTripDto) {
    const trip = await this.createRequestedTrip(userId, input);
    const nearbyDrivers =
      (await this.presenceLocationService?.findNearbyDrivers(
        input.pickupLat,
        input.pickupLng,
        input.radiusMeters ?? 5000,
      )) ?? [];

    const jobs = await Promise.all(nearbyDrivers.map(async (driver) => {
      const job = this.jobOfferRepo.create({
        driverId: driver.driverId,
        tripId: trip.id,
        status: 'pending',
        estimatedFare: 0,
      });

      await this.jobOfferRepo.save(job);
      
      const notification = this.notificationRepo.create({
        userId: driver.driverId,
        title: 'New trip request',
        body: `${input.pickupAddress} to ${input.dropoffAddress}`,
        type: 'info',
        isRead: false,
      });
      await this.notificationRepo.save(notification);

      this.realtimeGateway?.publishEvent({
        driverId: driver.driverId,
        event: 'job.offer.new',
        payload: {
          jobId: job.id,
          tripId: trip.id,
          riderId: userId,
          pickup: input.pickupAddress,
          dropoff: input.dropoffAddress,
          pickupLocation: { lat: input.pickupLat, lng: input.pickupLng },
          dropoffLocation: { lat: input.dropoffLat, lng: input.dropoffLng },
          distanceMeters: driver.distanceMeters,
        },
      });

      return {
        ...job,
        distanceMeters: driver.distanceMeters,
      };
    }));

    return {
      trip,
      jobOffers: jobs,
      nearbyDriverCount: jobs.length,
    };
  }

  async updateTripTracking(userId: string, tripId: string, patch: UpdateRiderTripTrackingDto) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId, riderId: userId } });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const nextStatus = this.mapTrackingStatus(patch.status);
    if (nextStatus) {
      trip.status = nextStatus as any;
      const now = new Date();
      if (nextStatus === 'arrived') {
        trip.driverArrivedAt = trip.driverArrivedAt ?? now;
      }
      if (nextStatus === 'in_progress') {
        trip.startedAt = trip.startedAt ?? now;
      }
      if (nextStatus === 'completed') {
        trip.completedAt = trip.completedAt ?? now;
      }
      if (nextStatus === 'cancelled') {
        trip.cancelledAt = trip.cancelledAt ?? now;
      }
    }

    await this.tripRepo.save(trip);
    return trip;
  }

  private async createRequestedTrip(riderId: string, input: RequestRiderTripDto): Promise<Trip> {
    const trip = this.tripRepo.create({
      riderId,
      type: (input.type as any) ?? 'ride',
      status: 'requested',
      pickupAddress: input.pickupAddress,
      dropoffAddress: input.dropoffAddress,
      pickupLocation: { lat: input.pickupLat, lng: input.pickupLng },
      dropoffLocation: { lat: input.dropoffLat, lng: input.dropoffLng },
      otpCode: String(Math.floor(1000 + Math.random() * 9000)),
    });

    await this.tripRepo.save(trip);
    return trip;
  }

  private mapTrackingStatus(status: UpdateRiderTripTrackingDto['status']) {
    switch (status) {
      case 'assigned':
        return 'driver_assigned' as const;
      case 'driver_en_route':
        return 'driver_arriving' as const;
      case 'arrived':
      case 'in_progress':
      case 'completed':
      case 'cancelled':
        return status;
      default:
        return null;
    }
  }

  private mapRentalRecord(record: RiderServiceRequest) {
    const payload = record.payload || {};
    return {
      id: record.id,
      riderId: record.riderId,
      vehicleId: String(payload.vehicleId || ''),
      vehicleName: String(payload.vehicleName || payload.vehicleId || 'Rental Vehicle'),
      status: this.normalizeRentalStatus(record.status),
      startDate: String(payload.startDate || new Date(record.createdAt).toISOString()),
      endDate: String(payload.endDate || new Date(record.createdAt).toISOString()),
      totalAmount: Number(payload.totalAmount || 0),
      currency: String(payload.currency || 'UGX'),
      createdAt: new Date(record.createdAt).getTime(),
    };
  }

  private mapTourRecord(record: RiderServiceRequest) {
    const payload = record.payload || {};
    return {
      id: record.id,
      riderId: record.riderId,
      tourId: String(payload.tourId || record.id),
      tourName: String(payload.tourName || 'Tour booking'),
      status: this.normalizeTourStatus(record.status),
      scheduledDate: String(payload.scheduledDate || new Date(record.createdAt).toISOString()),
      participantsCount: Number(payload.participantsCount || 1),
      totalPrice: Number(payload.totalPrice || 0),
      currency: String(payload.currency || 'UGX'),
      createdAt: new Date(record.createdAt).getTime(),
    };
  }

  private mapAmbulanceRecord(record: RiderServiceRequest) {
    const payload = record.payload || {};
    return {
      id: record.id,
      riderId: record.riderId,
      driverId: record.driverId || undefined,
      status: this.normalizeAmbulanceStatus(record.status),
      pickupAddress: String(payload.pickupAddress || ''),
      dropoffAddress: payload.dropoffAddress ? String(payload.dropoffAddress) : undefined,
      hospitalName: payload.hospitalName ? String(payload.hospitalName) : undefined,
      priority: this.normalizePriority(payload.priority),
      requestedAt: new Date(record.createdAt).getTime(),
      updatedAt: new Date(record.updatedAt).getTime(),
    };
  }

  private normalizeRentalStatus(status: string): 'upcoming' | 'active' | 'completed' | 'cancelled' {
    if (status === 'active' || status === 'completed' || status === 'cancelled') return status;
    return 'upcoming';
  }

  private normalizeTourStatus(status: string): 'booked' | 'in_progress' | 'completed' | 'cancelled' {
    if (status === 'in_progress' || status === 'completed' || status === 'cancelled') return status;
    return 'booked';
  }

  private normalizeAmbulanceStatus(
    status: string,
  ): 'requested' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' {
    if (status === 'dispatched' || status === 'en_route' || status === 'arrived' || status === 'in_progress' || status === 'completed' || status === 'cancelled') {
      return status;
    }
    return 'requested';
  }

  private normalizePriority(priority: unknown): 'normal' | 'urgent' | 'emergency' {
    if (priority === 'urgent' || priority === 'emergency') return priority;
    return 'normal';
  }

  private publishRiderServiceEvent(userId: string, event: string, data: Record<string, unknown>) {
    this.riderRealtimeGateway?.publishToUser(userId, event, data);
    this.riderRealtimeGateway?.publishToUser(userId, 'rider.service.updated', {
      event,
      ...data,
    });
  }

  private normalizeRiderPreferences(raw: Record<string, any> | null | undefined) {
    return {
      preferredLanguages: Array.isArray(raw?.preferredLanguages) ? raw.preferredLanguages : ['en'],
      notificationSettings: {
        email: raw?.notificationSettings?.email ?? true,
        sms: raw?.notificationSettings?.sms ?? true,
        push: raw?.notificationSettings?.push ?? true,
      },
      privacySettings: {
        shareLocation: raw?.privacySettings?.shareLocation ?? true,
        shareRideHistory: raw?.privacySettings?.shareRideHistory ?? false,
      },
      ridePreferences: {
        vehicleType: raw?.ridePreferences?.vehicleType ?? 'car',
        comfortLevel: raw?.ridePreferences?.comfortLevel ?? 'standard',
      },
      emergencyContacts: Array.isArray(raw?.emergencyContacts) ? raw.emergencyContacts : [],
      sosHistory: Array.isArray(raw?.sosHistory) ? raw.sosHistory : [],
    };
  }

  private deepMerge<T extends Record<string, any>>(base: T, patch: Record<string, unknown>): T {
    const output: Record<string, any> = { ...base };
    for (const [key, value] of Object.entries(patch)) {
      if (value && typeof value === 'object' && !Array.isArray(value) && typeof output[key] === 'object' && output[key] !== null) {
        output[key] = this.deepMerge(output[key], value as Record<string, unknown>);
      } else {
        output[key] = value;
      }
    }
    return output as T;
  }

  private mapWalletTransactionType(
    type: string,
  ): 'top_up' | 'ride_payment' | 'delivery_payment' | 'rental_payment' | 'tour_payment' | 'ambulance_payment' | 'refund' | 'adjustment' {
    if (type === 'delivery_fare') return 'delivery_payment';
    if (type === 'trip_fare') return 'ride_payment';
    if (type === 'penalty') return 'adjustment';
    if (type === 'bonus' || type === 'tip') return 'top_up';
    return 'adjustment';
  }
}
