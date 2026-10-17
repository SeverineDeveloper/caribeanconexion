import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

/**
 * Permisos por recurso. Los nombres de rol coinciden con ROLES de @cc/core.
 * Solo el administrador cambia precios y configuración (documento base, sección 6).
 */
const statement = {
  ...defaultStatements,
  catalog: ["read", "create", "update", "publish", "delete"],
  prices: ["update"],
  leads: ["read", "manage"],
  trips: ["read", "manage", "operate"],
  settings: ["update"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  ...adminAc.statements,
  catalog: ["read", "create", "update", "publish", "delete"],
  prices: ["update"],
  leads: ["read", "manage"],
  trips: ["read", "manage", "operate"],
  settings: ["update"],
});

export const sales = ac.newRole({
  catalog: ["read", "create", "update", "publish"],
  leads: ["read", "manage"],
  trips: ["read", "manage"],
});

export const operations = ac.newRole({
  catalog: ["read"],
  trips: ["read", "operate"],
});

export const roles = { admin, sales, operations };
