"use client";

import { Button, Drawer } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

type Item = { href: string; label: string };

export function MobileNav({
  items,
  menuLabel,
  ctaLabel,
}: {
  items: Item[];
  menuLabel: string;
  ctaLabel: string;
}) {
  // El menú queda abierto solo en la ruta donde se abrió: al navegar (o cambiar de idioma)
  // se cierra solo, aunque el header no se desmonte.
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);

  return (
    <Drawer isOpen={openOn === pathname} onOpenChange={(open) => setOpenOn(open ? pathname : null)}>
      <Button
        variant="ghost"
        isIconOnly
        aria-label={menuLabel}
        className="xl:hidden group-data-[transparent=true]/header:text-white"
      >
        <Menu className="size-6" strokeWidth={1.75} />
      </Button>
      <Drawer.Backdrop variant="blur">
        <Drawer.Content placement="right" className="w-[min(22rem,90vw)]">
          <Drawer.Dialog className="flex h-full flex-col bg-canvas p-6">
            <Drawer.CloseTrigger />
            <Drawer.Header className="pb-6">
              <Drawer.Heading>
                <Logo className="h-9 w-auto" />
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body className="flex flex-1 flex-col gap-8">
              <nav aria-label={menuLabel}>
                <ul className="flex flex-col">
                  {items.map((item) => (
                    <li key={item.href} className="border-line border-b">
                      <Link
                        href={item.href}
                        onClick={() => setOpenOn(null)}
                        className="block py-4 font-display font-semibold text-ink-900 text-xl"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <LocaleSwitcher />
            </Drawer.Body>
            <Drawer.Footer className="pt-6">
              <Link
                href="/arma-tu-viaje"
                onClick={() => setOpenOn(null)}
                className={`${buttonVariants({ size: "lg" })} w-full`}
              >
                {ctaLabel}
              </Link>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
