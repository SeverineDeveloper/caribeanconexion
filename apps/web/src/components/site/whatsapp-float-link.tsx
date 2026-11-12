"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

/**
 * Enlace flotante de WhatsApp. Por debajo de lg se esconde mientras un elemento con
 * `data-wa-float-avoid` (formularios, botones a todo el ancho) pasa por la franja inferior
 * de la pantalla, que es donde vive el botón.
 */
export function WhatsAppFloatLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: el layout no se desmonta al navegar; pathname vuelve a buscar los elementos de la página nueva
  useEffect(() => {
    setHidden(false);
    const targets = document.querySelectorAll("[data-wa-float-avoid]");
    if (targets.length === 0) return;
    const mobile = window.matchMedia("(width < 64rem)");
    const inBand = new Set<Element>();
    const update = () => setHidden(mobile.matches && inBand.size > 0);
    // Solo cuenta el 15 % inferior de la pantalla.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        update();
      },
      { rootMargin: "-85% 0px 0px 0px" },
    );
    for (const target of targets) observer.observe(target);
    mobile.addEventListener("change", update);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", update);
    };
  }, [pathname]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      inert={hidden}
      data-hidden={hidden}
      className={`${className} transition duration-300 data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-4 data-[hidden=true]:opacity-0`}
    >
      {children}
    </a>
  );
}
