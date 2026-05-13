# Behavioral Contracts Freeze (Rider / Driver / Fleet / Admin)

This document freezes current frontend behavioral contracts before backend link-up.
The objective is to preserve all runtime behavior while replacing local/mock persistence with API-backed compatibility payloads.

## Contract Scope
- localStorage keys and expected shapes
- side effects triggered by UI interactions/state transitions
- must-not-change acceptance criteria for critical flows

## Rider (rider)
### Critical localStorage keys
- `evzone_auth_user`: `User{id,fullName,email,phone,avatarUrl,provider,role,initials}`
- `evzone_auth_token`: string token (`mock_jwt_token_*` or JWT)
- `evzone_app_data_v1`: persisted `AppState` slices `{ride,delivery,rental,tours,ambulance,sharedLocationState}`
- `themeMode`: `"light"|"dark"`

### Side effects
- Auth session hydration/invalid session purge on app bootstrap.
- Delivery WebSocket toggles `delivery.websocketConnected` and drives live/polling status chip.
- App-wide persisted state writes on reducer updates.
- OSRM/OSM proxy calls affect route rendering and ETA outcomes.

### Must not change
- Sign-in/out UI flow and protection behavior from existing `AuthContext`.
- Local state restoration from `evzone_app_data_v1` without migration breakage.
- Delivery tracking status semantics for WebSocket live indicator.

## Driver (Driver-s-app)
### Critical localStorage keys
- `isLoggedIn`, `evz_auth_user`
- `driver_onboarding_checkpoints`, `driver_document_upload_state`
- `driver_jobs`, `driver_trips`, `driver_active_trip_state`, `driver_active_ride_runtime_state`

### Side effects
- Route guards enforce auth, onboarding, online/offline access and document compliance.
- StoreContext persists large operational state and drives all dashboards/workflows.
- Safety/SOS actions write runtime markers consumed by active trip safety UI.

### Must not change
- Existing route guard redirects and messaging.
- Document-expiry access block behavior for jobs/trips.
- Trip stage transitions and delivery workflow stage gating.

## Fleet (FleetPartnerAPP)
### Critical localStorage keys
- `fleet_partner_auth`
- `drivers`, `vehicles`, `dispatches`, `vehicle_documents`
- `roles`, `branches`, `integrations`, `support_messages`, `notifications`

### Side effects
- Mock login accepts any credentials and seeds authenticated shell.
- CRUD pages mutate local arrays directly and immediately reflect state in tables/forms.
- Settings/compliance updates propagate cross-page through shared keys.

### Must not change
- AppRoutes auth gate behavior and redirects.
- Object field compatibility for drivers/vehicles/dispatch/compliance tables.
- Existing support/notification counters from persisted entries.

## Admin (Rides-Admin)
### Critical localStorage keys
- `evzone_admin_auth`
- `evzone_admin_audit_events`
- `evzone_admin_riders`, `evzone_admin_drivers`, `evzone_admin_companies`
- `approval_history`

### Side effects
- Login sets auth and redirects to requested protected route.
- Console `AuditLog:` bridge persists operational audit events.
- Approvals/pricing/promotions pages append local records used by history/detail pages.

### Must not change
- `isAuthed()` guard behavior and login/logout UX.
- Audit event capture format compatibility.
- Approval history continuity and detail navigation IDs.

## Compatibility Contract Layer Endpoints
- `GET /api/v1/compat/contracts`
- `GET /api/v1/compat/contracts/:appId`
- `GET /api/v1/compat/bootstrap/:appId`
- `POST /api/v1/compat/rider/auth/sign-in`
- `POST /api/v1/compat/driver/auth/sign-in`
- `POST /api/v1/compat/fleet/auth/sign-in`
- `POST /api/v1/compat/admin/auth/sign-in`

These endpoints are intentionally shape-aligned to current frontend local/in-memory contracts so frontend logic can remain unchanged.
