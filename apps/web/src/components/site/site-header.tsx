import { buttonVariants } from "@heroui/styles";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { MAIN_NAV } from "./nav-items";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const items = MAIN_NAV.map((item) => ({ href: item.href, label: t(item.key) }));

  return (
    <header className="sticky top-0 z-40 border-line border-b bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-6 lg:h-20">
        <Link href="/" aria-label={t("home")} className="shrink-0 rounded-lg">
          <Logo priority className="h-10 w-auto lg:h-13" />
        </Link>

        <nav aria-label={t("main")} className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3.5 py-2 font-medium text-[0.9375rem] text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
          <Link href="/arma-tu-viaje" className={`${buttonVariants()} hidden sm:inline-flex`}>
            {t("planTrip")}
          </Link>
          <MobileNav items={items} menuLabel={t("menu")} ctaLabel={t("planTrip")} />
        </div>
      </div>
    </header>
  );
}
