import cover from "@/assets/images/excursiones/buggies/portada.jpg";
import type { Guide } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

export const queHacer: Guide = {
  slug: "que-hacer-en-punta-cana",
  cover,
  published: "2026-11-12",
  modified: "2026-11-12",
  related: ["saona-clasica", "yate-de-lujo", "buggies", "lancha-rapida"],
  text: { es, en, fr },
};
