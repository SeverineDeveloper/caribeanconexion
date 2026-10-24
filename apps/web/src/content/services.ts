import {
  Camera,
  Car,
  CarFront,
  ChefHat,
  Flower2,
  type LucideIcon,
  PartyPopper,
  ShoppingBasket,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

/** Servicios del catálogo (PDF pág. 7). Textos en messages/<idioma>/catalog.json → Services.detail */
export type ServiceKey =
  | "transfers"
  | "carRental"
  | "driver"
  | "groceries"
  | "chef"
  | "wellness"
  | "photo"
  | "dining"
  | "events";

export const SERVICES: { key: ServiceKey; icon: LucideIcon }[] = [
  { key: "transfers", icon: CarFront },
  { key: "carRental", icon: Car },
  { key: "driver", icon: UserRound },
  { key: "groceries", icon: ShoppingBasket },
  { key: "chef", icon: ChefHat },
  { key: "wellness", icon: Flower2 },
  { key: "photo", icon: Camera },
  { key: "dining", icon: UtensilsCrossed },
  { key: "events", icon: PartyPopper },
];

export const ZONE_KEYS = [
  "bavaro",
  "corales",
  "cortecito",
  "capCana",
  "cabezaToro",
  "bayahibe",
] as const;
export const ROUTE_KEYS = [
  "capCana",
  "puntaCana",
  "bavaro",
  "uvero",
  "bayahibe",
  "santoDomingo",
] as const;
export const VEHICLE_KEYS = ["sedan", "suv", "van", "minibus", "bus"] as const;
