/**
 * Datos públicos de la empresa para buscadores e IAs (JSON-LD de la organización y
 * llms.txt). Solo datos confirmados: lo que esté vacío no se publica.
 * Pendientes del cliente en docs/SEO.md (perfiles públicos, correo).
 */
export const BUSINESS = {
  name: "Conexión Caribe",
  /** Variante sin tilde, como la escribe mucha gente al buscar. */
  alternateName: "Conexion Caribe",
  /** Correo comercial público. Vacío hasta que el cliente lo confirme. */
  email: "",
  /** Sin dirección de calle: el equipo trabaja en la zona y atiende por WhatsApp. */
  address: { locality: "Punta Cana", region: "La Altagracia", country: "DO" },
  /** Zonas donde opera habitualmente (también en Footer.zones). */
  areaServed: ["Punta Cana", "Bávaro", "Cap Cana", "Bayahíbe", "La Romana"],
  /**
   * Perfiles públicos de la empresa: se publican como `sameAs` y ayudan a que Google y
   * las IAs la reconozcan como una sola entidad. Pegar aquí la URL cuando exista cada uno.
   */
  profiles: {
    googleBusiness: "",
    tripadvisor: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

/** URLs de los perfiles que ya existen. */
export function businessProfiles(): string[] {
  return Object.values(BUSINESS.profiles).filter((url) => url !== "");
}
