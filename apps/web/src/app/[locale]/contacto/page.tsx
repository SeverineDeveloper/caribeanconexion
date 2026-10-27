import { formatPhoneDisplay } from "@cc/core";
import { Languages, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { whatsappNumber } from "@/lib/site";
import { ContactForm } from "./contact-form";

const PATH = "/contacto";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contacto">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contacto">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        eyebrow={t("ContactPage.eyebrow")}
        title={t("ContactPage.title")}
        lead={t("ContactPage.lead")}
      />

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal className="flex flex-col gap-5">
            <div className="rounded-panel bg-ink-900 p-6 text-white sm:p-10">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-whatsapp text-ink-900">
                <WhatsAppIcon className="size-7" />
              </span>
              <h2 className="mt-6 text-display-md">{t("ContactPage.whatsappTitle")}</h2>
              <p className="mt-2 text-white/75">{t("ContactPage.whatsappText")}</p>
              <p className="mt-6 font-display font-semibold text-3xl tracking-tight">
                {formatPhoneDisplay(whatsappNumber)}
              </p>
              <WhatsAppButton
                onDark
                message={t("WhatsApp.defaultMessage")}
                originCode="CC-WEB-CONTACTO-WA"
                className="mt-8 w-full sm:w-auto"
              >
                {t("CtaBand.primary")}
              </WhatsAppButton>
            </div>
            <InfoCard
              icon={<MapPin className="size-6" strokeWidth={1.75} />}
              title={t("ContactPage.zonesTitle")}
            >
              {t("ContactPage.zonesText")}
            </InfoCard>
            <InfoCard
              icon={<Languages className="size-6" strokeWidth={1.75} />}
              title={t("ContactPage.languagesTitle")}
            >
              {t("ContactPage.languagesText")}
            </InfoCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-panel border border-line bg-white p-6 shadow-card sm:p-10">
              <h2 className="text-display-md text-ink-900">{t("ContactPage.formTitle")}</h2>
              <div className="mt-8">
                <ContactForm whatsappNumber={whatsappNumber} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 rounded-card border border-line bg-white p-6 shadow-card">
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <h2 className="font-sans font-semibold text-ink-900 text-lg">{title}</h2>
        <p className="mt-1 text-ink-700">{children}</p>
      </div>
    </div>
  );
}
