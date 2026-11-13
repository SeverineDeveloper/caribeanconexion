import {
  ArrowRight,
  BedDouble,
  CarFront,
  ClipboardCheck,
  ConciergeBell,
  Languages,
  type LucideIcon,
  Luggage,
  MapPin,
  MessagesSquare,
  Sailboat,
  TreePalm,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLdScript } from "@/components/site/json-ld-script";
import { KeyFacts } from "@/components/site/key-facts";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeader } from "@/components/site/section-header";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { pageUrl } from "@/lib/site";
import { organizationRef, websiteRef } from "@/lib/structured-data";

const PATH = "/sobre-nosotros";

/** Áreas que organiza la empresa, con su página. */
const AREAS = [
  { key: "accommodation", href: "/alojamiento", icon: BedDouble },
  { key: "transfers", href: "/traslados", icon: CarFront },
  { key: "excursions", href: "/excursiones", icon: Sailboat },
  { key: "packages", href: "/paquetes", icon: Luggage },
  { key: "services", href: "/servicios", icon: ConciergeBell },
  { key: "groups", href: "/grupos", icon: UsersRound },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sobre-nosotros">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/sobre-nosotros">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();
  const who = t.raw("AboutPage.who") as string[];
  const why = t.raw("Why.items") as { title: string; text: string }[];
  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: MessagesSquare, title: t("HowItWorks.step1Title"), text: t("HowItWorks.step1Text") },
    { icon: ClipboardCheck, title: t("HowItWorks.step2Title"), text: t("HowItWorks.step2Text") },
    { icon: TreePalm, title: t("HowItWorks.step3Title"), text: t("HowItWorks.step3Text") },
  ];

  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl(locale, PATH)}#webpage`,
    url: pageUrl(locale, PATH),
    name: t("AboutPage.metaTitle"),
    description: t("AboutPage.metaDescription"),
    inLanguage: locale,
    isPartOf: websiteRef,
    about: organizationRef,
    mainEntity: organizationRef,
  };

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={heroPhoto}
        eyebrow={t("AboutPage.eyebrow")}
        title={t("AboutPage.title")}
        lead={t("AboutPage.lead")}
      >
        <WhatsAppButton onDark message={t("AboutPage.waMessage")} originCode="CC-NOS-HERO">
          {t("Common.askWhatsapp")}
        </WhatsAppButton>
      </PageHero>

      {/* Quiénes somos */}
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="flex min-w-0 flex-col gap-10">
            <Reveal>
              <KeyFacts label={t("Common.inBrief")} text={t("AboutPage.summary")} />
            </Reveal>
            <Reveal>
              <h2 className="text-display-md text-ink-900">{t("AboutPage.whoTitle")}</h2>
              <div className="mt-4 flex flex-col gap-4">
                {who.map((paragraph) => (
                  <p key={paragraph} className="max-w-[62ch] text-pretty text-ink-700 text-lead">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          <RevealGroup className="flex flex-col gap-5">
            {[
              { icon: MapPin, title: t("AboutPage.whereTitle"), text: t("AboutPage.whereText") },
              {
                icon: Languages,
                title: t("AboutPage.languagesTitle"),
                text: t("AboutPage.languagesText"),
              },
            ].map(({ icon: Icon, title, text }) => (
              <RevealItem
                key={title}
                className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-sans font-semibold text-ink-900 text-lg">{title}</h2>
                <p className="mt-2 text-ink-700">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Qué organizamos */}
      <section className="section-y bg-lagoon">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              align="start"
              eyebrow={t("AboutPage.eyebrow")}
              title={t("AboutPage.whatTitle")}
              lead={t("AboutPage.whatLead")}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
            {AREAS.map(({ key, href, icon: Icon }) => (
              <RevealItem key={key}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-400 sm:p-8"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 flex items-center gap-2 font-sans font-semibold text-ink-900 text-lg">
                    {t(`Nav.${key}`)}
                    <ArrowRight
                      className="size-5 text-teal-600 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-2 text-ink-700">{t(`AboutPage.what.${key}`)}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow={t("HowItWorks.eyebrow")}
              title={t("HowItWorks.title")}
              lead={t("HowItWorks.lead")}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-3 lg:mt-14 lg:gap-8">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <RevealItem
                key={title}
                className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-3xl text-teal-200" aria-hidden="true">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-sans font-semibold text-ink-900 text-lg">{title}</h3>
                <p className="mt-2 text-ink-700">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="section-y bg-lagoon">
        <div className="container-page">
          <Reveal>
            <SectionHeader eyebrow={t("Why.eyebrow")} title={t("Why.title")} />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-8">
            {why.map((item) => (
              <RevealItem
                key={item.title}
                className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
              >
                <h3 className="font-sans font-semibold text-ink-900 text-lg">{item.title}</h3>
                <p className="mt-2 text-ink-700">{item.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CtaBand originCode="CC-NOS-CTA" />
      <JsonLdScript data={aboutLd} />
    </>
  );
}
