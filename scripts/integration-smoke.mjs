#!/usr/bin/env node

const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000/api/v1").replace(/\/+$/, "");
const now = Date.now();

function log(step, details) {
  const payload = details === undefined ? "" : ` ${JSON.stringify(details)}`;
  console.log(`[smoke] ${step}${payload}`);
}

async function request(path, { method = "GET", token, appId, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (appId) headers["X-App-Id"] = appId;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const raw = await response.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = { raw };
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${method} ${path}: ${JSON.stringify(parsed)}`);
  }

  if (parsed && typeof parsed === "object" && "data" in parsed) {
    return parsed.data;
  }
  return parsed;
}

function uniqueEmail(prefix) {
  return `${prefix}.${now}.${Math.floor(Math.random() * 10000)}@example.com`;
}

async function run() {
  log("base-url", baseUrl);

  await request("/health");
  log("health", "ok");

  for (const appId of ["driver", "rider", "admin", "fleet"]) {
    const flags = await request(`/compat/flags/${appId}`);
    log(`compat-flags:${appId}`, { backendEnabled: Boolean(flags?.backendEnabled) });
  }

  const riderEmail = uniqueEmail("smoke.rider");
  const driverEmail = uniqueEmail("smoke.driver");
  const fleetEmail = uniqueEmail("smoke.fleet");
  const password = "SmokePass123!";

  const riderRegister = await request("/auth/register", {
    method: "POST",
    appId: "rider",
    body: { email: riderEmail, password, roles: ["rider"] },
  });
  const riderToken = riderRegister.accessToken;
  log("auth:rider-register", { email: riderEmail });

  const driverRegister = await request("/auth/register", {
    method: "POST",
    appId: "driver",
    body: { email: driverEmail, password, roles: ["driver"] },
  });
  const driverToken = driverRegister.accessToken;
  log("auth:driver-register", { email: driverEmail });

  const fleetRegister = await request("/auth/register", {
    method: "POST",
    appId: "fleet",
    body: { email: fleetEmail, password, roles: ["fleet_owner"] },
  });
  const fleetToken = fleetRegister.accessToken;
  log("auth:fleet-register", { email: fleetEmail });

  const trip = await request("/riders/me/trips/request", {
    method: "POST",
    token: riderToken,
    appId: "rider",
    body: {
      pickupLabel: "City Square",
      pickupAddress: "Kampala Road",
      pickupLat: 0.3136,
      pickupLng: 32.5811,
      dropoffLabel: "Ntinda",
      dropoffAddress: "Ntinda Main Road",
      dropoffLat: 0.3572,
      dropoffLng: 32.6148,
      routeSummary: "Kampala Road -> Ntinda",
    },
  });
  log("rider:create-trip", { tripId: trip?.id });

  const jobs = await request("/drivers/me/jobs", {
    token: driverToken,
    appId: "driver",
  });
  log("driver:list-jobs", { count: Array.isArray(jobs) ? jobs.length : 0 });

  let acceptedJobId = null;
  if (Array.isArray(jobs) && jobs.length > 0) {
    const accepted = await request(`/drivers/me/jobs/${jobs[0].id}/accept`, {
      method: "POST",
      token: driverToken,
      appId: "driver",
    });
    acceptedJobId = accepted?.id || jobs[0].id;
    log("driver:accept-job", { jobId: acceptedJobId });
  }

  const activeTrip = await request("/drivers/me/trips/active", {
    token: driverToken,
    appId: "driver",
  });
  log("driver:active-trip", { tripId: activeTrip?.id || null, status: activeTrip?.status || null });

  const dispatch = await request("/fleet/dispatches", {
    method: "POST",
    token: fleetToken,
    appId: "fleet",
    body: {
      pickup: "Lugogo",
      dropoff: "Kololo",
      type: "ride",
      notes: "smoke-dispatch",
    },
  });
  log("fleet:create-dispatch", { dispatchId: dispatch?.dispatch?.id || null });

  const fleetDispatches = await request("/fleet/dispatches", {
    token: fleetToken,
    appId: "fleet",
  });
  log("fleet:list-dispatches", { count: Array.isArray(fleetDispatches) ? fleetDispatches.length : 0 });

  const adminCompat = await request("/compat/admin/auth/sign-in", {
    method: "POST",
    appId: "admin",
    body: { email: uniqueEmail("smoke.admin"), password },
  });
  log("admin:compat-sign-in", { role: adminCompat?.role || null });

  const adminTestEmail = process.env.ADMIN_TEST_EMAIL?.trim();
  const adminTestPassword = process.env.ADMIN_TEST_PASSWORD?.trim();
  if (adminTestEmail && adminTestPassword) {
    const adminLogin = await request("/auth/login", {
      method: "POST",
      appId: "admin",
      body: { email: adminTestEmail, password: adminTestPassword },
    });
    const adminToken = adminLogin.accessToken;
    const roles = await request("/admin/roles", {
      token: adminToken,
      appId: "admin",
    });
    log("admin:list-roles", { count: Array.isArray(roles) ? roles.length : 0 });
  } else {
    log("admin:list-roles", "skipped (set ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD to enable)");
  }

  log("done", {
    riderEmail,
    driverEmail,
    fleetEmail,
    acceptedJobId,
    riderTripId: trip?.id || null,
  });
}

run().catch((error) => {
  console.error("[smoke] failed", error instanceof Error ? error.message : error);
  process.exit(1);
});
