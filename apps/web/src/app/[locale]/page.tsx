import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CircleCheck,
  ClipboardCheck,
  Languages,
  type LucideIcon,
  MapPin,
  MessagesSquare,
  TreePalm,
  UserRound,
  Wallet,
} from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import partyBoat from "@/assets/images/excursiones/party-boat.jpg";
import saonaVip from "@/assets/images/excursiones/saona-vip.jpg";
import heroPhoto from "@/assets/images/hero-playa.jpg";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { ExcursionCard } from "@/components/site/excursion-card";
import { Faq, type FaqItem } from "@/components/site/faq";
import { HeroVideo } from "@/components/site/hero-video";
import { Marquee } from "@/components/site/marquee";
import { PackageSlide } from "@/components/site/package-card";
import { QuickPlanner } from "@/components/site/quick-planner";
import { SectionHeader } from "@/components/site/section-header";
import { TripVisual } from "@/components/site/trip-visual";
import { whatsappHref } from "@/components/site/whatsapp-button";
import { Carousel } from "@/components/ui/carousel";
import { EXCURSIONS, excursionOriginCode } from "@/content/excursions";
import { PACKAGES, packageOriginCode } from "@/content/packages";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations();

  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: MessagesSquare, title: t("HowItWorks.step1Title"), text: t("HowItWorks.step1Text") },
    { icon: ClipboardCheck, title: t("HowItWorks.step2Title"), text: t("HowItWorks.step2Text") },
    { icon: TreePalm, title: t("HowItWorks.step3Title"), text: t("HowItWorks.step3Text") },
  ];
  const whyIcons: LucideIcon[] = [MapPin, UserRound, Wallet, Languages];
  const why = t.raw("Why.items") as { title: string; text: string }[];

  return (
    <>
      {/* ── Hero con video ───────────────────────────────────── */}
      <section className="relative isolate -mt-16 flex min-h-[46rem] items-end overflow-hidden text-white lg:-mt-20 lg:min-h-[100svh]">
        <HeroVideo
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/videos/hero-costa.mp4`}
          poster={heroPhoto}
          alt={t("Hero.imageAlt")}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/85 via-ink-900/45 to-ink-900/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink-900/80 to-transparent"
        />
        <div className="container-page w-full pt-36 pb-10 lg:pt-44 lg:pb-16">
          <Reveal>
            <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-medium text-sm">
              <MapPin className="size-4 text-teal-400" strokeWidth={2} aria-hidden="true" />
              {t("Hero.eyebrow")}
            </p>
            <h1 className="mt-6 max-w-4xl text-display-hero">
              {t.rich("Hero.title", {
                em: (chunks) => <em className="text-teal-400">{chunks}</em>,
              })}
            </h1>
            <p className="mt-6 max-w-2xl text-lead text-white/85">{t("Hero.subtitle")}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <QuickPlanner />
          </Reveal>
          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {[t("Hero.trust1"), t("Hero.trust2"), t("Hero.trust3")].map((item) => (
              <li key={item} className="flex items-center gap-2 font-medium text-sm text-white/85">
                <CircleCheck
                  className="size-5 shrink-0 text-teal-400"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Marquee items={t.raw("Marquee.items") as string[]} label={t("Marquee.label")} />

      {/* ── Excursiones (carrusel) ───────────────────────────── */}
      <section className="section-y overflow-hidden">
        <div className="container-page">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeader
                align="start"
                eyebrow={t("Excursions.eyebrow")}
                title={t("Excursions.title")}
                lead={t("Excursions.lead")}
              />
            </Reveal>
            <Link
              href="/excursiones"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-teal-600 hover:text-teal-700"
            >
              {t("ExcursionsTeaser.viewAll")}
              <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <Reveal className="mt-10 lg:mt-14">
            <Carousel
              label={t("Excursions.title")}
              slideClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              {EXCURSIONS.map((excursion) => {
                const title = t(`Excursions.items.${excursion.key}.title`);
                return (
                  <ExcursionCard
                    key={excursion.slug}
                    image={excursion.image}
                    category={t(`Excursions.categories.${excursion.category}`)}
                    title={title}
                    tagline={t(`Excursions.items.${excursion.key}.tagline`)}
                    detail={t(`Excursions.items.${excursion.key}.detail`)}
                    ctaLabel={t("Excursions.cta")}
                    whatsappUrl={whatsappHref(
                      t("Excursions.waMessage", { name: title }),
                      excursionOriginCode(excursion.slug),
                    )}
                  />
                );
              })}
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* ── Cómo funciona ────────────────────────────────────── */}
      <section className="section-y bg-sand-100">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <SectionHeader
                align="start"
                eyebrow={t("HowItWorks.eyebrow")}
                title={t("HowItWorks.title")}
                lead={t("HowItWorks.lead")}
              />
            </Reveal>
            <RevealGroup as="ol" className="relative mt-10 flex flex-col gap-8">
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-6 left-6 w-px bg-gradient-to-b from-teal-400 via-teal-400/40 to-transparent"
              />
              {steps.map((step) => (
                <RevealItem key={step.title} className="relative flex gap-5">
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-teal-600 shadow-card ring-1 ring-line">
                    <step.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="pt-1.5">
                    <span className="block font-semibold text-ink-900 text-lg">{step.title}</span>
                    <span className="mt-1 block text-ink-700">{step.text}</span>
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={0.1}>
            <TripVisual
              imageAlt={t("Hero.imageAlt")}
              tripLabel={t("HowItWorks.tripLabel")}
              tripTitle={t("HowItWorks.tripTitle")}
              confirmed={t("HowItWorks.confirmed")}
              days={([1, 2, 3] as const).map((n) => ({
                label: t("HowItWorks.day", { n }),
                title: t(`HowItWorks.day${n}Title`),
                text: t(`HowItWorks.day${n}Text`),
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Qué organizamos (bento) ──────────────────────────── */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow={t("Bento.eyebrow")}
              title={t("Bento.title")}
              lead={t("Bento.lead")}
            />
          </Reveal>
          <RevealGroup className="mt-10 grid auto-rows-[13rem] gap-4 sm:auto-rows-[15rem] sm:gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            <BentoTile
              href="/alojamiento"
              title={t("Bento.stays")}
              text={t("Bento.staysText")}
              more={t("Bento.more")}
              image={heroPhoto}
              className="sm:col-span-2 lg:row-span-2"
              large
            />
            <BentoTile
              href="/traslados"
              title={t("Bento.transfers")}
              text={t("Bento.transfersText")}
              more={t("Bento.more")}
            />
            <BentoTile
              href="/excursiones"
              title={t("Bento.excursions")}
              text={t("Bento.excursionsText")}
              more={t("Bento.more")}
              image={saonaVip}
            />
            <BentoTile
              href="/servicios"
              title={t("Bento.services")}
              text={t("Bento.servicesText")}
              more={t("Bento.more")}
              tone="sand"
            />
            <BentoTile
              href="/paquetes"
              title={t("Bento.packages")}
              text={t("Bento.packagesText")}
              more={t("Bento.more")}
              image={partyBoat}
            />
          </RevealGroup>
        </div>
      </section>

      {/* ── Paquetes (carrusel oscuro) ───────────────────────── */}
      <section className="section-y overflow-hidden bg-ink-900 text-white">
        <div className="container-page">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal className="max-w-2xl">
              <p className="text-eyebrow text-teal-400">{t("PackagesTeaser.eyebrow")}</p>
              <h2 className="mt-3 text-display-lg">{t("PackagesTeaser.title")}</h2>
              <p className="mt-4 text-lead text-white/80">{t("PackagesTeaser.lead")}</p>
            </Reveal>
            <Link
              href="/paquetes"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-teal-400 hover:text-white"
            >
              {t("PackagesTeaser.viewAll")}
              <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
          <Reveal className="mt-10 lg:mt-14">
            <Carousel
              label={t("PackagesTeaser.title")}
              tone="dark"
              autoplay
              loop
              slideClassName="basis-[80%] sm:basis-1/2 lg:basis-1/3"
            >
              {PACKAGES.map((pkg) => {
                const title = t(`Packages.items.${pkg.key}.title`);
                return (
                  <PackageSlide
                    key={pkg.key}
                    image={pkg.image}
                    icon={pkg.icon}
                    title={title}
                    idealFor={t(`Packages.items.${pkg.key}.idealFor`)}
                    ctaLabel={t("Packages.cta")}
                    whatsappUrl={whatsappHref(
                      t("Packages.waMessage", { name: title }),
                      packageOriginCode(pkg.slug),
                    )}
                  />
                );
              })}
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* ── Por qué nosotros ─────────────────────────────────── */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <SectionHeader eyebrow={t("Why.eyebrow")} title={t("Why.title")} />
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            {why.map((item, i) => {
              const Icon = whyIcons[i] ?? BadgeCheck;
              return (
                <RevealItem
                  key={item.title}
                  className="flex gap-4 rounded-card border border-line bg-white p-5 shadow-card sm:block sm:p-8"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="pt-2.5 font-sans font-semibold text-ink-900 text-lg sm:mt-6 sm:pt-0">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-ink-700 sm:mt-2">{item.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ── Preguntas frecuentes ─────────────────────────────── */}
      <section className="section-y bg-sand-100">
        <div className="container-page">
          <Reveal>
            <Faq title={t("Common.faqTitle")} items={t.raw("HomeFaq.items") as FaqItem[]} />
          </Reveal>
        </div>
      </section>

      <CtaBand originCode="CC-HOME-CTA" />
    </>
  );
}

function BentoTile({
  href,
  title,
  text,
  more,
  image,
  className = "",
  large = false,
  tone = "white",
}: {
  href: string;
  title: string;
  text: string;
  more: string;
  image?: StaticImageData;
  className?: string;
  large?: boolean;
  tone?: "white" | "sand";
}) {
  const onPhoto = Boolean(image);
  return (
    <RevealItem className={className}>
      <Link
        href={href}
        className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-card p-6 sm:p-8 ${
          onPhoto
            ? "text-white"
            : `border border-line text-ink-900 shadow-card ${tone === "sand" ? "bg-sand-200" : "bg-white"}`
        }`}
      >
        {image && (
          <>
            <Image
              src={image}
              alt=""
              fill
              placeholder="blur"
              sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
          </>
        )}
        <span className="relative">
          <span
            className={`block font-display font-semibold ${large ? "text-3xl lg:text-4xl" : "text-2xl"}`}
          >
            {title}
          </span>
          <span className={`mt-2 block max-w-md ${onPhoto ? "text-white/85" : "text-ink-700"}`}>
            {text}
          </span>
          <span
            className={`mt-4 inline-flex items-center gap-1.5 font-semibold text-sm ${
              onPhoto ? "text-teal-400" : "text-teal-600"
            }`}
          >
            {more}
            <ArrowUpRight
              className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </span>
      </Link>
    </RevealItem>
  );
}
