import { formatUsd } from "@cc/core";
import { getTranslations } from "next-intl/server";
import type { ExcursionCardProps } from "@/components/site/excursion-card";
import { whatsappHref } from "@/components/site/whatsapp-button";
import {
  EXCURSIONS,
  type Excursion,
  excursionOriginCode,
  excursionPath,
} from "@/content/excursions";
import type { Locale } from "@/i18n/routing";

export type ExcursionCardItem = ExcursionCardProps & { slug: string; categoryId: string };

/** Precio de una excursión ya traducido: "Desde US$37" + "por persona", o "Precio a cotizar". */
export async function excursionPrice(excursion: Excursion, locale: Locale) {
  const t = await getTranslations({ locale, namespace: "ExcursionDetail" });
  return excursion.priceFromUsd === undefined
    ? { price: t("onRequest") }
    : {
        price: t("priceFrom", { price: formatUsd(excursion.priceFromUsd, locale) }),
        priceUnit: t("perPerson"),
      };
}

/** Datos de las cards de excursión (inicio, listado y "otras experiencias"). */
export async function excursionCards(
  locale: Locale,
  excursions: Excursion[] = EXCURSIONS,
): Promise<ExcursionCardItem[]> {
  const t = await getTranslations({ locale });
  return Promise.all(
    excursions.map(async (excursion) => {
      const title = t(`Excursions.items.${excursion.key}.title`);
      return {
        slug: excursion.slug,
        categoryId: excursion.category,
        image: excursion.cover,
        category: t(`Excursions.categories.${excursion.category}`),
        title,
        tagline: t(`Excursions.items.${excursion.key}.tagline`),
        detail: t(`Excursions.items.${excursion.key}.detail`),
        ...(await excursionPrice(excursion, locale)),
        ctaLabel: excursion.hasPage ? t("ExcursionDetail.seeDetails") : t("Excursions.cta"),
        href: excursion.hasPage ? excursionPath(excursion.slug) : undefined,
        whatsappUrl: whatsappHref(
          t("Excursions.waMessage", { name: title }),
          excursionOriginCode(excursion.slug),
        ),
      };
    }),
  );
}
