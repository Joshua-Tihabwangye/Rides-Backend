const DEV_FALLBACK_SECRET = 'dev-insecure-change-me';

export function getJwtSecret(): string {
  const configured = process.env.JWT_SECRET?.trim();
  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }

  return DEV_FALLBACK_SECRET;
}
