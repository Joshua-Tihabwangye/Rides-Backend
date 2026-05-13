# Canonical Routes v1

This file defines the canonical REST and realtime routes shared by the four frontend apps.

Source endpoint:
- `GET /api/v1/compat/canonical-routes`
- `GET /api/v1/compat/canonical-routes/:appId`

## Rider
- `GET /api/v1/riders/me/profile`
- `GET /api/v1/riders/me/trips/active`
- `GET /api/v1/riders/me/trips/history`
- `POST /api/v1/riders/me/trips/request`
- `PATCH /api/v1/riders/me/trips/:tripId/tracking`
- Realtime namespace: `/rider` (path `/socket.io`)

## Driver
- `POST /api/v1/drivers/me/trips/:tripId/verify-rider`
- `POST /api/v1/drivers/me/trips/:tripId/temporary-stop/request`
- `POST /api/v1/drivers/me/trips/:tripId/temporary-stop/respond`
- `POST /api/v1/drivers/me/trips/:tripId/temporary-stop/resume`
- `POST /api/v1/drivers/me/trips/:tripId/sos`
- `POST /api/v1/locations/heartbeat`
- `GET /api/v1/drivers/me/earnings/events`
- `GET|POST /api/v1/drivers/me/cashout/requests`
- Realtime namespace: `/driver` (path `/socket.io`)

## Fleet
- `GET /api/v1/fleet/me/profile`
- `GET /api/v1/fleet/branches`
- `GET /api/v1/fleet/drivers`
- `GET /api/v1/fleet/vehicles`
- `GET /api/v1/fleet/dispatches`
- Realtime namespace: `/fleet` (path `/socket.io`)

## Admin
- `GET /api/v1/admin/system/flags`
- `PATCH /api/v1/admin/system/flags/:flagKey`
- `GET /api/v1/admin/system/audit-log`
- `GET /api/v1/admin/risk/cases`
- `PATCH /api/v1/admin/approvals/:approvalId`
- Realtime namespace: `/admin` (path `/socket.io`)
