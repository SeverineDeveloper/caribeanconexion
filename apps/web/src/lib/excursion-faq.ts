import { formatDuration, formatList, formatTime, formatUsd, tidyPunctuation } from "@cc/core";
import { getTranslations } from "next-intl/server";
import type { FaqItem } from "@/components/site/faq";
import type { ExcursionSchedule, ExcursionWithPage } from "@/content/excursions";
import type { Locale } from "@/i18n/routing";

/** "8:00 a. m. – 12:00 p. m." o solo la salida si no hay hora de regreso. */
export function scheduleText(schedule: ExcursionSchedule, locale: Locale) {
  const from = formatTime(schedule.from, locale);
  return schedule.to ? `${from} – ${formatTime(schedule.to, locale)}` : from;
}

/** Minúscula inicial para usar un ítem dentro de una frase, salvo siglas ("VIP"). */
export function inSentence(item: string) {
  const second = item.charAt(1);
  return second && second === second.toUpperCase() && second !== second.toLowerCase()
    ? item
    : item.charAt(0).toLowerCase() + item.slice(1);
}

/**
 * Datos de la excursión listos para frases (resumen "En breve" y FAQ). Salen del
 * catálogo, así los textos nunca repiten cifras a mano. Vacíos si no hay dato.
 */
export function excursionFactValues(excursion: ExcursionWithPage, locale: Locale) {
  const schedules = excursion.schedules ?? [];
  return {
    price: excursion.priceFromUsd === undefined ? "" : formatUsd(excursion.priceFromUsd, locale),
    duration: excursion.durationMinutes ? formatDuration(excursion.durationMinutes) : "",
    times: formatList([...new Set(schedules.map((s) => formatTime(s.from, locale)))], locale),
    hours: formatList(
      schedules.map((s) => scheduleText(s, locale)),
      locale,
    ),
  };
}

/**
 * Preguntas frecuentes de una excursión: las comunes se arman con plantillas y los datos
 * del catálogo (solo las que tienen dato) y se suman las propias de cada actividad.
 */
export async function excursionFaq(
  excursion: ExcursionWithPage,
  locale: Locale,
): Promise<FaqItem[]> {
  const t = await getTranslations({ locale });
  const { key } = excursion;
  const name = t(`ExcursionPages.${key}.faqName`);
  const values = excursionFactValues(excursion, locale);
  const includes = t.raw(`ExcursionPages.${key}.includes`) as string[];

  const items: FaqItem[] = [
    {
      q: t("ExcursionFaq.priceQ", { name }),
      a:
        excursion.priceFromUsd === undefined
          ? t("ExcursionFaq.priceOnRequestA")
          : t("ExcursionFaq.priceA", { price: values.price }),
    },
  ];
  if (excursion.durationMinutes) {
    items.push({
      q: t("ExcursionFaq.durationQ", { name }),
      a: t("ExcursionFaq.durationA", { duration: values.duration }),
    });
  }
  if (excursion.schedules) {
    const hours = excursion.schedules.map((schedule) =>
      schedule.label
        ? `${scheduleText(schedule, locale)} (${t(`ExcursionDetail.scheduleLabels.${schedule.label}`)})`
        : scheduleText(schedule, locale),
    );
    items.push({
      q: t("ExcursionFaq.schedulesQ", { name }),
      a: t("ExcursionFaq.schedulesA", {
        daily: excursion.daily ? "yes" : "no",
        hours: formatList(hours, locale),
      }),
    });
  }
  if (includes.length > 0) {
    items.push({
      q: t("ExcursionFaq.includesQ", { name }),
      a: t("ExcursionFaq.includesA", { includes: formatList(includes.map(inSentence), locale) }),
    });
  }
  items.push(...(t.raw(`ExcursionPages.${key}.faqExtra`) as FaqItem[]));
  items.push({ q: t("ExcursionFaq.bookQ", { name }), a: t("ExcursionFaq.bookA") });
  return items.map((item) => ({ q: item.q, a: tidyPunctuation(item.a) }));
}
