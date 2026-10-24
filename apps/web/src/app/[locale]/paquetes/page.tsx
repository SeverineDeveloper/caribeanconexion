import { buttonVariants } from "@heroui/styles";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import partyBoat from "@/assets/images/excursiones/party-boat.jpg";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CtaBand } from "@/components/site/cta-band";
import { PackageCard } from "@/components/site/package-card";
import { PageHero } from "@/components/site/page-hero";
import { WhatsAppButton, whatsappHref } from "@/components/site/whatsapp-button";
import { PACKAGES, packageOriginCode } from "@/content/packages";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";

const PATH = "/paquetes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/paquetes">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "PackagesPage" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PackagesPage({ params }: PageProps<"/[locale]/paquetes">) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations();

  return (
    <>
      <PageHero
        locale={locale}
        path={PATH}
        image={partyBoat}
        eyebrow={t("PackagesPage.eyebrow")}
        title={t("PackagesPage.title")}
        lead={t("PackagesPage.lead")}
      >
        <WhatsAppButton onDark message={t("WhatsApp.defaultMessage")} originCode="CC-PAQ-HERO">
          {t("Common.askWhatsapp")}
        </WhatsAppButton>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {PACKAGES.map((pkg) => {
              const title = t(`Packages.items.${pkg.key}.title`);
              return (
                <RevealItem key={pkg.key}>
                  <PackageCard
                    image={pkg.image}
                    icon={pkg.icon}
                    title={title}
                    idealForLabel={t("Packages.idealFor")}
                    idealFor={t(`Packages.items.${pkg.key}.idealFor`)}
                    text={t(`Packages.items.${pkg.key}.text`)}
                    includesLabel={t("Packages.includes")}
                    includes={t.raw(`Packages.items.${pkg.key}.includes`) as string[]}
                    customLabel={t("Packages.custom")}
                    ctaLabel={t("Packages.cta")}
                    whatsappUrl={whatsappHref(
                      t("Packages.waMessage", { name: title }),
                      packageOriginCode(pkg.slug),
                    )}
                  />
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal className="mt-12 lg:mt-16">
            <div className="flex flex-col items-start gap-6 rounded-panel bg-sand-200 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
              <div className="flex gap-5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-gold-700 shadow-card">
                  <Sparkles className="size-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-display-md text-ink-900">{t("PackagesPage.customTitle")}</h2>
                  <p className="mt-2 max-w-xl text-ink-700">{t("PackagesPage.customText")}</p>
                </div>
              </div>
              <Link href="/arma-tu-viaje" className={`${buttonVariants({ size: "lg" })} shrink-0`}>
                {t("PackagesPage.customCta")}
                <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
          <p className="mt-6 text-center text-ink-500 text-sm">{t("Common.referencePrices")}</p>
        </div>
      </section>

      <CtaBand originCode="CC-PAQ-CTA" />
    </>
  );
}
