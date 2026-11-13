import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { GuideCard } from "@/components/site/guide-card";
import { JsonLdScript } from "@/components/site/json-ld-script";
import { PageHero } from "@/components/site/page-hero";
import { GUIDES, guidePath } from "@/content/guides";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { pageUrl } from "@/lib/site";
import { organizationRef, websiteRef } from "@/lib/structured-data";

const PATH = "/guias";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guias">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "GuidesPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function GuidesPage({ params }: PageProps<"/[locale]/guias">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "GuidesPage" });

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl(locale, PATH)}#webpage`,
    url: pageUrl(locale, PATH),
    name: t("title"),
    description: t("metaDescription"),
    inLanguage: locale,
    isPartOf: websiteRef,
    publisher: organizationRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: GUIDES.map((guide, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: pageUrl(locale, guidePath(guide.slug)),
        name: guide.text[locale].title,
      })),
    },
  };

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={GUIDES[0]?.cover}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      />

      <section className="section-y">
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {GUIDES.map((guide) => (
              <RevealItem key={guide.slug}>
                <GuideCard
                  href={guidePath(guide.slug)}
                  image={guide.cover}
                  label={t("guide")}
                  title={guide.text[locale].title}
                  description={guide.text[locale].description}
                  cta={t("readGuide")}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand originCode="CC-GUIAS-CTA" />
      <JsonLdScript data={collectionLd} />
    </>
  );
}
