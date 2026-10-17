/**
 * Crea el primer administrador del panel con ADMIN_EMAIL, ADMIN_NAME y ADMIN_PASSWORD.
 * Uso: pnpm admin:create   (no hace nada si el correo ya existe)
 */
import { prisma } from "@cc/db";
import { auth } from "../src/lib/auth/server";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const name = process.env.ADMIN_NAME?.trim() || "Administrador";
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el entorno.");
  process.exit(1);
}

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log(`Ya existe un usuario con ${email}; no se crea otro.`);
} else {
  // Llamado desde el servidor sin cabeceras, createUser no exige sesión de admin.
  await auth.api.createUser({ body: { email, password, name, role: "admin" } });
  console.log(`Administrador ${email} creado. Activa el 2FA en /admin/seguridad al entrar.`);
}

await prisma.$disconnect();
