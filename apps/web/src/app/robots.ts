import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";

// Se genera al compilar (también en el export estático de la vista previa).
export const dynamic = "force-static";

/** Zonas privadas: el panel y la API. */
const PRIVATE = ["/admin", "/api"];

/**
 * Rastreadores de IA admitidos de forma explícita: los que buscan en tiempo real para
 * responder (ChatGPT, Claude, Perplexity) y los que entrenan modelos. Es una web
 * comercial: cuanto más la conozcan, más la recomiendan. Un bot con grupo propio ignora
 * el de "*", por eso cada grupo repite las zonas privadas.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Vista previa: fuera de buscadores (ver `indexable`).
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
