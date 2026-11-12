import { excursionPath, excursionsWithPage } from "@/content/excursions";
import { GUIDES, guidePath } from "@/content/guides";

/**
 * Páginas públicas indexables (ruta sin idioma). Fuente única del sitemap y de llms.txt:
 * al crear una página pública, añadirla aquí. Las legales quedan fuera mientras sean
 * `noindex` (texto pendiente de revisión legal).
 */
const STATIC_PAGES = [
  "",
  "/excursiones",
  "/traslados",
  "/alojamiento",
  "/paquetes",
  "/servicios",
  "/arma-tu-viaje",
  "/guias",
  "/sobre-nosotros",
  "/grupos",
  "/agencias",
  "/propietarios",
  "/contacto",
] as const;

export type PublicPage = { path: string; lastModified?: string };

export function publicPages(): PublicPage[] {
  return [
    ...STATIC_PAGES.map((path) => ({ path })),
    ...excursionsWithPage().map((excursion) => ({ path: excursionPath(excursion.slug) })),
    ...GUIDES.map((guide) => ({ path: guidePath(guide.slug), lastModified: guide.modified })),
  ];
}
