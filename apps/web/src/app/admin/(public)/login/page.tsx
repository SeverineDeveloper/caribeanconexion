import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/admin/auth-shell";
import { getStaffSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default async function LoginPage() {
  if (await getStaffSession()) redirect("/admin");

  return (
    <AuthShell title="Iniciar sesión" description="Accede con tu cuenta del equipo.">
      <LoginForm />
    </AuthShell>
  );
}
