import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { routing } from "@/i18n/routing";

/** Metadatos de una página interior con canonical y hreflang por idioma. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
  image,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** Imagen para compartir; sin ella se usa app/opengraph-image.jpg. */
  image?: StaticImageData;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      locale,
      ...(image ? { images: [{ url: image.src, width: image.width, height: image.height }] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
