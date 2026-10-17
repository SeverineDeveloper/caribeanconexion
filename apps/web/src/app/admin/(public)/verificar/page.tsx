import type { Metadata } from "next";
import { AuthShell } from "@/components/admin/auth-shell";
import { VerifyTwoFactorForm } from "./verify-form";

export const metadata: Metadata = { title: "Verificación en dos pasos" };

export default function VerifyTwoFactorPage() {
  return (
    <AuthShell
      title="Verificación en dos pasos"
      description="Escribe el código de 6 dígitos que muestra tu app de autenticación."
    >
      <VerifyTwoFactorForm />
    </AuthShell>
  );
}
