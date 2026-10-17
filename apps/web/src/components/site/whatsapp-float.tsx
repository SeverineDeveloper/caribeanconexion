import { buildWhatsAppUrl } from "@cc/core";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { whatsappNumber } from "@/lib/site";

export async function WhatsAppFloat() {
  const t = await getTranslations("WhatsApp");
  const href = buildWhatsAppUrl(whatsappNumber, t("defaultMessage"), "CC-FLOAT");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={t("float")}
      className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-ink-900 shadow-raised transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-ink-900 focus-visible:outline-offset-2 sm:h-13 sm:w-auto sm:px-5"
    >
      <WhatsAppIcon className="size-6 sm:size-5" />
      <span className="hidden sm:inline">{t("float")}</span>
    </a>
  );
}
