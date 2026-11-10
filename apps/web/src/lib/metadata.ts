import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import defaultShareImage from "@/assets/brand/opengraph.jpg";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site";

/**
 * Imagen para compartir (WhatsApp, redes) con URL absoluta. Se arma a mano y no con el
 * archivo convencional app/opengraph-image.jpg: ese queda fuera del layout que define
 * metadataBase y salía con "http://localhost:3000".
 */
export function shareImage(image: StaticImageData = defaultShareImage) {
  return { url: absoluteUrl(image.src), width: image.width, height: image.height };
}

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
  /** Imagen para compartir; sin ella, la general de la marca. */
  image?: StaticImageData;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    },
    // openGraph de la página reemplaza entero al del layout: la imagen va siempre.
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      locale,
      images: [shareImage(image)],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
