import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { whatsappNumber } from "@/lib/site";
import { Planner } from "./planner";

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

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PlannerPage({
  params,
  searchParams,
}: PageProps<"/[locale]/arma-tu-viaje">) {
  const locale = (await params).locale as Locale;
  const query = await searchParams;
  const t = await getTranslations("Planner");
  const travelers = Number.parseInt(first(query.viajeros) ?? "", 10);

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
            <Planner
              whatsappNumber={whatsappNumber}
              initial={{
                zone: first(query.zona),
                arrival: first(query.llegada),
                departure: first(query.salida),
                travelers: Number.isFinite(travelers) ? travelers : undefined,
              }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
