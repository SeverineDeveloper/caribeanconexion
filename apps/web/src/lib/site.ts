export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * URL absoluta de un recurso que ya trae el basePath (p. ej. `image.src` de una imagen
 * importada). No se concatena con `siteUrl`: en GitHub Pages ambos llevan
 * "/caribeanconexion" y la ruta saldría duplicada.
 */
export function absoluteUrl(src: string): string {
  return new URL(src, siteUrl).href;
}

/** Número comercial principal (formato internacional sin "+"). */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "18292694285";
