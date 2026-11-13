/**
 * Formatos de precio, hora y duración para la web pública (es, en, fr).
 * Se fija la región de cada idioma para que el resultado sea estable:
 * el dólar se muestra siempre como dólar estadounidense y la hora como en RD.
 */
const CURRENCY_LOCALE: Record<string, string> = { es: "es-DO", en: "en-CA", fr: "fr-FR" };
const TIME_LOCALE: Record<string, string> = { es: "es-DO", en: "en-US", fr: "fr-FR" };

/** Precio en dólares sin decimales: "US$37" (es, en) o "37 $US" (fr). */
export function formatUsd(amount: number, locale: string): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[locale] ?? locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Hora "HH:MM" (24 h) en el formato del idioma: "8:30 a. m.", "8:30 AM" o "8:30". */
export function formatTime(hhmm: string, locale: string): string {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!match) throw new Error(`Hora inválida: ${hhmm}`);
  const date = new Date(Date.UTC(2000, 0, 1, Number(match[1]), Number(match[2])));
  return new Intl.DateTimeFormat(TIME_LOCALE[locale] ?? locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

/** Duración en minutos como "4 h", "3 h 30 min" o "45 min" (igual en es, en y fr). */
export function formatDuration(minutes: number): string {
  if (!Number.isInteger(minutes) || minutes <= 0) throw new Error(`Duración inválida: ${minutes}`);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Enumeración natural: "a, b y c" (es), "a, b, and c" (en), "a, b et c" (fr). */
export function formatList(items: string[], locale: string): string {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);
}

/** Fecha ISO "AAAA-MM-DD" en formato largo: "12 de noviembre de 2026", "November 12, 2026". */
export function formatDateLong(iso: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Fecha inválida: ${iso}`);
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/**
 * Quita el punto doble que queda cuando una frase termina en una abreviatura con punto,
 * como las horas en español ("2:00 p. m.") seguidas del punto final de la plantilla.
 */
export function tidyPunctuation(text: string): string {
  return text.replace(/(?<!\.)\.\.(?=\s|$)/g, ".");
}
