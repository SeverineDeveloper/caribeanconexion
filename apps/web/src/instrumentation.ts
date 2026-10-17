import * as Sentry from "@sentry/nextjs";

// Sentry solo se activa si hay DSN (en local suele estar vacío).
export async function register() {
  if (!process.env.SENTRY_DSN) return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? "development",
    tracesSampleRate: 0.1,
  });
}

export const onRequestError = Sentry.captureRequestError;
