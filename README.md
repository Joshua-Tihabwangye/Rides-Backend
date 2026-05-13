# EVzone Workspace Backend (NestJS)

Shared modular NestJS backend aligned with `/api/v1` endpoint contracts.
Canonical workspace location is `/home/developer/Projects/backend`.

## Run

```bash
cd /home/developer/Projects/backend
npm install
npm run start:dev
```

## Notes

- Current implementation uses in-memory persistence for rapid integration.
- Existing Express-style compatibility routes are exposed under `/drivers/:driverId/*` and marked deprecated.
- Workspace repository registry is available at `GET /api/v1/workspace/repos` and configured via `workspace.repos.json`.
# Rides-Backend
