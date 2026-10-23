import { buildWhatsAppUrl } from "@cc/core";
import { buttonVariants } from "@heroui/styles";
import {
  ArrowRight,
  BedDouble,
  CarFront,
  Check,
  CircleCheck,
  ClipboardCheck,
  HeartHandshake,
  type LucideIcon,
  MapPin,
  MessagesSquare,
  PartyPopper,
  Sailboat,
  TreePalm,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { ExcursionCard } from "@/components/site/excursion-card";
import { HeroVisual } from "@/components/site/hero-visual";
import { SectionHeader } from "@/components/site/section-header";
import { EXCURSIONS, excursionOriginCode } from "@/content/excursions";
import { Link } from "@/i18n/navigation";
import { whatsappNumber } from "@/lib/site";

export default async function HomePage() {
  const t = await getTranslations();
  const whatsappUrl = (origin: string, message = t("WhatsApp.defaultMessage")) =>
    buildWhatsAppUrl(whatsappNumber, message, origin);

  const trust = [t("Hero.trust1"), t("Hero.trust2"), t("Hero.trust3")];

  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: MessagesSquare, title: t("HowItWorks.step1Title"), text: t("HowItWorks.step1Text") },
    { icon: ClipboardCheck, title: t("HowItWorks.step2Title"), text: t("HowItWorks.step2Text") },
    { icon: TreePalm, title: t("HowItWorks.step3Title"), text: t("HowItWorks.step3Text") },
  ];

  const experienceGroups: { icon: LucideIcon; key: "sea" | "land" | "occasions" }[] = [
    { icon: Sailboat, key: "sea" },
    { icon: TreePalm, key: "land" },
    { icon: PartyPopper, key: "occasions" },
  ];

  const serviceGroups: { icon: LucideIcon; key: "arrival" | "stay" | "care" }[] = [
    { icon: CarFront, key: "arrival" },
    { icon: BedDouble, key: "stay" },
    { icon: HeartHandshake, key: "care" },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-[-10%] size-[44rem] rounded-full bg-teal-400/10 blur-3xl"
        />
        <div className="container-page relative grid items-center gap-14 pt-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-20 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-medium text-ink-700 text-sm">
              <MapPin className="size-4 text-teal-600" strokeWidth={2} aria-hidden="true" />
              {t("Hero.eyebrow")}
            </p>
            <h1 className="mt-6 text-display-xl text-ink-900">
              {t.rich("Hero.title", {
                em: (chunks) => <em className="text-teal-600">{chunks}</em>,
              })}
            </h1>
            <p className="mt-6 max-w-xl text-ink-700 text-lead">{t("Hero.subtitle")}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/arma-tu-viaje" className={buttonVariants({ size: "lg" })}>
                {t("Hero.ctaPlan")}
                <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </Link>
              <a
                href={whatsappUrl("CC-HOME-HERO")}
                target="_blank"
                rel="noopener"
                className={`${buttonVariants({ size: "lg", variant: "outline" })} border-field-border bg-white text-ink-900`}
              >
                <WhatsAppIcon className="size-5 text-[#1FAF55]" />
                {t("Hero.ctaWhatsapp")}
              </a>
            </div>

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2 font-medium text-ink-700 text-sm">
                  <CircleCheck
                    className="size-5 shrink-0 text-teal-600"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual
            imageAlt={t("Hero.imageAlt")}
            tripLabel={t("Hero.tripLabel")}
            tripTitle={t("Hero.tripTitle")}
            confirmed={t("Hero.confirmed")}
            days={[1, 2, 3].map((n) => ({
              label: t("Hero.day", { n }),
              title: t(`Hero.day${n}Title` as "Hero.day1Title"),
              text: t(`Hero.day${n}Text` as "Hero.day1Text"),
            }))}
          />
        </div>
      </section>

      {/* ── Excursiones ──────────────────────────────────────── */}
      <section id="excursiones" className="section-y bg-sand-100">
        <div className="container-page">
          <SectionHeader
            eyebrow={t("Excursions.eyebrow")}
            title={t("Excursions.title")}
            lead={t("Excursions.lead")}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:gap-6 xl:grid-cols-4">
            {EXCURSIONS.map((excursion) => {
              const title = t(`Excursions.items.${excursion.key}.title`);
              return (
                <li key={excursion.slug}>
                  <ExcursionCard
                    image={excursion.image}
                    category={t(`Excursions.categories.${excursion.category}`)}
                    title={title}
                    tagline={t(`Excursions.items.${excursion.key}.tagline`)}
                    detail={t(`Excursions.items.${excursion.key}.detail`)}
                    ctaLabel={t("Excursions.cta")}
                    whatsappUrl={whatsappUrl(
                      excursionOriginCode(excursion.slug),
                      t("Excursions.waMessage", { name: title }),
                    )}
                  />
                </li>
              );
            })}
          </ul>

          {/* Más experiencias (catálogo, pág. 6) */}
          <div className="mt-12 rounded-card border border-line bg-white p-6 shadow-card sm:p-8 lg:mt-16 lg:p-10">
            <h3 className="text-display-md text-ink-900">{t("MoreExperiences.title")}</h3>
            <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
              {experienceGroups.map((group) => (
                <div key={group.key}>
                  <p className="flex items-center gap-3 font-semibold text-ink-900">
                    <span className="flex size-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <group.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {t(`MoreExperiences.${group.key}.title`)}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {(t.raw(`MoreExperiences.${group.key}.items`) as string[]).map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-canvas px-3 py-1.5 text-ink-700 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 text-ink-500 text-sm">{t("Excursions.note")}</p>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ────────────────────────────────────── */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeader
            eyebrow={t("HowItWorks.eyebrow")}
            title={t("HowItWorks.title")}
            lead={t("HowItWorks.lead")}
          />
          <ol className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <step.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-display font-semibold text-4xl text-sand-300 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-sans font-semibold text-ink-900 text-lg">{step.title}</h3>
                <p className="mt-2 text-ink-700">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Servicios (catálogo, pág. 7) ─────────────────────── */}
      <section className="section-y bg-sand-100">
        <div className="container-page">
          <SectionHeader
            eyebrow={t("Services.eyebrow")}
            title={t("Services.title")}
            lead={t("Services.lead")}
          />
          <ul className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-8">
            {serviceGroups.map((group) => (
              <li
                key={group.key}
                className="flex flex-col rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <group.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-sans font-semibold text-ink-900 text-lg">
                  {t(`Services.${group.key}.title`)}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {(t.raw(`Services.${group.key}.items`) as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink-700">
                      <Check
                        className="mt-0.5 size-5 shrink-0 text-teal-600"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex justify-center">
            <Link href="/arma-tu-viaje" className={buttonVariants({ size: "lg" })}>
              {t("Services.cta")}
              <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-y">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-panel bg-ink-900 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 600 300"
              className="pointer-events-none absolute right-0 bottom-0 w-[38rem] max-w-none opacity-90"
            >
              <circle cx="470" cy="90" r="52" fill="#CB9E55" />
              <path
                d="M120 230c60-34 120-34 180 0s120 34 180 0 90-30 120-20"
                fill="none"
                stroke="#01AEB5"
                strokeOpacity="0.5"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M220 275c50-28 100-28 150 0s100 28 150 0 60-20 80-14"
                fill="none"
                stroke="#01AEB5"
                strokeOpacity="0.25"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </svg>
            <div className="relative max-w-2xl">
              <h2 className="text-display-lg text-white">{t("CtaBand.title")}</h2>
              <p className="mt-4 text-lead text-white/80">{t("CtaBand.text")}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappUrl("CC-HOME-CTA")}
                  target="_blank"
                  rel="noopener"
                  className={`${buttonVariants({ size: "lg" })} bg-teal-400 text-ink-900 hover:bg-[#2fc0c6]`}
                >
                  <WhatsAppIcon />
                  {t("CtaBand.primary")}
                </a>
                <Link
                  href="/arma-tu-viaje"
                  className={`${buttonVariants({ size: "lg", variant: "outline" })} border-white/30 text-white hover:bg-white/10`}
                >
                  {t("CtaBand.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
