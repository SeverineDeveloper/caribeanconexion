/**
 * Serializa datos estructurados para <script type="application/ld+json">.
 * Escapa "<" para que un texto (p. ej. un título cargado desde el panel) no pueda cerrar el
 * <script> e inyectar HTML.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
