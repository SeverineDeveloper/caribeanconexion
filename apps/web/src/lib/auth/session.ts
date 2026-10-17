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

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Como requireStaff, pero exige 2FA activo a los administradores. */
export async function requirePanelAccess() {
  const session = await requireStaff();
  if (requiresTwoFactor(session.roles) && !session.user.twoFactorEnabled) {
    redirect("/admin/seguridad");
  }
  return session;
}
