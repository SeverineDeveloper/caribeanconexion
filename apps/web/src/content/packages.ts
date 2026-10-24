import { Cake, Crown, Heart, type LucideIcon, PiggyBank, Sailboat, Users } from "lucide-react";
import type { StaticImageData } from "next/image";
import buggies from "@/assets/images/excursiones/buggies.jpg";
import catalina from "@/assets/images/excursiones/isla-catalina.jpg";
import partyBoat from "@/assets/images/excursiones/party-boat.jpg";
import saonaClasica from "@/assets/images/excursiones/saona-clasica.jpg";
import saonaVip from "@/assets/images/excursiones/saona-vip.jpg";
import heroPlaya from "@/assets/images/hero-playa.jpg";

/**
 * Paquetes plantilla del documento base (§5). Contenido provisional hasta M1, cuando los
 * paquetes salen del catálogo del panel. Las fotos se reutilizan del catálogo PDF.
 */
export type PackageKey = "couple" | "family" | "friends" | "birthday" | "budget" | "premium";

export const PACKAGES: {
  key: PackageKey;
  slug: string;
  icon: LucideIcon;
  image: StaticImageData;
}[] = [
  { key: "couple", slug: "pareja-caribe", icon: Heart, image: saonaClasica },
  { key: "family", slug: "familia-punta-cana", icon: Users, image: catalina },
  { key: "friends", slug: "amigos-aventura", icon: Sailboat, image: buggies },
  { key: "birthday", slug: "cumpleanos-caribe", icon: Cake, image: partyBoat },
  { key: "budget", slug: "escapada-economica", icon: PiggyBank, image: heroPlaya },
  { key: "premium", slug: "experiencia-premium", icon: Crown, image: saonaVip },
];

export function packageOriginCode(slug: string): string {
  return `CC-PAQ-${slug.toUpperCase()}`;
}
