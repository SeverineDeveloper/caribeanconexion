import { requireStaff } from "@/lib/auth/session";

/** Todo lo que cuelga de aquí exige sesión de personal interno. */
export default async function SecureLayout({ children }: LayoutProps<"/admin">) {
  await requireStaff();
  return children;
}
