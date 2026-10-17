/** Navegación principal de la web pública (las páginas llegan en M2). */
export const MAIN_NAV = [
  { href: "/alojamiento", key: "accommodation" },
  { href: "/traslados", key: "transfers" },
  { href: "/excursiones", key: "excursions" },
  { href: "/paquetes", key: "packages" },
  { href: "/servicios", key: "services" },
  { href: "/contacto", key: "contact" },
] as const;

export const COMPANY_NAV = [
  { href: "/grupos", key: "groups" },
  { href: "/agencias", key: "agencies" },
  { href: "/propietarios", key: "owners" },
  { href: "/contacto", key: "contact" },
] as const;
