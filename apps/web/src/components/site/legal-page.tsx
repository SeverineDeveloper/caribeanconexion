import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "./page-hero";
import { WhatsAppButton } from "./whatsapp-button";

export type LegalDoc = "privacy" | "terms" | "cancellation";

/**
 * Páginas legales en preparación: no se publica texto legal sin revisión de un abogado
 * (REQUERIMIENTOS.md §6). Mientras tanto se explica y se ofrece el canal de consulta.
 */
export async function LegalPage({
  locale,
  path,
  doc,
}: {
  locale: string;
  path: string;
  doc: LegalDoc;
}) {
  const t = await getTranslations("LegalPage");
  const title = t(doc);

  return (
    <>
      <PageHero locale={locale} path={path} eyebrow={title} title={title} />
      <section className="section-y">
        <div className="container-page max-w-3xl">
          <Reveal>
            <div className="rounded-panel border border-line bg-white p-6 shadow-card sm:p-12">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-sand-100 text-ink-900">
                <FileText className="size-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-display-md text-ink-900">{t("pendingTitle")}</h2>
              <p className="mt-3 text-ink-700 text-lead">{t("pendingText")}</p>
              <WhatsAppButton
                message={t("waMessage", { name: title })}
                originCode={`CC-LEGAL-${doc.toUpperCase()}`}
                className="mt-8 w-full sm:w-auto"
              >
                {t("contactCta")}
              </WhatsAppButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
