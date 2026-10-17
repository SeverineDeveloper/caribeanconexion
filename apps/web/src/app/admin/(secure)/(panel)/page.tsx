import { BookOpen, CalendarRange, Inbox, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { requirePanelAccess } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Inicio" };

const UPCOMING: { milestone: string; icon: LucideIcon; title: string; text: string }[] = [
  {
    milestone: "M1",
    icon: BookOpen,
    title: "Catálogo",
    text: "Alojamientos, traslados, excursiones y servicios, con fotos, precios y traducciones.",
  },
  {
    milestone: "M2",
    icon: Inbox,
    title: "Web pública y leads",
    text: "Formularios de la web y botones de WhatsApp que crean leads en el panel.",
  },
  {
    milestone: "M3",
    icon: CalendarRange,
    title: "Reservas y pagos",
    text: "Checkout con PayPal, calendarios iCal y registro de anticipos.",
  },
];

export default async function DashboardPage() {
  const session = await requirePanelAccess();
  const firstName = session.user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        title={`Hola, ${firstName}`}
        description="Este es el panel de gestión de Conexión Caribe. Los módulos se irán activando a medida que avance cada hito."
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {UPCOMING.map((item) => (
          <li
            key={item.milestone}
            className="flex flex-col rounded-card border border-line bg-white p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <item.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="rounded-full bg-sand-100 px-2.5 py-1 font-semibold text-ink-700 text-xs">
                {item.milestone} · Pronto
              </span>
            </div>
            <h2 className="mt-5 font-sans font-semibold text-ink-900 text-lg">{item.title}</h2>
            <p className="mt-2 text-ink-500">{item.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
