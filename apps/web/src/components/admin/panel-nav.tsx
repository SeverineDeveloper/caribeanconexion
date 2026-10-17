"use client";

import {
  BookOpen,
  CalendarRange,
  Inbox,
  LayoutDashboard,
  type LucideIcon,
  Settings,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Los módulos se activan según avanzan los hitos del plan (M1: catálogo, M2: leads…).
const NAV: { href: string; label: string; icon: LucideIcon; ready: boolean }[] = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, ready: true },
  { href: "/admin/catalogo", label: "Catálogo", icon: BookOpen, ready: false },
  { href: "/admin/leads", label: "Leads", icon: Inbox, ready: false },
  { href: "/admin/viajes", label: "Viajes", icon: CalendarRange, ready: false },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, ready: false },
];

export function PanelNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Panel">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const content = (
            <>
              <item.icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {!item.ready && (
                <span className="hidden rounded-full bg-sand-100 px-2 py-0.5 font-medium text-[0.6875rem] text-ink-500 lg:inline">
                  Pronto
                </span>
              )}
            </>
          );
          const base =
            "flex h-10 items-center gap-3 whitespace-nowrap rounded-xl px-3 font-medium text-[0.9375rem]";
          return (
            <li key={item.href}>
              {item.ready ? (
                <NextLink
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${base} transition-colors ${
                    active
                      ? "bg-teal-50 text-teal-700"
                      : "text-ink-700 hover:bg-sand-100 hover:text-ink-900"
                  }`}
                >
                  {content}
                </NextLink>
              ) : (
                <span className={`${base} cursor-default text-ink-500/70`} aria-disabled="true">
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
