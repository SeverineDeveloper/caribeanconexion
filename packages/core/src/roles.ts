/** Roles internos del panel. Una persona puede tener varios (equipo de 1–2 personas). */
export const ROLES = ["admin", "sales", "operations"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrador",
  sales: "Ventas",
  operations: "Operaciones",
};

function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

/** Better Auth guarda varios roles como texto separado por comas ("admin,sales"). */
export function parseRoles(raw: string | null | undefined): Role[] {
  if (!raw) return [];
  const roles = raw
    .split(",")
    .map((r) => r.trim())
    .filter(isRole);
  return [...new Set(roles)];
}

/** Cualquier rol interno da acceso al panel. */
export function isStaff(roles: readonly Role[]): boolean {
  return roles.length > 0;
}

/** El 2FA es obligatorio para administradores. */
export function requiresTwoFactor(roles: readonly Role[]): boolean {
  return roles.includes("admin");
}
