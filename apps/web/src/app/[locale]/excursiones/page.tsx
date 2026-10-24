import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import saonaClasica from "@/assets/images/excursiones/saona-clasica.jpg";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ExcursionsExplorer } from "@/components/site/excursions-explorer";
import { Faq, type FaqItem } from "@/components/site/faq";
import { MoreExperiences } from "@/components/site/more-experiences";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton, whatsappHref } from "@/components/site/whatsapp-button";
import { EXCURSION_CATEGORIES, EXCURSIONS, excursionOriginCode } from "@/content/excursions";
import type { Locale } from "@/i18n/routing";
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

  const items = EXCURSIONS.map((excursion) => {
    const title = t(`Excursions.items.${excursion.key}.title`);
    return {
      slug: excursion.slug,
      category: excursion.category,
      categoryLabel: t(`Excursions.categories.${excursion.category}`),
      image: excursion.image,
      title,
      tagline: t(`Excursions.items.${excursion.key}.tagline`),
      detail: t(`Excursions.items.${excursion.key}.detail`),
      whatsappUrl: whatsappHref(
        t("Excursions.waMessage", { name: title }),
        excursionOriginCode(excursion.slug),
      ),
    };
  });
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
        image={saonaClasica}
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
              ctaLabel={t("Excursions.cta")}
              countLabel={countLabel}
            />
          </Reveal>
          <Reveal className="mt-12 lg:mt-16">
            <MoreExperiences />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-sand-100">
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
