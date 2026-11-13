import cover from "@/assets/images/hero-playa.jpg";
import type { Guide } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

export const trasladoAeropuerto: Guide = {
  slug: "traslado-aeropuerto-punta-cana",
  cover,
  published: "2026-11-12",
  modified: "2026-11-12",
  related: ["buggies", "lancha-rapida", "snorkeling", "saona-clasica"],
  text: { es, en, fr },
};
