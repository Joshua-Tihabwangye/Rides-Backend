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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibilityContractService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
let CompatibilityContractService = class CompatibilityContractService {
    constructor(prisma) {
        this.prisma = prisma;
        this.contracts = [
            {
                appId: 'rider',
                appName: 'EVzone Rider',
                localStorageKeys: [
                    { key: 'evzone_auth_user', shape: 'User{id,fullName,email,phone,avatarUrl,provider,role,initials}', purpose: 'Authenticated user session payload', critical: true },
                    { key: 'evzone_auth_token', shape: 'string (JWT or mock token)', purpose: 'Access token consumed by AuthContext', critical: true },
                    { key: 'evzone_app_data_v1', shape: 'AppState slices {ride,delivery,rental,tours,ambulance,sharedLocationState}', purpose: 'Primary persisted application state', critical: true },
                    { key: 'themeMode', shape: '"light"|"dark"', purpose: 'Theme selection persistence', critical: false },
                    { key: 'evz_has_ordered_ride', shape: '"true"', purpose: 'Ride-order UX hint flag', critical: false },
                    { key: 'user_preferences', shape: 'object', purpose: 'Setup preferences fallback persistence', critical: false },
                ],
                uiSideEffects: [
                    'AuthContext hydrates user+token from localStorage on app mount and clears invalid payloads.',
                    'AppDataContext hydrates complex state from evzone_app_data_v1 and continuously persists selected slices.',
                    'Delivery WebSocket toggles delivery.websocketConnected and alters delivery tracking badge/labels.',
                ],
                mustNotChangeAcceptance: [
                    'Sign-in must still produce a storable user object and token pair compatible with existing AuthContext validation.',
                    'Protected routes must continue to resolve from existing isAuthenticated behavior without requiring UI refactors.',
                    'Delivery tracking must preserve websocketConnected semantics and timeline updates for live/polling indicators.',
                    'Persisted ride/delivery/rental/tour state restore must remain backward-compatible with existing evzone_app_data_v1 shape.',
                ],
                compatibilityEndpoints: [
                    'GET /api/v1/compat/contracts/rider',
                    'GET /api/v1/compat/bootstrap/rider',
                    'POST /api/v1/compat/rider/auth/sign-in',
                ],
            },
            {
                appId: 'driver',
                appName: 'EVzone Driver',
                localStorageKeys: [
                    { key: 'isLoggedIn', shape: '"true"|"false"', purpose: 'Auth gate boolean used by RequireAuth', critical: true },
                    { key: 'evz_auth_user', shape: 'AuthUser{name,initials,email,phone,selectedService}', purpose: 'Current driver account profile', critical: true },
                    { key: 'driver_onboarding_checkpoints', shape: 'OnboardingCheckpointState', purpose: 'Onboarding guard logic', critical: true },
                    { key: 'driver_profile', shape: 'DriverProfile', purpose: 'Profile persistence across onboarding and settings', critical: true },
                    { key: 'driver_jobs', shape: 'Job[]', purpose: 'Current job queue and request cards', critical: true },
                    { key: 'driver_trips', shape: 'TripRecord[]', purpose: 'Trip history and workflow continuity', critical: true },
                    { key: 'driver_document_upload_state', shape: 'DocumentUploadState', purpose: 'Document verification compliance state', critical: true },
                    { key: 'driver_active_trip_state', shape: 'ActiveTripState', purpose: 'Trip lifecycle transitions', critical: true },
                    { key: 'driver_active_ride_runtime_state', shape: 'ActiveRideRuntimeState', purpose: 'Temporary stop + safety runtime', critical: true },
                ],
                uiSideEffects: [
                    'Route guards redirect based on auth, onboarding, online/offline presence, and document compliance state.',
                    'StoreContext persists large operational slices and reseeds mock requests in dev mode.',
                    'Go-online flow optionally requires selfie checkpoint before changing driver presence status.',
                    'Safety and SOS screens write action markers that influence runtime-state-driven UI banners.',
                ],
                mustNotChangeAcceptance: [
                    'Auth redirect behavior for /auth/* and protected /driver/* routes must remain unchanged.',
                    'Document-expiry block must continue preventing job access and show current guard messaging semantics.',
                    'Trip stage transitions (navigate/wait/verify/start/in-progress/completed/cancelled) must preserve existing route mapping.',
                    'Delivery workflow stage progression must remain compatible with current stage names and gating checks.',
                ],
                compatibilityEndpoints: [
                    'GET /api/v1/compat/contracts/driver',
                    'GET /api/v1/compat/bootstrap/driver',
                    'POST /api/v1/compat/driver/auth/sign-in',
                ],
            },
            {
                appId: 'fleet',
                appName: 'EVzone Fleet Partner',
                localStorageKeys: [
                    { key: 'fleet_partner_auth', shape: 'AuthState{isAuthenticated,hasFinishedOnboarding,user}', purpose: 'Primary auth/session state', critical: true },
                    { key: 'drivers', shape: 'DriverProfile[]', purpose: 'Fleet driver CRUD state', critical: true },
                    { key: 'vehicles', shape: 'Vehicle[]', purpose: 'Fleet vehicle CRUD state', critical: true },
                    { key: 'dispatches', shape: 'DispatchRecord[]', purpose: 'Manual dispatch queue state', critical: true },
                    { key: 'vehicle_documents', shape: 'VehicleDocument[]', purpose: 'Vehicle compliance uploads', critical: true },
                    { key: 'notifications', shape: 'Notification[]', purpose: 'Notification center state', critical: false },
                    { key: 'support_messages', shape: 'SupportMessage[]', purpose: 'Support inbox and dashboard counts', critical: false },
                ],
                uiSideEffects: [
                    'Login accepts any credentials in mock mode and routes to dashboard with persisted role.',
                    'Numerous operational pages read/write direct localStorage arrays (drivers, vehicles, dispatch, rentals, tours).',
                    'Settings and compliance modules mutate local collections and immediately re-render dependent lists.',
                    'Theme/language context updates persist and trigger global app shell visual updates.',
                ],
                mustNotChangeAcceptance: [
                    'Current auth onboarding gate behavior must continue with no route changes required in AppRoutes.',
                    'Drivers/vehicles/dispatch list pages must keep reading compatible array shapes and IDs.',
                    'Vehicle document/compliance flows must preserve existing local object field names used by forms/tables.',
                    'Support and notification counts must keep updating from persisted entries without UI contract change.',
                ],
                compatibilityEndpoints: [
                    'GET /api/v1/compat/contracts/fleet',
                    'GET /api/v1/compat/bootstrap/fleet',
                    'POST /api/v1/compat/fleet/auth/sign-in',
                ],
            },
            {
                appId: 'admin',
                appName: 'EVzone Rides Admin',
                localStorageKeys: [
                    { key: 'evzone_admin_auth', shape: 'AuthUser{name,email,role}', purpose: 'Admin authentication gate state', critical: true },
                    { key: 'evzone_admin_color_mode', shape: '"light"|"dark"', purpose: 'Theme persistence', critical: false },
                    { key: 'evzone_admin_audit_events', shape: 'AuditEvent[]', purpose: 'Audit log page data source', critical: true },
                    { key: 'evzone_admin_riders', shape: 'RiderRecord[]', purpose: 'Rider management source', critical: true },
                    { key: 'evzone_admin_drivers', shape: 'DriverRecord[]', purpose: 'Driver management source', critical: true },
                    { key: 'evzone_admin_companies', shape: 'CompanyRecord[]', purpose: 'Global search + company modules', critical: true },
                    { key: 'approval_history', shape: 'ApprovalHistory[]', purpose: 'Approvals history continuity', critical: true },
                ],
                uiSideEffects: [
                    'Sign-in sets evzone_admin_auth and redirects to remembered destination route.',
                    'Console AuditLog bridge captures specific console messages and persists them as audit events.',
                    'Approvals/pricing/promotions pages append local history/rules and drive cross-page visibility.',
                    'Admin shell navigation and global search depend on stable object IDs and entity fields.',
                ],
                mustNotChangeAcceptance: [
                    'Admin login/logout flow must preserve existing isAuthed() behavior and route guard decisions.',
                    'Audit log ingestion must remain compatible with current AuditLog console event bridge format.',
                    'Approvals dashboard/history/detail should preserve existing local history shape and ordering expectations.',
                    'Driver/rider/company lists must keep current keys used by detail page routes and global search.',
                ],
                compatibilityEndpoints: [
                    'GET /api/v1/compat/contracts/admin',
                    'GET /api/v1/compat/bootstrap/admin',
                    'POST /api/v1/compat/admin/auth/sign-in',
                ],
            },
        ];
        this.canonicalContracts = [
            {
                appId: 'rider',
                rest: {
                    profile: '/api/v1/riders/me/profile',
                    activeTrip: '/api/v1/riders/me/trips/active',
                    tripHistory: '/api/v1/riders/me/trips/history',
                    requestTrip: '/api/v1/riders/me/trips/request',
                    updateTripTracking: '/api/v1/riders/me/trips/:tripId/tracking',
                },
                realtime: {
                    namespace: '/rider',
                    path: '/socket.io',
                },
                notes: [
                    'Use canonical rider trip request/tracking endpoints instead of legacy /trips and /trips/:id.',
                ],
            },
            {
                appId: 'driver',
                rest: {
                    verifyRider: '/api/v1/drivers/me/trips/:tripId/verify-rider',
                    tempStopRequest: '/api/v1/drivers/me/trips/:tripId/temporary-stop/request',
                    tempStopRespond: '/api/v1/drivers/me/trips/:tripId/temporary-stop/respond',
                    tempStopResume: '/api/v1/drivers/me/trips/:tripId/temporary-stop/resume',
                    tripSos: '/api/v1/drivers/me/trips/:tripId/sos',
                    locationHeartbeat: '/api/v1/locations/heartbeat',
                    earningsEvents: '/api/v1/drivers/me/earnings/events',
                    cashoutRequests: '/api/v1/drivers/me/cashout/requests',
                },
                realtime: {
                    namespace: '/driver',
                    path: '/socket.io',
                },
            },
            {
                appId: 'fleet',
                rest: {
                    profile: '/api/v1/fleet/me/profile',
                    branches: '/api/v1/fleet/branches',
                    drivers: '/api/v1/fleet/drivers',
                    vehicles: '/api/v1/fleet/vehicles',
                    dispatches: '/api/v1/fleet/dispatches',
                },
                realtime: {
                    namespace: '/fleet',
                    path: '/socket.io',
                },
            },
            {
                appId: 'admin',
                rest: {
                    featureFlags: '/api/v1/admin/system/flags',
                    updateFeatureFlag: '/api/v1/admin/system/flags/:flagKey',
                    auditLog: '/api/v1/admin/system/audit-log',
                    riskCases: '/api/v1/admin/risk/cases',
                    reviewApproval: '/api/v1/admin/approvals/:approvalId',
                },
                realtime: {
                    namespace: '/admin',
                    path: '/socket.io',
                },
            },
        ];
    }
    getContracts() {
        return this.contracts;
    }
    getCanonicalContracts() {
        return this.canonicalContracts;
    }
    getContract(appId) {
        const contract = this.contracts.find((item) => item.appId === appId);
        if (!contract) {
            throw new common_1.NotFoundException(`Compatibility contract not found for app: ${appId}`);
        }
        return contract;
    }
    getCanonicalContract(appId) {
        const contract = this.canonicalContracts.find((item) => item.appId === appId);
        if (!contract) {
            throw new common_1.NotFoundException(`Canonical contract not found for app: ${appId}`);
        }
        return contract;
    }
    getBootstrap(appId) {
        switch (appId) {
            case 'rider':
                return {
                    appId,
                    storageSnapshot: {
                        evzone_auth_user: {
                            id: 'usr_001',
                            fullName: 'Rachel Zoe',
                            email: 'rachel@example.com',
                            phone: '+256700000011',
                            avatarUrl: null,
                            provider: 'email',
                            role: 'rider',
                            initials: 'RZ',
                        },
                        evzone_auth_token: 'mock_jwt_token_rider_001',
                        evzone_app_data_v1: {
                            ride: { status: 'idle', request: { origin: null, destination: null, stops: [] } },
                            delivery: { activeOrder: null, orders: [], websocketConnected: false },
                            rental: { activeBooking: null },
                            tours: { activeBooking: null },
                            ambulance: { activeRequest: null },
                            sharedLocationState: { enabled: false, recipients: [] },
                        },
                        themeMode: 'light',
                    },
                };
            case 'driver':
                return {
                    appId,
                    storageSnapshot: {
                        isLoggedIn: 'true',
                        evz_auth_user: {
                            name: 'Joshua Tihabwangye',
                            initials: 'JT',
                            email: 'joshua@example.com',
                            phone: '+256700000001',
                            selectedService: 'driver',
                        },
                        driver_onboarding_checkpoints: {
                            roleSelected: true,
                            documentsVerified: false,
                            identityVerified: false,
                            vehicleReady: true,
                            emergencyContactReady: false,
                            trainingCompleted: false,
                        },
                        driver_jobs: [],
                        driver_trips: [],
                        driver_document_upload_state: {
                            id: { expiryDate: '', front: { status: 'Missing' }, back: { status: 'Missing' } },
                        },
                        driver_active_trip_state: { tripId: null, stage: 'idle', status: 'idle' },
                    },
                };
            case 'fleet':
                return {
                    appId,
                    storageSnapshot: {
                        fleet_partner_auth: {
                            isAuthenticated: true,
                            hasFinishedOnboarding: true,
                            user: {
                                email: 'fleet@example.com',
                                role: 'FleetOwner',
                                name: 'Fleet Owner',
                            },
                        },
                        drivers: [],
                        vehicles: [],
                        dispatches: [],
                        vehicle_documents: [],
                        notifications: [],
                        support_messages: [],
                    },
                };
            case 'admin':
                return {
                    appId,
                    storageSnapshot: {
                        evzone_admin_auth: {
                            name: 'Ops Admin',
                            email: 'admin@example.com',
                            role: 'super-admin',
                        },
                        evzone_admin_color_mode: 'light',
                        evzone_admin_audit_events: [],
                        evzone_admin_riders: [],
                        evzone_admin_drivers: [],
                        evzone_admin_companies: [],
                        approval_history: [],
                    },
                };
            default:
                throw new common_1.NotFoundException(`Unsupported app bootstrap: ${appId}`);
        }
    }
    async getRuntimeFlags(appId) {
        const flagKey = `${appId}_backend_enabled`;
        const flags = await this.prisma.featureFlag.findMany({
            where: {
                OR: [{ scope: appId }, { scope: 'global' }],
            },
        });
        const backendFlag = flags.find((item) => item.key === flagKey);
        return {
            appId,
            backendEnabled: backendFlag?.enabled ?? false,
            flags,
        };
    }
    signInCompat(appId, input) {
        const normalizedName = input.fullName?.trim() || input.email.split('@')[0] || 'User';
        if (appId === 'rider') {
            return {
                user: {
                    id: `usr_${(0, crypto_1.randomUUID)().slice(0, 8)}`,
                    fullName: normalizedName,
                    email: input.email,
                    phone: '+256700000000',
                    avatarUrl: null,
                    provider: 'email',
                    role: 'rider',
                    initials: normalizedName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'EV',
                },
                token: `mock_jwt_token_${(0, crypto_1.randomUUID)().slice(0, 10)}`,
            };
        }
        if (appId === 'driver') {
            return {
                isLoggedIn: true,
                user: {
                    name: normalizedName,
                    initials: normalizedName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join('') || 'EV',
                    email: input.email,
                    phone: '+256700000001',
                    selectedService: input.selectedService || 'driver',
                },
            };
        }
        if (appId === 'fleet') {
            return {
                isAuthenticated: true,
                hasFinishedOnboarding: true,
                user: {
                    email: input.email,
                    role: 'FleetOwner',
                    name: normalizedName,
                },
            };
        }
        if (appId === 'admin') {
            return {
                name: normalizedName,
                email: input.email,
                role: 'super-admin',
            };
        }
        throw new common_1.NotFoundException(`Unsupported compat sign-in app: ${appId}`);
    }
};
exports.CompatibilityContractService = CompatibilityContractService;
exports.CompatibilityContractService = CompatibilityContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompatibilityContractService);
//# sourceMappingURL=compatibility.service.js.map