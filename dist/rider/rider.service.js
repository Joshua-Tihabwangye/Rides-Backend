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
exports.RiderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const presence_location_service_1 = require("../presence-location/presence-location.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const scoped_realtime_gateway_1 = require("../realtime/scoped-realtime.gateway");
const crypto_1 = require("crypto");
const rider_profile_entity_1 = require("../entities/rider-profile.entity");
const trip_entity_1 = require("../entities/trip.entity");
const job_offer_entity_1 = require("../entities/job-offer.entity");
const notification_entity_1 = require("../entities/notification.entity");
const user_entity_1 = require("../entities/user.entity");
const wallet_account_entity_1 = require("../entities/wallet-account.entity");
const earnings_ledger_entity_1 = require("../entities/earnings-ledger.entity");
const rider_service_request_entity_1 = require("../entities/rider-service-request.entity");
let RiderService = class RiderService {
    constructor(riderProfileRepo, tripRepo, jobOfferRepo, notificationRepo, userRepo, walletRepo, earningsLedgerRepo, riderServiceRequestRepo, presenceLocationService, realtimeGateway, riderRealtimeGateway) {
        this.riderProfileRepo = riderProfileRepo;
        this.tripRepo = tripRepo;
        this.jobOfferRepo = jobOfferRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.walletRepo = walletRepo;
        this.earningsLedgerRepo = earningsLedgerRepo;
        this.riderServiceRequestRepo = riderServiceRequestRepo;
        this.presenceLocationService = presenceLocationService;
        this.realtimeGateway = realtimeGateway;
        this.riderRealtimeGateway = riderRealtimeGateway;
        this.commuteStore = new Map();
        this.paymentIntentStore = new Map();
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const profile = await this.riderProfileRepo.findOne({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Rider profile not found');
        }
        return profile;
    }
    async updateProfile(userId, patch) {
        const profile = await this.getProfile(userId);
        profile.fullName = patch.fullName ?? profile.fullName;
        profile.phone = patch.phone ?? profile.phone;
        if (patch.fullName) {
            const [first, ...rest] = patch.fullName.split(' ');
            profile.firstName = first;
            profile.lastName = rest.join(' ');
        }
        if (patch.city)
            profile.city = patch.city;
        if (patch.country)
            profile.country = patch.country;
        if (patch.preferredCurrency)
            profile.preferredCurrency = patch.preferredCurrency;
        await this.riderProfileRepo.save(profile);
        return profile;
    }
    async getPreferences(userId) {
        const profile = await this.getProfile(userId);
        return this.normalizeRiderPreferences(profile.preferences);
    }
    async patchPreferences(userId, patch) {
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
    async listEmergencyContacts(userId) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        return prefs.emergencyContacts;
    }
    async createEmergencyContact(userId, input) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        const nextContacts = prefs.emergencyContacts.map((contact) => ({
            ...contact,
            isPrimary: input.isPrimary ? false : contact.isPrimary,
        }));
        const created = {
            id: (0, crypto_1.randomUUID)(),
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
    async patchEmergencyContact(userId, contactId, patch) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        const target = prefs.emergencyContacts.find((contact) => contact.id === contactId);
        if (!target) {
            throw new common_1.NotFoundException('Emergency contact not found');
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
        return nextContacts.find((contact) => contact.id === contactId);
    }
    async deleteEmergencyContact(userId, contactId) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        const existing = prefs.emergencyContacts.find((contact) => contact.id === contactId);
        if (!existing) {
            throw new common_1.NotFoundException('Emergency contact not found');
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
    async triggerSos(userId, input) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        const event = {
            id: (0, crypto_1.randomUUID)(),
            tripId: input.tripId,
            type: input.type ?? 'sos',
            location: input.location?.lat != null && input.location?.lng != null
                ? { lat: Number(input.location.lat), lng: Number(input.location.lng) }
                : undefined,
            message: input.message,
            status: 'active',
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
    async listSosHistory(userId) {
        const profile = await this.getProfile(userId);
        const prefs = this.normalizeRiderPreferences(profile.preferences);
        return prefs.sosHistory;
    }
    async getWallet(userId) {
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
    async listWalletTransactions(userId, limit = 20, offset = 0) {
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
            status: 'completed',
            description: event.metadata?.description || event.type,
            createdAt: new Date(event.createdAt).getTime(),
            relatedTripId: event.tripId || event.deliveryOrderId || undefined,
        }));
    }
    async listPaymentMethods(userId) {
        await this.getProfile(userId);
        return [
            { id: 'wallet', type: 'wallet', label: 'EVzone Wallet', enabled: true, isDefault: true },
            { id: 'mobile_money', type: 'mobile_money', label: 'Mobile Money', enabled: true, isDefault: false },
            { id: 'card', type: 'card', label: 'Bank Card', enabled: true, isDefault: false },
        ];
    }
    async createPaymentIntent(userId, input) {
        const intent = {
            id: (0, crypto_1.randomUUID)(),
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
    async verifyPaymentIntent(userId, intentId, input) {
        void input;
        const intents = this.paymentIntentStore.get(userId) ?? [];
        const target = intents.find((intent) => intent.id === intentId);
        if (!target) {
            throw new common_1.NotFoundException('Payment intent not found');
        }
        target.status = 'verified';
        target.verifiedAt = Date.now();
        return target;
    }
    async listEligiblePromos(userId) {
        await this.getProfile(userId);
        return [
            { code: 'RIDE10', description: '10% off rides', discountType: 'percent', discountValue: 10 },
            { code: 'WELCOME5', description: 'Flat 5,000 UGX off', discountType: 'flat', discountValue: 5000 },
        ];
    }
    async applyPromo(userId, input) {
        await this.getProfile(userId);
        const upperCode = String(input.code || '').trim().toUpperCase();
        if (!upperCode) {
            throw new common_1.NotFoundException('Promo code is required');
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
    async listCommutes(userId) {
        await this.getProfile(userId);
        return this.commuteStore.get(userId) ?? [];
    }
    async createCommute(userId, input) {
        const commute = {
            id: (0, crypto_1.randomUUID)(),
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
    async patchCommute(userId, commuteId, patch) {
        const commutes = this.commuteStore.get(userId) ?? [];
        const target = commutes.find((commute) => commute.id === commuteId);
        if (!target) {
            throw new common_1.NotFoundException('Commute not found');
        }
        Object.assign(target, patch, { updatedAt: Date.now() });
        return target;
    }
    async deleteCommute(userId, commuteId) {
        const commutes = this.commuteStore.get(userId) ?? [];
        const filtered = commutes.filter((commute) => commute.id !== commuteId);
        if (filtered.length === commutes.length) {
            throw new common_1.NotFoundException('Commute not found');
        }
        this.commuteStore.set(userId, filtered);
        return { deleted: true };
    }
    async createWalletTransfer(userId, input) {
        const wallet = await this.getWallet(userId);
        const transfer = {
            id: (0, crypto_1.randomUUID)(),
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
    async listWalletTransfers(userId) {
        const intents = this.paymentIntentStore.get(userId) ?? [];
        return intents.filter((intent) => intent.serviceType === 'wallet_transfer');
    }
    async listRentals(userId) {
        const records = await this.riderServiceRequestRepo.find({
            where: { riderId: userId, serviceType: 'rental' },
            order: { createdAt: 'DESC' },
        });
        return records.map((record) => this.mapRentalRecord(record));
    }
    async getRentalById(userId, rentalId) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: rentalId, riderId: userId, serviceType: 'rental' },
        });
        if (!record)
            throw new common_1.NotFoundException('Rental booking not found');
        return this.mapRentalRecord(record);
    }
    async createRental(userId, input) {
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
    async patchRental(userId, rentalId, patch) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: rentalId, riderId: userId, serviceType: 'rental' },
        });
        if (!record)
            throw new common_1.NotFoundException('Rental booking not found');
        record.status = typeof patch.status === 'string' ? patch.status : record.status;
        record.payload = { ...(record.payload || {}), ...patch };
        const saved = await this.riderServiceRequestRepo.save(record);
        const mapped = this.mapRentalRecord(saved);
        this.publishRiderServiceEvent(userId, 'rental.updated', mapped);
        return mapped;
    }
    async cancelRental(userId, rentalId, reason) {
        return this.patchRental(userId, rentalId, { status: 'cancelled', cancellationReason: reason });
    }
    async listTours(userId) {
        const records = await this.riderServiceRequestRepo.find({
            where: { riderId: userId, serviceType: 'tour' },
            order: { createdAt: 'DESC' },
        });
        return records.map((record) => this.mapTourRecord(record));
    }
    async getTourById(userId, tourId) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: tourId, riderId: userId, serviceType: 'tour' },
        });
        if (!record)
            throw new common_1.NotFoundException('Tour booking not found');
        return this.mapTourRecord(record);
    }
    async createTour(userId, input) {
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
    async cancelTour(userId, tourId, reason) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: tourId, riderId: userId, serviceType: 'tour' },
        });
        if (!record)
            throw new common_1.NotFoundException('Tour booking not found');
        record.status = 'cancelled';
        record.payload = { ...(record.payload || {}), cancellationReason: reason };
        const saved = await this.riderServiceRequestRepo.save(record);
        const mapped = this.mapTourRecord(saved);
        this.publishRiderServiceEvent(userId, 'tour.updated', mapped);
        return mapped;
    }
    async listAmbulances(userId) {
        const records = await this.riderServiceRequestRepo.find({
            where: { riderId: userId, serviceType: 'ambulance' },
            order: { createdAt: 'DESC' },
        });
        return records.map((record) => this.mapAmbulanceRecord(record));
    }
    async getAmbulanceById(userId, ambulanceId) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: ambulanceId, riderId: userId, serviceType: 'ambulance' },
        });
        if (!record)
            throw new common_1.NotFoundException('Ambulance request not found');
        return this.mapAmbulanceRecord(record);
    }
    async createAmbulance(userId, input) {
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
    async patchAmbulance(userId, ambulanceId, patch) {
        const record = await this.riderServiceRequestRepo.findOne({
            where: { id: ambulanceId, riderId: userId, serviceType: 'ambulance' },
        });
        if (!record)
            throw new common_1.NotFoundException('Ambulance request not found');
        record.status = typeof patch.status === 'string' ? patch.status : record.status;
        record.payload = { ...(record.payload || {}), ...patch };
        const saved = await this.riderServiceRequestRepo.save(record);
        const mapped = this.mapAmbulanceRecord(saved);
        this.publishRiderServiceEvent(userId, 'ambulance.updated', mapped);
        return mapped;
    }
    async cancelAmbulance(userId, ambulanceId, reason) {
        return this.patchAmbulance(userId, ambulanceId, { status: 'cancelled', cancellationReason: reason });
    }
    async listTrips(userId) {
        return this.tripRepo.find({
            where: { riderId: userId },
            order: { updatedAt: 'DESC' },
        });
    }
    async getActiveTrip(userId) {
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
    async getTripById(userId, tripId) {
        const trip = await this.tripRepo.findOne({
            where: { id: tripId, riderId: userId },
        });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        return trip;
    }
    async requestTrip(userId, input) {
        const trip = await this.createRequestedTrip(userId, input);
        const nearbyDrivers = (await this.presenceLocationService?.findNearbyDrivers(input.pickupLat, input.pickupLng, input.radiusMeters ?? 5000)) ?? [];
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
    async updateTripTracking(userId, tripId, patch) {
        const trip = await this.tripRepo.findOne({ where: { id: tripId, riderId: userId } });
        if (!trip) {
            throw new common_1.NotFoundException('Trip not found');
        }
        const nextStatus = this.mapTrackingStatus(patch.status);
        if (nextStatus) {
            trip.status = nextStatus;
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
    async createRequestedTrip(riderId, input) {
        const trip = this.tripRepo.create({
            riderId,
            type: input.type ?? 'ride',
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
    mapTrackingStatus(status) {
        switch (status) {
            case 'assigned':
                return 'driver_assigned';
            case 'driver_en_route':
                return 'driver_arriving';
            case 'arrived':
            case 'in_progress':
            case 'completed':
            case 'cancelled':
                return status;
            default:
                return null;
        }
    }
    mapRentalRecord(record) {
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
    mapTourRecord(record) {
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
    mapAmbulanceRecord(record) {
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
    normalizeRentalStatus(status) {
        if (status === 'active' || status === 'completed' || status === 'cancelled')
            return status;
        return 'upcoming';
    }
    normalizeTourStatus(status) {
        if (status === 'in_progress' || status === 'completed' || status === 'cancelled')
            return status;
        return 'booked';
    }
    normalizeAmbulanceStatus(status) {
        if (status === 'dispatched' || status === 'en_route' || status === 'arrived' || status === 'in_progress' || status === 'completed' || status === 'cancelled') {
            return status;
        }
        return 'requested';
    }
    normalizePriority(priority) {
        if (priority === 'urgent' || priority === 'emergency')
            return priority;
        return 'normal';
    }
    publishRiderServiceEvent(userId, event, data) {
        this.riderRealtimeGateway?.publishToUser(userId, event, data);
        this.riderRealtimeGateway?.publishToUser(userId, 'rider.service.updated', {
            event,
            ...data,
        });
    }
    normalizeRiderPreferences(raw) {
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
    deepMerge(base, patch) {
        const output = { ...base };
        for (const [key, value] of Object.entries(patch)) {
            if (value && typeof value === 'object' && !Array.isArray(value) && typeof output[key] === 'object' && output[key] !== null) {
                output[key] = this.deepMerge(output[key], value);
            }
            else {
                output[key] = value;
            }
        }
        return output;
    }
    mapWalletTransactionType(type) {
        if (type === 'delivery_fare')
            return 'delivery_payment';
        if (type === 'trip_fare')
            return 'ride_payment';
        if (type === 'penalty')
            return 'adjustment';
        if (type === 'bonus' || type === 'tip')
            return 'top_up';
        return 'adjustment';
    }
};
exports.RiderService = RiderService;
exports.RiderService = RiderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rider_profile_entity_1.RiderProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(2, (0, typeorm_1.InjectRepository)(job_offer_entity_1.JobOffer)),
    __param(3, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, typeorm_1.InjectRepository)(wallet_account_entity_1.WalletAccount)),
    __param(6, (0, typeorm_1.InjectRepository)(earnings_ledger_entity_1.EarningsLedger)),
    __param(7, (0, typeorm_1.InjectRepository)(rider_service_request_entity_1.RiderServiceRequest)),
    __param(8, (0, common_1.Optional)()),
    __param(9, (0, common_1.Optional)()),
    __param(10, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        presence_location_service_1.PresenceLocationService,
        realtime_gateway_1.RealtimeGateway,
        scoped_realtime_gateway_1.RiderRealtimeGateway])
], RiderService);
//# sourceMappingURL=rider.service.js.map