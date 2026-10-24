import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton, whatsappHref } from "@/components/site/whatsapp-button";
import { SERVICES } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/servicios";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/servicios">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/servicios">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        eyebrow={t("ServicesPage.eyebrow")}
        title={t("ServicesPage.title")}
        lead={t("ServicesPage.lead")}
      >
        <WhatsAppButton onDark message={t("WhatsApp.defaultMessage")} originCode="CC-SERV-HERO">
          {t("ServicesPage.cta")}
        </WhatsAppButton>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SERVICES.map((service) => {
              const title = t(`Services.detail.${service.key}.title`);
              return (
                <RevealItem
                  key={service.key}
                  className="group flex flex-col rounded-card border border-line bg-white p-6 shadow-card transition duration-150 hover:-translate-y-0.5 hover:shadow-raised sm:p-8"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <service.icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 font-sans font-semibold text-ink-900 text-xl">{title}</h2>
                  <p className="mt-2 flex-1 text-ink-700">
                    {t(`Services.detail.${service.key}.text`)}
                  </p>
                  <a
                    href={whatsappHref(
                      t("ServicesPage.waMessage", { name: title }),
                      `CC-SERV-${service.key.toUpperCase()}`,
                    )}
                    target="_blank"
                    rel="noopener"
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-sm text-teal-600 hover:text-teal-700"
                  >
                    <WhatsAppIcon className="size-4" />
                    {t("Common.askWhatsapp")}
                    <span className="sr-only">: {title}</span>
                  </a>
                </RevealItem>
              );
            })}
          </RevealGroup>
          <p className="mt-10 text-center text-ink-500 text-sm">{t("Common.referencePrices")}</p>
        </div>
      </section>

      <CtaBand originCode="CC-SERV-CTA" />
    </>
  );
}
