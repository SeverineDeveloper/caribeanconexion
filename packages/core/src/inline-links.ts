export type InlinePart =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Ruta interna del sitio: empieza por "/" pero no por "//" (eso sería otro dominio). */
function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * Separa un texto con enlaces estilo Markdown `[texto](/ruta)` en partes para renderizar.
 * Solo acepta rutas internas: cualquier otro destino se deja como texto plano, así un
 * contenido no puede sacar al lector del sitio ni inyectar `javascript:`.
 */
export function parseInlineLinks(input: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const match of input.matchAll(LINK)) {
    // Los dos grupos siempre capturan cuando hay coincidencia.
    const [whole, text = "", href = ""] = match;
    if (!isInternalPath(href)) continue;
    if (match.index > last) parts.push({ type: "text", text: input.slice(last, match.index) });
    parts.push({ type: "link", text, href });
    last = match.index + whole.length;
  }
  if (last < input.length) parts.push({ type: "text", text: input.slice(last) });
  return parts;
}

/** El mismo texto sin la sintaxis de enlaces (para metadatos, JSON-LD o llms.txt). */
export function stripInlineLinks(input: string): string {
  return parseInlineLinks(input)
    .map((part) => part.text)
    .join("");
}
