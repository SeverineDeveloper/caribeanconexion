import { prisma } from "@cc/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
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
  plugins: [
    adminPlugin({ ac, roles, defaultRole: "sales", adminRoles: ["admin"] }),
    twoFactor({ issuer: "Conexión Caribe" }),
    nextCookies(), // debe ir último
  ],
});
