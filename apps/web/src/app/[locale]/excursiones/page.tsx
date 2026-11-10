import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ExcursionsExplorer } from "@/components/site/excursions-explorer";
import { Faq, type FaqItem } from "@/components/site/faq";
import { MoreExperiences } from "@/components/site/more-experiences";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { EXCURSION_CATEGORIES, EXCURSIONS } from "@/content/excursions";
import type { Locale } from "@/i18n/routing";
import { excursionCards } from "@/lib/excursion-cards";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/excursiones";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/excursiones">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "ExcursionsPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ExcursionsPage({ params }: PageProps<"/[locale]/excursiones">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();

  const items = await excursionCards(locale);
  const countLabel = Object.fromEntries(
    Array.from({ length: items.length + 1 }, (_, n) => [
      n,
      t("ExcursionsPage.count", { count: n }),
    ]),
  );

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={EXCURSIONS.find((e) => e.slug === "yate-de-lujo")?.cover}
        eyebrow={t("ExcursionsPage.eyebrow")}
        title={t("ExcursionsPage.title")}
        lead={t("ExcursionsPage.lead")}
      >
        <WhatsAppButton onDark message={t("WhatsApp.defaultMessage")} originCode="CC-EXC-HERO">
          {t("Common.askWhatsapp")}
        </WhatsAppButton>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <ExcursionsExplorer
              items={items}
              categories={EXCURSION_CATEGORIES.map((id) => ({
                id,
                label: t(`Excursions.categories.${id}`),
              }))}
              allLabel={t("Excursions.all")}
              filterLabel={t("ExcursionsPage.filterLabel")}
              countLabel={countLabel}
            />
          </Reveal>
          <Reveal className="mt-12 lg:mt-16">
            <MoreExperiences />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-lagoon">
        <div className="container-page">
          <Reveal>
            <Faq title={t("Common.faqTitle")} items={t.raw("ExcursionsPage.faq") as FaqItem[]} />
          </Reveal>
        </div>
      </section>

      <CtaBand originCode="CC-EXC-CTA" />
    </>
  );
}
