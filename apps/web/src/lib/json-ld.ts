import { serializeJsonLd } from "@cc/core";

/** Props para dangerouslySetInnerHTML de un <script type="application/ld+json"> seguro. */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: serializeJsonLd(data) };
}
