import logo from "@/assets/brand/logo-horizontal-light.png";
import shareImage from "@/assets/brand/opengraph.jpg";
import { BUSINESS, businessProfiles } from "@/content/business";
import { routing } from "@/i18n/routing";
import { absoluteUrl, siteUrl, whatsappNumber } from "@/lib/site";

/**
 * Datos estructurados (schema.org) compartidos. La organización se publica una vez por
 * página en el layout y el resto de bloques la referencian por su @id, así buscadores e
 * IAs entienden que excursiones, guías y páginas son de la misma empresa.
 */
export const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

export const organizationRef = { "@id": ORGANIZATION_ID };
export const websiteRef = { "@id": WEBSITE_ID };

const LANGUAGE_NAMES = ["Spanish", "English", "French"];

/** Empresa (TravelAgency) y sitio web, para el layout de cada idioma. */
export function siteGraphLd({ locale, description }: { locale: string; description: string }) {
  const telephone = `+${whatsappNumber}`;
  const sameAs = businessProfiles();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": ORGANIZATION_ID,
        name: BUSINESS.name,
        alternateName: BUSINESS.alternateName,
        url: `${siteUrl}/${locale}`,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(logo.src),
          width: logo.width,
          height: logo.height,
        },
        image: absoluteUrl(shareImage.src),
        description,
        telephone,
        ...(BUSINESS.email && { email: BUSINESS.email }),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "reservations",
          telephone,
          url: `https://wa.me/${whatsappNumber}`,
          availableLanguage: LANGUAGE_NAMES,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: BUSINESS.address.locality,
          addressRegion: BUSINESS.address.region,
          addressCountry: BUSINESS.address.country,
        },
        areaServed: [
          ...BUSINESS.areaServed.map((name) => ({ "@type": "City", name })),
          { "@type": "Country", name: "Dominican Republic" },
        ],
        knowsLanguage: routing.locales,
        ...(sameAs.length > 0 && { sameAs }),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${siteUrl}/${locale}`,
        name: BUSINESS.name,
        inLanguage: routing.locales,
        publisher: organizationRef,
      },
    ],
  };
}
