import type { ReactNode } from "react";
import { Logo, LogoStacked } from "@/components/brand/logo";

/**
 * Pantallas de acceso del panel (login, 2FA, seguridad).
 * En lg: panel de marca a la izquierda y formulario a la derecha (docs/DESIGN.md §9).
 */
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col items-center justify-between bg-ink-900 p-12 text-center text-white lg:flex xl:p-16">
        <p className="text-eyebrow text-teal-400">Panel de gestión</p>
        <LogoStacked className="h-auto w-[min(26rem,85%)]" />
        <p className="max-w-sm text-white/70">
          Catálogo, leads, propuestas, reservas y operaciones del equipo en un solo lugar.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-8">
        <div className="w-full max-w-[25rem]">
          <div className="mb-12 lg:hidden">
            <Logo className="h-10 w-auto" />
          </div>
          <h1 className="text-display-md text-ink-900">{title}</h1>
          {description && <p className="mt-3 text-ink-500">{description}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
