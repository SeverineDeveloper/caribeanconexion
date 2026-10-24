import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/site/legal-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/terminos";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/terminos">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "LegalPage" });
  // Sin indexar hasta publicar el texto revisado por un abogado.
  return pageMetadata({
    locale,
    path: PATH,
    title: t("terms"),
    description: t("pendingText"),
    noindex: true,
  });
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terminos">) {
  const locale = (await params).locale as Locale;
  return <LegalPage locale={locale} path={PATH} doc="terms" />;
}
