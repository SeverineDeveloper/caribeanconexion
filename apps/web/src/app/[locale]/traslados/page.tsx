import {
  Bus,
  Car,
  CarFront,
  Clock,
  type LucideIcon,
  Plane,
  Route,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { Faq, type FaqItem } from "@/components/site/faq";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeader } from "@/components/site/section-header";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Carousel } from "@/components/ui/carousel";
import { ROUTE_KEYS, VEHICLE_KEYS } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/traslados";
const FEATURE_ICONS: LucideIcon[] = [ShieldCheck, Route, Clock, UserRound];
const VEHICLE_ICONS: Record<(typeof VEHICLE_KEYS)[number], LucideIcon> = {
  sedan: Car,
  suv: CarFront,
  van: Users,
  minibus: Bus,
  bus: Bus,
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/traslados">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "TransfersPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function TransfersPage({ params }: PageProps<"/[locale]/traslados">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();
  const features = t.raw("TransfersPage.features") as { title: string; text: string }[];

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        eyebrow={t("TransfersPage.eyebrow")}
        title={t("TransfersPage.title")}
        lead={t("TransfersPage.lead")}
      >
        <WhatsAppButton onDark message={t("TransfersPage.waMessage")} originCode="CC-TRAS-HERO">
          {t("TransfersPage.cta")}
        </WhatsAppButton>
      </PageHero>

      {/* Ventajas */}
      <section className="section-y">
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i] ?? ShieldCheck;
              return (
                <RevealItem
                  key={feature.title}
                  className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-sans font-semibold text-ink-900 text-lg">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-ink-700">{feature.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Rutas */}
      <section className="section-y bg-sand-100">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow={t("TransfersPage.eyebrow")}
              title={t("TransfersPage.routesTitle")}
              lead={t("TransfersPage.routesNote")}
            />
          </Reveal>
          <RevealGroup className="mx-auto mt-10 grid max-w-4xl gap-4 lg:mt-14">
            {ROUTE_KEYS.map((route) => (
              <RevealItem
                key={route}
                className="flex items-center gap-4 rounded-card border border-line bg-white px-5 py-4 shadow-card sm:gap-6 sm:px-8 sm:py-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
                  <Plane className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="hidden text-ink-500 text-sm sm:block">
                  {t("TransfersPage.from")}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 border-teal-400/60 border-t-2 border-dashed sm:block"
                />
                <span className="flex-1 font-semibold text-ink-900 sm:flex-none">
                  {t(`Transfers.routes.${route}.to`)}
                </span>
                <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 font-semibold text-sm text-teal-700">
                  {t(`Transfers.routes.${route}.time`)}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Vehículos (carrusel) */}
      <section className="section-y overflow-hidden">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              align="start"
              eyebrow={t("TransfersPage.eyebrow")}
              title={t("TransfersPage.vehiclesTitle")}
              lead={t("TransfersPage.vehiclesNote")}
            />
          </Reveal>
          <Reveal className="mt-10 lg:mt-14">
            <Carousel
              label={t("TransfersPage.vehiclesTitle")}
              slideClassName="basis-[75%] sm:basis-1/2 lg:basis-1/4"
            >
              {VEHICLE_KEYS.map((vehicle) => {
                const Icon = VEHICLE_ICONS[vehicle];
                return (
                  <article
                    key={vehicle}
                    className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
                  >
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-sand-100 text-ink-900">
                      <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-display font-semibold text-2xl text-ink-900">
                      {t(`Transfers.vehicles.${vehicle}.name`)}
                    </h3>
                    <p className="mt-2 font-semibold text-teal-700">
                      {t(`Transfers.vehicles.${vehicle}.capacity`)}
                    </p>
                    <p className="mt-2 text-ink-700">
                      {t(`Transfers.vehicles.${vehicle}.idealFor`)}
                    </p>
                  </article>
                );
              })}
            </Carousel>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-sand-100">
        <div className="container-page">
          <Reveal>
            <Faq title={t("Common.faqTitle")} items={t.raw("TransfersPage.faq") as FaqItem[]} />
          </Reveal>
        </div>
      </section>

      <CtaBand originCode="CC-TRAS-CTA" />
    </>
  );
}
