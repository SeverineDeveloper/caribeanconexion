import { formatDuration, formatTime } from "@cc/core";
import { buttonVariants } from "@heroui/styles";
import { CalendarDays, Check, Clock, Info } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ExcursionCard } from "@/components/site/excursion-card";
import { ExcursionGallery } from "@/components/site/excursion-gallery";
import { ExcursionVideo } from "@/components/site/excursion-video";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Carousel } from "@/components/ui/carousel";
import {
  type ExcursionSchedule,
  type ExcursionWithPage,
  excursionOriginCode,
  excursionPath,
  excursionsWithPage,
} from "@/content/excursions";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { excursionCards, excursionPrice } from "@/lib/excursion-cards";
import { jsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteUrl } from "@/lib/site";

// Solo existen las páginas de las excursiones con galería; el resto da 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return excursionsWithPage().map((excursion) => ({ slug: excursion.slug }));
}

function findExcursion(slug: string): ExcursionWithPage {
  const excursion = excursionsWithPage().find((e) => e.slug === slug);
  if (!excursion) notFound();
  return excursion;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/excursiones/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const excursion = findExcursion(slug);
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: excursionPath(slug),
    title: t(`Excursions.items.${excursion.key}.title`),
    description: t(`ExcursionPages.${excursion.key}.metaDescription`),
    image: excursion.cover,
  });
}

function scheduleText(schedule: ExcursionSchedule, locale: Locale) {
  const from = formatTime(schedule.from, locale);
  return schedule.to ? `${from} – ${formatTime(schedule.to, locale)}` : from;
}

