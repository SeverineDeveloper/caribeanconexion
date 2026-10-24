import { buttonVariants } from "@heroui/styles";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { HeaderShell } from "./header-shell";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { MAIN_NAV } from "./nav-items";
import { NavLinks } from "./nav-links";

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const items = MAIN_NAV.map((item) => ({ href: item.href, label: t(item.key) }));

  return (
    <HeaderShell>
      <div className="container-page flex h-16 items-center gap-6 lg:h-20">
        <Link href="/" aria-label={t("home")} className="shrink-0 rounded-lg">
          <span className="group-data-[transparent=true]/header:hidden">
            <Logo priority className="h-10 w-auto lg:h-13" />
          </span>
          <span className="hidden group-data-[transparent=true]/header:inline">
            <Logo on="dark" priority className="h-10 w-auto lg:h-13" />
          </span>
        </Link>

        <nav aria-label={t("main")} className="hidden flex-1 justify-center lg:flex">
          <NavLinks items={items} />
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
    </HeaderShell>
  );
}
