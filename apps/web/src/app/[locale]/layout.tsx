import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { jsonLd } from "@/lib/json-ld";
import {
  languageAlternates,
  openGraphBase,
  robotsFor,
  SITE_NAME,
  shareImage,
} from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { siteGraphLd } from "@/lib/structured-data";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const robots = robotsFor(false);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s · ${SITE_NAME}` },
    description: t("description"),
    applicationName: SITE_NAME,
    alternates: { canonical: `/${locale}`, languages: languageAlternates("") },
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: `/${locale}`,
      title: t("title"),
      description: t("description"),
      images: [shareImage()],
    },
    twitter: { card: "summary_large_image" },
    ...(robots ? { robots } : {}),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return (
    <html lang={locale} className={`light ${fontVariables}`} data-theme="light">
      <body className="min-h-dvh bg-canvas font-sans text-ink-900">
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapado con jsonLd()
          dangerouslySetInnerHTML={jsonLd(siteGraphLd({ locale, description: t("description") }))}
        />
      </body>
    </html>
  );
}
