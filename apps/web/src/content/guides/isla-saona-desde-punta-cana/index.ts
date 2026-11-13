import cover from "@/assets/images/excursiones/saona-clasica/portada.jpg";
import type { Guide } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

export const islaSaona: Guide = {
  slug: "isla-saona-desde-punta-cana",
  cover,
  published: "2026-11-12",
  modified: "2026-11-12",
  related: ["saona-clasica", "saona-vip", "yate-de-lujo", "isla-catalina"],
  text: { es, en, fr },
};
