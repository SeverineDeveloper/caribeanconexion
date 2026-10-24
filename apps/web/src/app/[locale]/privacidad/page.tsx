import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/site/legal-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/privacidad";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacidad">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "LegalPage" });
  // Sin indexar hasta publicar el texto revisado por un abogado.
  return pageMetadata({
    locale,
    path: PATH,
    title: t("privacy"),
    description: t("pendingText"),
    noindex: true,
  });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacidad">) {
  const locale = (await params).locale as Locale;
  return <LegalPage locale={locale} path={PATH} doc="privacy" />;
}
