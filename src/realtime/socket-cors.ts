function parseSocketCorsOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
    ];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const SOCKET_EFFECTIVE_CORS_ORIGINS = parseSocketCorsOrigins(
  process.env.SOCKET_CORS_ORIGINS || process.env.CORS_ORIGINS,
);
