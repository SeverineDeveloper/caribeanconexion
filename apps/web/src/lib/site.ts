export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

/**
 * Si buscadores e IAs pueden indexar la web. La vista previa de GitHub Pages se compila con
 * SITE_NOINDEX=1: es una URL temporal y no debe competir con el dominio definitivo.
 * Producción no lo define. Staging ya va con X-Robots-Tag desde Caddy.
 */
export const indexable = process.env.SITE_NOINDEX !== "1";

/**
 * URL absoluta de un recurso que ya trae el basePath (p. ej. `image.src` de una imagen
 * importada). No se concatena con `siteUrl`: en GitHub Pages ambos llevan
 * "/caribeanconexion" y la ruta saldría duplicada.
 */
export function absoluteUrl(src: string): string {
  return new URL(src, `${siteUrl}/`).href;
}

/**
 * URL absoluta de una página, igual a su canonical: en el export estático
 * (trailingSlash) termina en "/".
 * @param path ruta sin idioma, "" para la portada, p. ej. "/excursiones/buggies"
 */
export function pageUrl(locale: string, path: string): string {
  const url = `${siteUrl}/${locale}${path}`;
  return process.env.STATIC_EXPORT === "1" ? `${url}/` : url;
}

/** Número comercial principal (formato internacional sin "+"). */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "18292694285";
