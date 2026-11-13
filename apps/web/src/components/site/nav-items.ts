/** Navegación principal de la web pública (las páginas llegan en M2). */
export const MAIN_NAV = [
  { href: "/alojamiento", key: "accommodation" },
  { href: "/traslados", key: "transfers" },
  { href: "/excursiones", key: "excursions" },
  { href: "/paquetes", key: "packages" },
  { href: "/servicios", key: "services" },
  { href: "/contacto", key: "contact" },
] as const;

/** Columna "Explora" del footer: la navegación principal (sin contacto) más las guías. */
export const EXPLORE_NAV = [
  ...MAIN_NAV.filter((item) => item.key !== "contact"),
  { href: "/guias", key: "guides" },
] as const;

export const COMPANY_NAV = [
  { href: "/sobre-nosotros", key: "about" },
  { href: "/grupos", key: "groups" },
  { href: "/agencias", key: "agencies" },
  { href: "/propietarios", key: "owners" },
  { href: "/contacto", key: "contact" },
] as const;
