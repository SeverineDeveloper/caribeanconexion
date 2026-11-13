import { formatDateLong, stripInlineLinks } from "@cc/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ExcursionCard } from "@/components/site/excursion-card";
import { Faq } from "@/components/site/faq";
import { GuideBody } from "@/components/site/guide-body";
import { GuideCard } from "@/components/site/guide-card";
import { JsonLdScript } from "@/components/site/json-ld-script";
import { KeyFacts } from "@/components/site/key-facts";
import { PageHero } from "@/components/site/page-hero";
import { Carousel } from "@/components/ui/carousel";
import { EXCURSIONS } from "@/content/excursions";
import { findGuide, GUIDES, type Guide, guidePath } from "@/content/guides";
import type { Locale } from "@/i18n/routing";
import { excursionCards } from "@/lib/excursion-cards";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, pageUrl } from "@/lib/site";
import { organizationRef, websiteRef } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

function getGuide(slug: string): Guide {
  const guide = findGuide(slug);
  if (!guide) notFound();
  return guide;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/guias/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const guide = getGuide(slug);
  const text = guide.text[locale];
  return pageMetadata({
    locale,
    path: guidePath(slug),
    title: text.metaTitle,
    description: text.description,
    image: guide.cover,
    article: { published: guide.published, modified: guide.modified },
  });
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guias/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const guide = getGuide(slug);
  const text = guide.text[locale];
  const t = await getTranslations();

  const related = await excursionCards(
    locale,
    guide.related.flatMap((relatedSlug) => EXCURSIONS.filter((e) => e.slug === relatedSlug)),
  );
  const otherGuides = GUIDES.filter((g) => g.slug !== slug);
  const updated = formatDateLong(guide.modified, locale);

  const url = pageUrl(locale, guidePath(slug));
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: text.title,
    description: text.description,
    abstract: stripInlineLinks(text.summary),
    url,
    mainEntityOfPage: url,
    inLanguage: locale,
    ...(guide.cover && { image: [absoluteUrl(guide.cover.src)] }),
    datePublished: guide.published,
    dateModified: guide.modified,
    author: organizationRef,
    publisher: organizationRef,
    isPartOf: websiteRef,
  };

  return (
    <>
      <PageHero
        locale={locale}
        path={guidePath(slug)}
        image={guide.cover}
        eyebrow={t("GuidesPage.guide")}
        crumb={text.metaTitle}
        trail={[{ label: t("GuidesPage.eyebrow"), href: "/guias" }]}
        title={text.title}
        lead={text.lead}
      />

      <article className="section-y">
        <div className="container-page max-w-3xl">
          <Reveal>
            <p className="text-ink-500 text-sm">
              {t("GuidesPage.author")} ·{" "}
              <time dateTime={guide.modified}>{t("GuidesPage.updated", { date: updated })}</time>
            </p>
            <div className="mt-6">
              <KeyFacts label={t("Common.inBrief")} text={stripInlineLinks(text.summary)} />
            </div>
          </Reveal>
          <div className="mt-12 lg:mt-14">
            <GuideBody sections={text.sections} locale={locale} />
          </div>
        </div>
      </article>

      <section className="section-y border-line border-t">
        <div className="container-page">
          <Reveal>
            <Faq title={t("Common.faqTitle")} items={text.faq} />
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y bg-lagoon">
          <div className="container-page">
            <Reveal>
              <h2 className="text-display-lg text-ink-900">{t("GuidesPage.related")}</h2>
            </Reveal>
            <Reveal className="mt-10 lg:mt-14">
              <Carousel
                label={t("GuidesPage.related")}
                slideClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                {related.map(({ slug: cardSlug, categoryId: _, ...card }) => (
                  <ExcursionCard key={cardSlug} {...card} />
                ))}
              </Carousel>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <h2 className="text-display-lg text-ink-900">{t("GuidesPage.relatedGuides")}</h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:gap-8">
            {otherGuides.map((other) => (
              <RevealItem key={other.slug}>
                <GuideCard
                  href={guidePath(other.slug)}
                  image={other.cover}
                  label={t("GuidesPage.guide")}
                  title={other.text[locale].title}
                  description={other.text[locale].description}
                  cta={t("GuidesPage.readGuide")}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand originCode={`CC-GUIA-${slug.toUpperCase()}`} />
      <JsonLdScript data={articleLd} />
    </>
  );
}
