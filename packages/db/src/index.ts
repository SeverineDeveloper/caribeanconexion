import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

export * from "./generated/prisma/client";

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

// En desarrollo, Next.js recarga módulos: se reutiliza una sola instancia por proceso.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  globalForPrisma.prisma ??= createClient();
  return globalForPrisma.prisma;
}

/**
 * Cliente perezoso: se crea en el primer uso, no al importar. Así `next build`
 * (que importa las rutas para analizarlas) no necesita DATABASE_URL.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
