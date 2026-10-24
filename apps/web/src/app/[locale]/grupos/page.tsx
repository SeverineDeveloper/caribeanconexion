import { Bus, CalendarDays, Sailboat, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import partyBoat from "@/assets/images/excursiones/party-boat.jpg";
import { B2BPage } from "@/components/site/b2b-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/grupos";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/grupos">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "GroupsPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function GroupsPage({ params }: PageProps<"/[locale]/grupos">) {
  const locale = (await params).locale as Locale;
  return (
    <B2BPage
      locale={locale}
      path={PATH}
      namespace="GroupsPage"
      image={partyBoat}
      icons={[UserRound, Bus, CalendarDays, Sailboat]}
      originCode="CC-B2B-GRUPOS"
    />
  );
}
