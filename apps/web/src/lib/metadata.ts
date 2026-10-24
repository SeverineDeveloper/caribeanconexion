import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Metadatos de una página interior con canonical y hreflang por idioma. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
    },
    openGraph: { title, description, url: `/${locale}${path}`, locale },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
