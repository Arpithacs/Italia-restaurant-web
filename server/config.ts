/**
 * Shared server configuration.
 *
 * Centralises secrets and environment-dependent settings so that every
 * consumer (auth routes, middleware, etc.) uses the same validated values.
 */

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  // In production there is no safe fallback — refuse to start with a weak secret.
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET environment variable is required in production. ' +
        'Generate a strong, random secret (e.g. `openssl rand -hex 32`) and set it before starting the server.',
    );
  }

  // Development / test — fall back to a well-known dev secret but make noise about it.
  console.warn(
    '[config] WARNING: JWT_SECRET is not set. Using insecure development fallback secret. ' +
      'Do NOT deploy without setting a strong JWT_SECRET.',
  );
  return 'dev-only-fallback-secret-DO-NOT-use-in-production';
}

export const JWT_SECRET = resolveJwtSecret();
