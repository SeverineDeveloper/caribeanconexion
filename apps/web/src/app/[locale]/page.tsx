import { buildWhatsAppUrl } from "@cc/core";
import { buttonVariants } from "@heroui/styles";
import {
  ArrowRight,
  BedDouble,
  Briefcase,
  CarFront,
  CircleCheck,
  ClipboardCheck,
  Gift,
  type LucideIcon,
  MapPin,
  MessagesSquare,
  Sailboat,
  ShoppingBasket,
  TreePalm,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { HeroVisual } from "@/components/site/hero-visual";
import { SectionHeader } from "@/components/site/section-header";
import { Link } from "@/i18n/navigation";
import { whatsappNumber } from "@/lib/site";

export default async function HomePage() {
  const t = await getTranslations();
  const tNav = await getTranslations("Nav");
  const whatsappUrl = (origin: string) =>
    buildWhatsAppUrl(whatsappNumber, t("WhatsApp.defaultMessage"), origin);

  const trust = [t("Hero.trust1"), t("Hero.trust2"), t("Hero.trust3")];

  const steps: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: MessagesSquare, title: t("HowItWorks.step1Title"), text: t("HowItWorks.step1Text") },
    { icon: ClipboardCheck, title: t("HowItWorks.step2Title"), text: t("HowItWorks.step2Text") },
    { icon: TreePalm, title: t("HowItWorks.step3Title"), text: t("HowItWorks.step3Text") },
  ];

  const services: { icon: LucideIcon; href: string; title: string; text: string }[] = [
    {
      icon: BedDouble,
      href: "/alojamiento",
      title: tNav("accommodation"),
      text: t("Services.accommodationText"),
    },
    {
      icon: CarFront,
      href: "/traslados",
      title: tNav("transfers"),
      text: t("Services.transfersText"),
    },
    {
      icon: Sailboat,
      href: "/excursiones",
      title: tNav("excursions"),
      text: t("Services.excursionsText"),
    },
    { icon: Gift, href: "/paquetes", title: tNav("packages"), text: t("Services.packagesText") },
    {
      icon: ShoppingBasket,
      href: "/servicios",
      title: tNav("services"),
      text: t("Services.extrasText"),
    },
    { icon: Briefcase, href: "/grupos", title: tNav("groups"), text: t("Services.groupsText") },
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

      {/* ── Cómo funciona ────────────────────────────────────── */}
      <section className="section-y bg-sand-100">
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

      {/* ── Qué organizamos ──────────────────────────────────── */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeader
            eyebrow={t("Services.eyebrow")}
            title={t("Services.title")}
            lead={t("Services.lead")}
          />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
            {services.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-card transition duration-150 hover:-translate-y-0.5 hover:border-teal-400/50 hover:shadow-raised sm:p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <service.icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-sans font-semibold text-ink-900 text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-ink-700">{service.text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-sm text-teal-600">
                    {t("Services.more")}
                    <ArrowRight
                      className="size-4 transition-transform duration-150 group-hover:translate-x-1"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-panel bg-ink-900 px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 600 300"
              className="pointer-events-none absolute right-0 bottom-0 w-[38rem] max-w-none opacity-90"
            >
              <circle cx="470" cy="90" r="52" fill="#C9A227" />
              <path
                d="M120 230c60-34 120-34 180 0s120 34 180 0 90-30 120-20"
                fill="none"
                stroke="#0FB5B0"
                strokeOpacity="0.5"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M220 275c50-28 100-28 150 0s100 28 150 0 60-20 80-14"
                fill="none"
                stroke="#0FB5B0"
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
                  className={`${buttonVariants({ size: "lg" })} bg-teal-400 text-ink-900 hover:bg-[#3cc6c2]`}
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
