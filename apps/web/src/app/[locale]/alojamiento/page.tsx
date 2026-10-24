import { Building, Check, Hotel, House, type LucideIcon, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeader } from "@/components/site/section-header";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Carousel } from "@/components/ui/carousel";
import { ZONE_KEYS } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/alojamiento";
const TYPES: { key: "apartment" | "villa" | "hotel"; icon: LucideIcon }[] = [
  { key: "apartment", icon: Building },
  { key: "villa", icon: House },
  { key: "hotel", icon: Hotel },
];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/alojamiento">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "StaysPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function StaysPage({ params }: PageProps<"/[locale]/alojamiento">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();
  const steps = t.raw("StaysPage.steps") as { title: string; text: string }[];

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={heroPhoto}
        eyebrow={t("StaysPage.eyebrow")}
        title={t("StaysPage.title")}
        lead={t("StaysPage.lead")}
      >
        <WhatsAppButton onDark message={t("StaysPage.waMessage")} originCode="CC-ALOJ-HERO">
          {t("StaysPage.cta")}
        </WhatsAppButton>
      </PageHero>

      {/* Tipos */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <SectionHeader eyebrow={t("StaysPage.eyebrow")} title={t("StaysPage.typesTitle")} />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-14 lg:gap-8">
            {TYPES.map((type) => (
              <RevealItem
                key={type.key}
                className="group rounded-card border border-line bg-white p-6 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised sm:p-8"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                  <type.icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display font-semibold text-2xl text-ink-900">
                  {t(`StaysPage.types.${type.key}.title`)}
                </h3>
                <p className="mt-3 text-ink-700">{t(`StaysPage.types.${type.key}.text`)}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Zonas (carrusel) */}
      <section className="section-y overflow-hidden bg-sand-100">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              align="start"
              eyebrow={t("StaysPage.zonesEyebrow")}
              title={t("StaysPage.zonesTitle")}
              lead={t("StaysPage.zonesLead")}
            />
          </Reveal>
          <Reveal className="mt-10 lg:mt-14">
            <Carousel
              label={t("StaysPage.zonesTitle")}
              slideClassName="basis-[82%] sm:basis-1/2 lg:basis-1/3"
            >
              {ZONE_KEYS.map((zone, i) => (
                <article
                  key={zone}
                  className="relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-4 -right-2 font-display font-semibold text-[7rem] text-sand-200 leading-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <MapPin
                    className="relative size-6 text-teal-600"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <div className="relative mt-10">
                    <h3 className="font-display font-semibold text-2xl text-ink-900">
                      {t(`Zones.items.${zone}.name`)}
                    </h3>
                    <p className="mt-3 text-ink-700">{t(`Zones.items.${zone}.text`)}</p>
                  </div>
                </article>
              ))}
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* Cómo reservamos + extras */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-display-lg text-ink-900">{t("StaysPage.howTitle")}</h2>
            </Reveal>
            <RevealGroup as="ol" className="mt-10 flex flex-col gap-6">
              {steps.map((step, i) => (
                <RevealItem key={step.title} className="flex gap-5">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display font-semibold text-lg text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1">
                    <span className="block font-semibold text-ink-900 text-lg">{step.title}</span>
                    <span className="mt-1 block text-ink-700">{step.text}</span>
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={0.1}>
            <div className="h-full rounded-panel bg-ink-900 p-8 text-white sm:p-10">
              <h2 className="text-display-md">{t("StaysPage.extrasTitle")}</h2>
              <ul className="mt-8 flex flex-col gap-4">
                {(t.raw("StaysPage.extras") as string[]).map((extra) => (
                  <li key={extra} className="flex items-center gap-3 text-white/90">
                    <span className="flex size-8 items-center justify-center rounded-full bg-teal-400/15 text-teal-400">
                      <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    {extra}
                  </li>
                ))}
              </ul>
              <WhatsAppButton
                onDark
                message={t("StaysPage.waMessage")}
                originCode="CC-ALOJ-EXTRAS"
                className="mt-10 w-full sm:w-auto"
              >
                {t("StaysPage.cta")}
              </WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand originCode="CC-ALOJ-CTA" />
    </>
  );
}
