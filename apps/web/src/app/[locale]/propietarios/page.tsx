import { CalendarDays, Globe, KeyRound, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { B2BPage } from "@/components/site/b2b-page";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/propietarios";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/propietarios">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "OwnersPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function OwnersPage({ params }: PageProps<"/[locale]/propietarios">) {
  const locale = (await params).locale as Locale;
  return (
    <B2BPage
      locale={locale}
      path={PATH}
      namespace="OwnersPage"
      image={heroPhoto}
      icons={[Globe, KeyRound, ShieldCheck, CalendarDays]}
      originCode="CC-B2B-PROPIETARIOS"
    />
  );
}
