import { isStaff, parseRoles, requiresTwoFactor } from "@cc/core";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./server";

/** Sesión del panel, o null si no hay sesión o el usuario no es personal interno. */
export const getStaffSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.banned) return null;
  const roles = parseRoles(session.user.role);
  if (!isStaff(roles)) return null;
  return { ...session, roles };
});

/**
 * Sesión interna SIN exigir 2FA. Solo para la página donde se activa el 2FA (/admin/seguridad).
 * Para todo lo demás usar requirePanelAccess.
 */
export async function requireStaff() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Como requireStaff, pero exige 2FA activo a los administradores. Toda página, server action
 * y route handler del panel debe pasar por aquí, no solo los layouts.
 */
export async function requirePanelAccess() {
  const session = await requireStaff();
  if (requiresTwoFactor(session.roles) && !session.user.twoFactorEnabled) {
    redirect("/admin/seguridad");
  }
  return session;
}
