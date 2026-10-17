import { requiresTwoFactor } from "@cc/core";
import type { Metadata } from "next";
import { AuthShell } from "@/components/admin/auth-shell";
import { requireStaff } from "@/lib/auth/session";
import { TwoFactorSetup } from "./two-factor-setup";

export const metadata: Metadata = { title: "Seguridad" };

export default async function SecurityPage() {
  const session = await requireStaff();
  const enabled = Boolean(session.user.twoFactorEnabled);
  const mandatory = requiresTwoFactor(session.roles);

  return (
    <AuthShell
      title="Verificación en dos pasos"
      description={
        mandatory && !enabled
          ? "Como administrador, debes activarla antes de usar el panel. Tardas un minuto."
          : "Protege tu cuenta con una app de autenticación como Google Authenticator, 1Password o Authy."
      }
    >
      <TwoFactorSetup enabled={enabled} />
    </AuthShell>
  );
}
