import { jsonLd } from "@/lib/json-ld";

/** Bloque de datos estructurados schema.org, escapado para no poder cerrar el <script>. */
export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapado con jsonLd()
      dangerouslySetInnerHTML={jsonLd(data)}
    />
  );
}
