import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

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
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 text-white lg:flex xl:p-16">
        <Logo tone="light" />
        <div className="relative max-w-md">
          <p className="text-eyebrow text-teal-400">Panel de gestión</p>
          <p className="mt-4 text-display-lg">Cada viaje, organizado en un solo lugar.</p>
          <p className="mt-5 text-lead text-white/75">
            Catálogo, leads, propuestas, reservas y operaciones del equipo de Conexión Caribe.
          </p>
        </div>
        <p className="relative text-sm text-white/50">Tu viaje. Nuestra conexión.</p>
        <svg
          aria-hidden="true"
          viewBox="0 0 600 260"
          className="pointer-events-none absolute right-0 bottom-0 w-full max-w-none"
        >
          <circle cx="500" cy="70" r="40" fill="#C9A227" />
          <path
            d="M0 190c75-40 150-40 225 0s150 40 225 0 110-36 150-24"
            fill="none"
            stroke="#0FB5B0"
            strokeOpacity="0.45"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M60 240c65-34 130-34 195 0s130 34 195 0 100-30 150-20"
            fill="none"
            stroke="#0FB5B0"
            strokeOpacity="0.2"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>
      </aside>

      <main className="flex items-center justify-center bg-canvas px-5 py-12 sm:px-8">
        <div className="w-full max-w-[25rem]">
          <div className="mb-12 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-display-md text-ink-900">{title}</h1>
          {description && <p className="mt-3 text-ink-500">{description}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
