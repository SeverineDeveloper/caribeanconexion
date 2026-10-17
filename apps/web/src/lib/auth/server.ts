import { parseRoles, requiresTwoFactor } from "@cc/core";
import { prisma } from "@cc/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, twoFactor } from "better-auth/plugins";
import { ac, roles } from "./permissions";

// BETTER_AUTH_URL y BETTER_AUTH_SECRET se leen del entorno.
export const auth = betterAuth({
  appName: "Conexión Caribe",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    // Sin registro público: los usuarios del panel los crea un administrador.
    disableSignUp: true,
    minPasswordLength: 12,
  },
  hooks: {
    // El 2FA obligatorio de administradores se exige también en la API (/api/auth/admin/*),
    // no solo en el layout del panel. Las llamadas de servidor sin sesión (scripts) pasan.
    before: createAuthMiddleware(async (ctx) => {
      if (!ctx.path.startsWith("/admin/")) return;
      const session = await getSessionFromCtx(ctx);
      if (!session) return;
      const mustHave2fa = requiresTwoFactor(parseRoles(session.user.role));
      if (mustHave2fa && !session.user.twoFactorEnabled) {
        throw new APIError("FORBIDDEN", {
          message: "Activa la verificación en dos pasos para usar las funciones de administración.",
        });
      }
    }),
  },
  plugins: [
    adminPlugin({ ac, roles, defaultRole: "sales", adminRoles: ["admin"] }),
    twoFactor({ issuer: "Conexión Caribe" }),
    nextCookies(), // debe ir último
  ],
});
