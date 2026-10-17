import { prisma } from "@cc/db";

export const dynamic = "force-dynamic";

/** Usado por Docker/Caddy y el monitor de uptime. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "error", db: "unreachable" }, { status: 503 });
  }
}
