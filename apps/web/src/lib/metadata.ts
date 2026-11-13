import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import defaultShareImage from "@/assets/brand/opengraph.jpg";
import { type Locale, routing } from "@/i18n/routing";
import { absoluteUrl, indexable } from "@/lib/site";

export const SITE_NAME = "Conexión Caribe";

/** Locale de Open Graph (formato idioma_PAÍS). */
const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_US", fr: "fr_FR" };

/**
 * Imagen para compartir (WhatsApp, redes) con URL absoluta. Se arma a mano y no con el
 * archivo convencional app/opengraph-image.jpg: ese queda fuera del layout que define
 * metadataBase y salía con "http://localhost:3000".
 */
export function shareImage(image: StaticImageData = defaultShareImage) {
  return { url: absoluteUrl(image.src), width: image.width, height: image.height };
}

/** hreflang de una ruta en todos los idiomas, más x-default (el idioma por defecto). */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    "x-default": `/${routing.defaultLocale}${path}`,
  };
}

/** Open Graph común: nombre del sitio, idioma y sus alternativas. */
export function openGraphBase(locale: Locale) {
  return {
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale],
    alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
  };
}

/** Sin indexar en la vista previa; en las demás, según la página. */
export function robotsFor(noindex: boolean): Metadata["robots"] {
  if (!indexable) return { index: false, follow: false };
  return noindex ? { index: false, follow: true } : undefined;
}

/** Metadatos de una página interior con canonical y hreflang por idioma. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
  image,
  article,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** Imagen para compartir; sin ella, la general de la marca. */
  image?: StaticImageData;
  /** Fechas ISO (AAAA-MM-DD) de un artículo; sin ellas, la página es "website". */
  article?: { published: string; modified: string };
}): Metadata {
  const robots = robotsFor(noindex);
  return {
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages: languageAlternates(path) },
    // openGraph de la página reemplaza entero al del layout: la imagen va siempre.
    openGraph: {
      ...openGraphBase(locale),
      title,
      description,
      url: `/${locale}${path}`,
      images: [shareImage(image)],
      ...(article
        ? { type: "article", publishedTime: article.published, modifiedTime: article.modified }
        : { type: "website" }),
    },
    ...(robots ? { robots } : {}),
  };
}
