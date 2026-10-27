import { buttonVariants } from "@heroui/styles";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { WhatsAppButton } from "./whatsapp-button";

/** Franja final de conversión, igual en todas las páginas. */
export async function CtaBand({ originCode }: { originCode: string }) {
  const t = await getTranslations();

  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal>
          {/* pb-44 en móvil: el sol y las olas quedan debajo de los botones, no sobre el texto */}
          <div className="relative overflow-hidden rounded-panel bg-ink-900 px-6 pt-12 pb-44 sm:px-12 sm:py-14 lg:px-16 lg:py-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 600 300"
              className="pointer-events-none absolute right-0 bottom-0 w-[24rem] max-w-none opacity-90 sm:w-[38rem]"
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
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
                <WhatsAppButton
                  onDark
                  message={t("WhatsApp.defaultMessage")}
                  originCode={originCode}
                >
                  {t("CtaBand.primary")}
                </WhatsAppButton>
                <Link
                  href="/arma-tu-viaje"
                  className={`${buttonVariants({ size: "lg", variant: "outline" })} border-white/30 text-white hover:bg-white/10`}
                >
                  {t("CtaBand.secondary")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
