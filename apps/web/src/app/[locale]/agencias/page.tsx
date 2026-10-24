import { BadgeCheck, Handshake, Luggage, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import saonaVip from "@/assets/images/excursiones/saona-vip.jpg";
import { B2BPage } from "@/components/site/b2b-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/agencias";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/agencias">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "AgenciesPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AgenciesPage({ params }: PageProps<"/[locale]/agencias">) {
  const locale = (await params).locale as Locale;
  return (
    <B2BPage
      locale={locale}
      path={PATH}
      namespace="AgenciesPage"
      image={saonaVip}
      icons={[BadgeCheck, Handshake, Luggage, MapPin]}
      originCode="CC-B2B-AGENCIAS"
    />
  );
}
