import { islaSaona } from "./isla-saona-desde-punta-cana";
import { queHacer } from "./que-hacer-en-punta-cana";
import { trasladoAeropuerto } from "./traslado-aeropuerto-punta-cana";
import type { Guide } from "./types";

export type { Guide, GuideBlock, GuideSection, GuideText } from "./types";

/** Guías publicadas, en el orden del índice /guias. */
export const GUIDES: Guide[] = [queHacer, islaSaona, trasladoAeropuerto];

export function guidePath(slug: string): `/guias/${string}` {
  return `/guias/${slug}`;
}

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
