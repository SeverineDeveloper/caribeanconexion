import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { publicPages } from "@/lib/public-pages";
import { indexable, pageUrl } from "@/lib/site";

// Se genera al compilar (también en el export estático de la vista previa).
export const dynamic = "force-static";

/**
 * Sitemap con cada página en los tres idiomas y sus alternativas hreflang. Sin fecha de
 * modificación salvo donde es real (guías): la del build engañaría a los buscadores.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];

  return publicPages().flatMap(({ path, lastModified }) => {
    const languages = {
      ...Object.fromEntries(routing.locales.map((l) => [l, pageUrl(l, path)])),
      "x-default": pageUrl(routing.defaultLocale, path),
    };
    return routing.locales.map((locale) => ({
      url: pageUrl(locale, path),
      ...(lastModified && { lastModified }),
      alternates: { languages },
    }));
  });
}
