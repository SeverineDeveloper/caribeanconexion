import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { whatsappNumber } from "@/lib/site";
import { Planner } from "./planner";
import { PlannerFromQuery } from "./planner-from-query";

const PATH = "/arma-tu-viaje";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/arma-tu-viaje">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Planner" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PlannerPage({ params }: PageProps<"/[locale]/arma-tu-viaje">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations("Planner");

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={heroPhoto}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />
      <section className="pb-20 lg:pb-28">
        <div className="container-page relative -mt-12 max-w-4xl lg:-mt-20">
          <Reveal>
            <Suspense fallback={<Planner whatsappNumber={whatsappNumber} initial={{}} />}>
              <PlannerFromQuery whatsappNumber={whatsappNumber} />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </>
  );
}
