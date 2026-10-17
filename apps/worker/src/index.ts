import * as Sentry from "@sentry/node";
import { PgBoss } from "pg-boss";
import { logger } from "./logger";

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? "development",
  });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  logger.fatal("DATABASE_URL no está definida");
  process.exit(1);
}

const boss = new PgBoss(connectionString);
boss.on("error", (error) => {
  logger.error({ err: error }, "pg-boss error");
  Sentry.captureException(error);
});

await boss.start();

// Latido para comprobar que el worker procesa trabajos. Los jobs reales
// (iCal, tipos de cambio, WhatsApp, traducciones) se registran en sus hitos.
const HEARTBEAT = "system.heartbeat";
await boss.createQueue(HEARTBEAT);
await boss.schedule(HEARTBEAT, "*/5 * * * *");
await boss.work(HEARTBEAT, async ([job]) => {
  logger.info({ jobId: job?.id }, "heartbeat");
});

logger.info("worker iniciado");

async function shutdown(signal: string) {
  logger.info({ signal }, "deteniendo worker");
  await boss.stop({ graceful: true, timeout: 20_000 });
  await Sentry.flush(2_000);
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
