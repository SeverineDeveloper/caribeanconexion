"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3 py-2 font-medium 2xl:px-3.5 text-[0.9375rem] transition-colors ${
                active
                  ? "bg-teal-50 text-teal-700 group-data-[transparent=true]/header:bg-white/15 group-data-[transparent=true]/header:text-white"
                  : "text-ink-700 hover:bg-sand-100 hover:text-ink-900 group-data-[transparent=true]/header:text-white/90 group-data-[transparent=true]/header:hover:bg-white/10 group-data-[transparent=true]/header:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
