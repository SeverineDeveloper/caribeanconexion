import type { StaticImageData } from "next/image";
import buggies from "@/assets/images/excursiones/buggies.jpg";
import catalina from "@/assets/images/excursiones/isla-catalina.jpg";
import partyBoat from "@/assets/images/excursiones/party-boat.jpg";
import samana from "@/assets/images/excursiones/samana.jpg";
import santoDomingo from "@/assets/images/excursiones/santo-domingo.jpg";
import saonaClasica from "@/assets/images/excursiones/saona-clasica.jpg";
import saonaVip from "@/assets/images/excursiones/saona-vip.jpg";
import zipline from "@/assets/images/excursiones/tirolesa.jpg";

/**
 * Excursiones del catálogo del cliente (docs/brand/originales, PDF págs. 2-5).
 * Contenido provisional: en M1 sale del catálogo administrable del panel.
 * Fotos de baja resolución hasta recibir las definitivas.
 */
export const EXCURSION_CATEGORIES = ["sea", "adventure", "culture", "nature"] as const;
export type ExcursionCategory = (typeof EXCURSION_CATEGORIES)[number];

export type Excursion = {
  slug: string;
  /** Clave en messages/*.json → Excursions.items.<key> */
  key:
    | "saonaClasica"
    | "saonaVip"
    | "catalina"
    | "buggies"
    | "partyBoat"
    | "santoDomingo"
    | "samana"
    | "zipline";
  category: ExcursionCategory;
  image: StaticImageData;
};

export const EXCURSIONS: Excursion[] = [
  { slug: "saona-clasica", key: "saonaClasica", category: "sea", image: saonaClasica },
  { slug: "saona-vip", key: "saonaVip", category: "sea", image: saonaVip },
  { slug: "isla-catalina", key: "catalina", category: "sea", image: catalina },
  { slug: "buggies", key: "buggies", category: "adventure", image: buggies },
  { slug: "party-boat", key: "partyBoat", category: "sea", image: partyBoat },
  { slug: "santo-domingo", key: "santoDomingo", category: "culture", image: santoDomingo },
  { slug: "samana", key: "samana", category: "nature", image: samana },
  { slug: "tirolesa", key: "zipline", category: "adventure", image: zipline },
];

/** Código de origen para el mensaje de WhatsApp (ver @cc/core extractOriginCode). */
export function excursionOriginCode(slug: string): string {
  return `CC-EXC-${slug.toUpperCase()}`;
}
