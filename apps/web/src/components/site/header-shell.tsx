"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * En el inicio el header es transparente sobre el video y se vuelve blanco al hacer scroll.
 * Los hijos reaccionan con variantes `group-data-[transparent=true]/header:`.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const transparent = overlay && !scrolled;

  return (
    <header
      data-transparent={transparent ? "true" : "false"}
      className="group/header sticky top-0 z-40 border-b transition-colors duration-300 data-[transparent=false]:border-line data-[transparent=false]:bg-white/90 data-[transparent=false]:backdrop-blur-md data-[transparent=true]:border-transparent data-[transparent=true]:bg-transparent"
    >
      {children}
    </header>
  );
}
