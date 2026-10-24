import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "./page-hero";
import { WhatsAppButton } from "./whatsapp-button";

type Namespace = "GroupsPage" | "AgenciesPage" | "OwnersPage";

/** Plantilla para grupos, agencias y propietarios: beneficios y un llamado a WhatsApp. */
export async function B2BPage({
  locale,
  path,
  namespace,
  image,
  icons,
  originCode,
}: {
  locale: string;
  path: string;
  namespace: Namespace;
  image: StaticImageData;
  icons: LucideIcon[];
  originCode: string;
}) {
  const t = await getTranslations(namespace);
  const benefits = t.raw("benefits") as { title: string; text: string }[];

  return (
    <>
      <PageHero
        locale={locale}
        path={path}
        image={image}
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
      >
        <WhatsAppButton onDark message={t("waMessage")} originCode={`${originCode}-HERO`}>
          {t("cta")}
        </WhatsAppButton>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:gap-8">
            {benefits.map((benefit, i) => {
              const Icon = icons[i % icons.length];
              return (
                <RevealItem
                  key={benefit.title}
                  className="flex gap-5 rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
                >
                  {Icon && (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                      <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  )}
                  <div>
                    <h2 className="font-sans font-semibold text-ink-900 text-xl">
                      {benefit.title}
                    </h2>
                    <p className="mt-2 text-ink-700">{benefit.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>

          <Reveal className="mt-12 lg:mt-16">
            <div className="flex flex-col items-start gap-6 rounded-panel bg-ink-900 p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
              <h2 className="max-w-xl text-display-md">{t("title")}</h2>
              <WhatsAppButton
                onDark
                message={t("waMessage")}
                originCode={`${originCode}-CTA`}
                className="shrink-0"
              >
                {t("cta")}
              </WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
