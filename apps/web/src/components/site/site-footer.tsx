import { buildWhatsAppUrl, formatPhoneDisplay } from "@cc/core";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Link } from "@/i18n/navigation";
import { whatsappNumber } from "@/lib/site";
import { COMPANY_NAV, MAIN_NAV } from "./nav-items";

const LEGAL = [
  { href: "/privacidad", key: "privacy" },
  { href: "/terminos", key: "terms" },
  { href: "/cancelacion", key: "cancellation" },
] as const;

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tWa = await getTranslations("WhatsApp");
  const year = new Date().getFullYear();
  const linkClass = "text-white/75 transition-colors hover:text-white";

  return (
    <footer className="bg-ink-900 text-white/75">
      <div className="container-page grid gap-12 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:pt-20">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="light" />
          <p className="mt-5 max-w-xs">{t("tagline")}</p>
          <p className="mt-3 text-sm text-white/60">{t("zones")}</p>
        </div>

        <FooterColumn title={t("explore")}>
          {MAIN_NAV.filter((i) => i.key !== "contact").map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {tNav(item.key)}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={t("company")}>
          {COMPANY_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {tNav(item.key)}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={t("contact")}>
          <li>
            <a
              href={buildWhatsAppUrl(whatsappNumber, tWa("defaultMessage"), "CC-FOOTER")}
              target="_blank"
              rel="noopener"
              className={`inline-flex items-center gap-2 ${linkClass}`}
            >
              <WhatsAppIcon className="size-5 text-teal-400" />
              {formatPhoneDisplay(whatsappNumber)}
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="container-page">
        {/* pb-28: deja libre la zona del botón flotante de WhatsApp */}
        <div className="flex flex-col gap-6 border-white/10 border-t pt-8 pb-28 text-sm lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-xl text-white/60">{t("priceNote")}</p>
          <div className="flex flex-col gap-3 lg:items-end">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-white/60">
              © {year} Conexión Caribe. {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-sm text-white uppercase tracking-[0.14em]">{title}</p>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}