export default async function ExcursionPage({ params }: PageProps<"/[locale]/excursiones/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const excursion = findExcursion(slug);
  const t = await getTranslations();
  const { key } = excursion;

  const title = t(`Excursions.items.${key}.title`);
  const description = t(`ExcursionPages.${key}.description`);
  const includes = t.raw(`ExcursionPages.${key}.includes`) as string[];
  const notes = t.raw(`ExcursionPages.${key}.notes`) as string[];
  const alts = t.raw(`ExcursionPages.${key}.gallery`) as string[];
  // Si se vuelven a procesar las fotos y cambia su número, el build falla aquí en vez de
  // publicar fotos sin descripción o con la de otra foto.
  if (alts.length !== excursion.gallery.length) {
    throw new Error(
      `ExcursionPages.${key}.gallery (${locale}) tiene ${alts.length} textos y la galería ${excursion.gallery.length} fotos`,
    );
  }
  const { price, priceUnit } = await excursionPrice(excursion, locale);
  const others = await excursionCards(
    locale,
    excursionsWithPage().filter((e) => e.slug !== slug),
  );
  const waMessage = t("ExcursionDetail.waMessage", { name: title });
  const originCode = excursionOriginCode(slug);
  const hasFacts = excursion.durationMinutes !== undefined || excursion.schedules !== undefined;

  const tripLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description,
    url: `${siteUrl}/${locale}${excursionPath(slug)}`,
    image: excursion.gallery.slice(0, 4).map((image) => absoluteUrl(image.src)),
    ...(excursion.priceFromUsd !== undefined && {
      offers: {
        "@type": "Offer",
        price: excursion.priceFromUsd,
        priceCurrency: "USD",
        url: `${siteUrl}/${locale}${excursionPath(slug)}`,
      },
    }),
    provider: { "@type": "TravelAgency", name: "Conexión Caribe", url: siteUrl },
  };

  return (
    <>
      <PageHero
        locale={locale}
        path={excursionPath(slug)}
        image={excursion.cover}
        eyebrow={t(`Excursions.categories.${excursion.category}`)}
        crumb={title}
        trail={[{ label: t("ExcursionsPage.eyebrow"), href: "/excursiones" }]}
        title={title}
        lead={t(`Excursions.items.${key}.tagline`)}
      >
        <WhatsAppButton onDark message={waMessage} originCode={`${originCode}-HERO`}>
          {t("ExcursionDetail.cta")}
        </WhatsAppButton>
      </PageHero>

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <Reveal className="min-w-0">
            <ExcursionGallery
              images={excursion.gallery}
              alts={alts}
              labels={{
                gallery: t("ExcursionDetail.photos", { name: title }),
                // Plantillas: la galería sustituye {n}, {total} y {count} en el cliente.
                openPhoto: t.raw("ExcursionDetail.openPhoto") as string,
                viewAll: t.raw("ExcursionDetail.viewAll") as string,
                photoOf: t.raw("ExcursionDetail.photoOf") as string,
                close: t("ExcursionDetail.close"),
                previous: t("ExcursionDetail.previous"),
                next: t("ExcursionDetail.next"),
              }}
            />
          </Reveal>

          {/* En móvil la ficha va justo después de las fotos; en escritorio, fija a la derecha. */}
          <aside data-wa-float-avoid="" className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Reveal className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8 lg:sticky lg:top-28">
              <p className="text-display-md text-ink-900">{price}</p>
              {priceUnit && <p className="mt-1 text-ink-500 text-sm">{priceUnit}</p>}

              {hasFacts && (
                <dl className="mt-6 flex flex-col gap-5 border-line border-t pt-6">
                  {excursion.durationMinutes && (
                    <div className="flex gap-3">
                      <dt className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <Clock className="size-5" strokeWidth={1.75} aria-hidden="true" />
                        <span className="sr-only">{t("ExcursionDetail.duration")}</span>
                      </dt>
                      <dd className="pt-2 text-ink-700">
                        <span className="block font-semibold text-ink-900 text-sm">
                          {t("ExcursionDetail.duration")}
                        </span>
                        {formatDuration(excursion.durationMinutes)}
                      </dd>
                    </div>
                  )}
                  {excursion.schedules && (
                    <div className="flex gap-3">
                      <dt className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <CalendarDays className="size-5" strokeWidth={1.75} aria-hidden="true" />
                        <span className="sr-only">{t("ExcursionDetail.schedules")}</span>
                      </dt>
                      <dd className="pt-2 text-ink-700">
                        <span className="block font-semibold text-ink-900 text-sm">
                          {t("ExcursionDetail.schedules")}
                          {excursion.daily && (
                            <span className="font-normal text-ink-500">
                              {" "}
                              · {t("ExcursionDetail.daily")}
                            </span>
                          )}
                        </span>
                        <ul className="mt-1 flex flex-col gap-1">
                          {excursion.schedules.map((schedule) => (
                            <li key={`${schedule.from}-${schedule.to}`}>
                              {scheduleText(schedule, locale)}
                              {schedule.label && (
                                <span className="text-ink-500 text-sm">
                                  {" "}
                                  ({t(`ExcursionDetail.scheduleLabels.${schedule.label}`)})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <WhatsAppButton message={waMessage} originCode={originCode} className="w-full">
                  {t("ExcursionDetail.cta")}
                </WhatsAppButton>
                <Link
                  href="/arma-tu-viaje"
                  className={`${buttonVariants({ size: "lg", variant: "outline" })} w-full`}
                >
                  {t("ExcursionDetail.planTrip")}
                </Link>
              </div>
              <p className="mt-5 text-ink-500 text-sm">{t("Common.referencePrices")}</p>
            </Reveal>
          </aside>

          <div className="flex min-w-0 flex-col gap-12">
            <Reveal>
              <h2 className="text-display-md text-ink-900">{t("ExcursionDetail.about")}</h2>
              <p className="mt-4 max-w-[62ch] text-pretty text-ink-700 text-lead">{description}</p>
            </Reveal>

            {includes.length > 0 && (
              <Reveal>
                <h2 className="text-display-md text-ink-900">{t("ExcursionDetail.includes")}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink-700">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                        <Check className="size-4" strokeWidth={2.25} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {notes.length > 0 && (
              <Reveal>
                <h2 className="text-display-md text-ink-900">{t("ExcursionDetail.goodToKnow")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {notes.map((note) => (
                    <li key={note} className="flex items-start gap-3 text-ink-700">
                      <Info
                        className="mt-0.5 size-5 shrink-0 text-teal-600"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {note}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {excursion.video && (
              <Reveal>
                <h2 className="text-display-md text-ink-900">{t("ExcursionDetail.video")}</h2>
                <div className="mt-5">
                  <ExcursionVideo
                    src={excursion.video.src}
                    poster={excursion.video.poster}
                    alt={title}
                    playLabel={t("Common.playVideo")}
                    pauseLabel={t("Common.pauseVideo")}
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="section-y bg-lagoon">
        <div className="container-page">
          <Reveal>
            <h2 className="text-display-lg text-ink-900">{t("ExcursionDetail.more")}</h2>
          </Reveal>
          <Reveal className="mt-10 lg:mt-14">
            <Carousel
              label={t("ExcursionDetail.more")}
              slideClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              {others.map(({ slug: otherSlug, categoryId: _, ...card }) => (
                <ExcursionCard key={otherSlug} {...card} />
              ))}
            </Carousel>
          </Reveal>
        </div>
      </section>

      <CtaBand originCode={`${originCode}-CTA`} />

      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapado con jsonLd()
        dangerouslySetInnerHTML={jsonLd(tripLd)}
      />
    </>
  );
}
