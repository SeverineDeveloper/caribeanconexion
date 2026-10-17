import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: "%s · Conexión Caribe" },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={`light ${fontVariables}`} data-theme="light">
      <body className="min-h-dvh bg-canvas font-sans text-ink-900">
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
