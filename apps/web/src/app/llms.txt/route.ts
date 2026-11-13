import { formatList, formatPhoneDisplay } from "@cc/core";
import { getTranslations } from "next-intl/server";
import { BUSINESS } from "@/content/business";
import { EXCURSIONS, excursionPath, excursionsWithPage } from "@/content/excursions";
import { GUIDES, guidePath } from "@/content/guides";
import { ROUTE_KEYS, VEHICLE_KEYS } from "@/content/services";
import { routing } from "@/i18n/routing";
import { excursionFactValues, inSentence } from "@/lib/excursion-faq";
import { pageUrl, siteUrl, whatsappNumber } from "@/lib/site";

/**
 * /llms.txt (llmstxt.org): resumen en Markdown para asistentes de IA, con los datos clave
 * de cada página y enlaces. En inglés, el idioma que mejor usan los modelos para responder
 * en cualquier otro. Se genera del catálogo y de los mensajes: no se mantiene a mano.
 */
export const dynamic = "force-static";

const LOCALE = "en";

/** Páginas con su espacio de nombres de mensajes (metaTitle y metaDescription). */
const PAGES = {
  services: [
    ["/traslados", "TransfersPage"],
    ["/alojamiento", "StaysPage"],
    ["/paquetes", "PackagesPage"],
    ["/servicios", "ServicesPage"],
    ["/grupos", "GroupsPage"],
    ["/arma-tu-viaje", "Planner"],
  ],
  company: [
    ["/sobre-nosotros", "AboutPage"],
    ["/contacto", "ContactPage"],
    ["/agencias", "AgenciesPage"],
    ["/propietarios", "OwnersPage"],
  ],
} as const;

type PageNamespace = (typeof PAGES)[keyof typeof PAGES][number][1];

export async function GET() {
  const t = await getTranslations({ locale: LOCALE });
  const url = (path: string) => pageUrl(LOCALE, path);
  const link = (label: string, path: string, text: string) => `- [${label}](${url(path)}): ${text}`;
  const pageLinks = (pages: readonly (readonly [string, PageNamespace])[]) =>
    pages.map(([path, ns]) => link(t(`${ns}.metaTitle`), path, t(`${ns}.metaDescription`)));

  const excursionLines = excursionsWithPage().map((excursion) => {
    const { key } = excursion;
    const values = excursionFactValues(excursion, LOCALE);
    const includes = t.raw(`ExcursionPages.${key}.includes`) as string[];
    const facts = [
      values.price ? `From ${values.price} per person.` : "Price on request.",
      values.duration && `Duration: ${values.duration}.`,
      excursion.schedules && `Schedule${excursion.daily ? " (every day)" : ""}: ${values.hours}.`,
      includes.length > 0 && `Includes ${formatList(includes.map(inSentence), LOCALE)}.`,
    ].filter(Boolean);
    return link(
      t(`Excursions.items.${key}.title`),
      excursionPath(excursion.slug),
      `${t(`ExcursionPages.${key}.metaDescription`)} ${facts.join(" ")}`,
    );
  });
  const onRequest = EXCURSIONS.filter((e) => !e.hasPage).map(
    (e) => `${t(`Excursions.items.${e.key}.title`)} (${t(`Excursions.items.${e.key}.tagline`)})`,
  );

  const routes = ROUTE_KEYS.map(
    (route) => `${t(`Transfers.routes.${route}.to`)} ${t(`Transfers.routes.${route}.time`)}`,
  );
  const vehicles = VEHICLE_KEYS.map(
    (vehicle) =>
      `${t(`Transfers.vehicles.${vehicle}.name`)} (${t(`Transfers.vehicles.${vehicle}.capacity`).toLowerCase()})`,
  );

  const body = [
    `# ${BUSINESS.name}`,
    "",
    `> ${BUSINESS.name} is a local travel concierge in Punta Cana, Dominican Republic. It organizes excursions, private airport transfers from Punta Cana International Airport (PUJ), vacation rentals, travel packages and concierge services in ${formatList(BUSINESS.areaServed, LOCALE)}. Travelers book through WhatsApp (${formatPhoneDisplay(whatsappNumber)}) in Spanish, English or French. Prices on the site are reference "from" prices in US dollars; the final price depends on date, season, availability and group size, and is always confirmed before payment.`,
    "",
    `The site is available in ${formatList(["Spanish (default)", "English", "French"], LOCALE)}, with the same paths in every language: ${routing.locales.map((l) => pageUrl(l, "")).join(", ")}.`,
    "",
    "## Excursions in Punta Cana",
    "",
    link(t("ExcursionsPage.metaTitle"), "/excursiones", t("ExcursionsPage.metaDescription")),
    ...excursionLines,
    `- Also available on request: ${onRequest.join("; ")}.`,
    "",
    "## Airport transfers and travel services",
    "",
    link(
      t("TransfersPage.metaTitle"),
      "/traslados",
      `${t("TransfersPage.metaDescription")} Approximate drive times from PUJ: ${routes.join("; ")}. Vehicles: ${vehicles.join(", ")}.`,
    ),
    ...pageLinks(PAGES.services.slice(1)),
    "",
    "## Travel guides",
    "",
    ...GUIDES.map((guide) =>
      link(guide.text.en.title, guidePath(guide.slug), guide.text.en.description),
    ),
    "",
    "## Company",
    "",
    ...pageLinks(PAGES.company),
    `- WhatsApp: https://wa.me/${whatsappNumber}`,
    "",
    "## Optional",
    "",
    `- [Sitemap](${siteUrl}/sitemap.xml): every page in Spanish, English and French.`,
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
