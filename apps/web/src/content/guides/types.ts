import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/routing";
import type { ExcursionSlug } from "../generated/excursion-media";

/**
 * Guías de destino. Son textos largos: viven aquí y no en messages/*.json porque
 * NextIntlClientProvider manda todos los mensajes al navegador en cada página; así solo
 * pesan en la guía que se abre.
 *
 * En los textos, `[texto](/ruta)` es un enlace interno (ver parseInlineLinks de @cc/core).
 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  /** Tabla de dos columnas (dato → valor). */
  | { type: "table"; head: [string, string]; rows: [string, string][] }
  /**
   * Tablas que se generan con los datos del catálogo (precios, duraciones, rutas y
   * vehículos), para que la guía nunca repita cifras a mano.
   */
  | { type: "excursionTable" }
  | { type: "transferRoutes" }
  | { type: "transferVehicles" };

export type GuideSection = { heading: string; blocks: GuideBlock[] };

export type GuideText = {
  /** H1 de la página. */
  title: string;
  /** Título para buscadores (se le añade " · Conexión Caribe"). */
  metaTitle: string;
  /** Meta descripción y texto de la tarjeta del índice. */
  description: string;
  lead: string;
  /** Respuesta corta del bloque "En breve": lo primero que leen buscadores e IAs. */
  summary: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
};

export type Guide = {
  slug: string;
  cover?: StaticImageData;
  /** Fechas ISO (AAAA-MM-DD). Cambiar `modified` al actualizar el contenido. */
  published: string;
  modified: string;
  /** Excursiones que se muestran al final como relacionadas. */
  related: ExcursionSlug[];
  text: Record<Locale, GuideText>;
};
